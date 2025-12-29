import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('posters')
      .select(`
        *,
        category:categories(*),
        sizes:poster_sizes(*)
      `)
      .eq('status', 'active');

    // Apply filters
    if (category) {
      query = query.eq('category_id', category);
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,artist.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching posters:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Filter by price range if provided
    let filteredData = data || [];
    if (minPrice || maxPrice) {
      filteredData = filteredData.filter((poster: any) => {
        const prices = poster.sizes?.map((s: any) => parseFloat(s.price)) || [];
        if (prices.length === 0) return false;
        const minPosterPrice = Math.min(...prices);
        const maxPosterPrice = Math.max(...prices);
        
        if (minPrice && maxPrice) {
          return minPosterPrice >= parseFloat(minPrice) && maxPosterPrice <= parseFloat(maxPrice);
        } else if (minPrice) {
          return maxPosterPrice >= parseFloat(minPrice);
        } else if (maxPrice) {
          return minPosterPrice <= parseFloat(maxPrice);
        }
        return true;
      });
    }

    // Get total count
    let countQuery = supabase
      .from('posters')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    if (category) {
      countQuery = countQuery.eq('category_id', category);
    }
    if (featured === 'true') {
      countQuery = countQuery.eq('is_featured', true);
    }

    const { count: totalCount } = await countQuery;

    return NextResponse.json({
      data: filteredData,
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('[api/posters] POST received');
    const authHeader = request.headers.get('authorization');
    console.log('[api/posters] authHeader present:', !!authHeader);
    if (!authHeader) {
      console.log('[api/posters] missing authorization header');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    // Verify admin role
    const { data: { user } } = await supabaseAdmin.auth.getUser();
    console.log('[api/posters] supabase.getUser user id:', user?.id);
    if (!user) {
      console.log('[api/posters] no user from supabase.getUser');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    console.log('[api/posters] profile role:', profile?.role);
    if (profile?.role !== 'admin') {
      console.log('[api/posters] user is not admin');
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    console.log('[api/posters] request body:', { title: body.title, sizes: (body.sizes || []).length });
    const { title, artist, description, category_id, image_url, images, tags, is_featured, is_new, sizes } = body;

    // Create poster
    const { data: poster, error: posterError } = await supabaseAdmin
      .from('posters')
      .insert({
        title,
        slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        artist,
        description,
        category_id,
        image_url,
        images: images || [],
        tags: tags || [],
        is_featured: is_featured || false,
        is_new: is_new || false,
        status: 'active',
      })
      .select()
      .single();

    if (posterError) {
      console.log('[api/posters] poster insert error:', posterError);
      return NextResponse.json({ error: posterError.message }, { status: 400 });
    }

    console.log('[api/posters] poster created id:', poster?.id);

    // Create sizes
    if (sizes && sizes.length > 0) {
      const sizesData = sizes.map((size: any) => ({
        poster_id: poster.id,
        name: size.name,
        dimensions: size.dimensions,
        price: size.price,
        stock_quantity: size.stock_quantity || 0,
        is_available: size.is_available !== false,
        display_order: size.display_order || 0,
      }));

      const { error: sizesError } = await supabaseAdmin
        .from('poster_sizes')
        .insert(sizesData);

      if (sizesError) {
        console.log('[api/posters] sizes insert error:', sizesError);
        // Rollback poster creation
        await supabaseAdmin.from('posters').delete().eq('id', poster.id);
        return NextResponse.json({ error: sizesError.message }, { status: 400 });
      }

      console.log('[api/posters] sizes inserted:', sizesData.length);
    }

    return NextResponse.json({ data: poster }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

