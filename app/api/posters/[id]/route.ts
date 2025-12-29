import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { data, error } = await supabase
      .from('posters')
      .select(`
        *,
        category:categories(*),
        sizes:poster_sizes(*)
      `)
      .eq('id', id)
      .eq('status', 'active')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Poster not found' }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Increment view count
    await supabase
      .from('posters')
      .update({ views_count: (data.views_count || 0) + 1 })
      .eq('id', id);

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const { data: { user } } = await supabaseAdmin.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, artist, description, category_id, image_url, images, tags, is_featured, is_new, status, sizes } = body;

    const updateData: any = {};
    if (title) updateData.title = title;
    if (title) updateData.slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (artist) updateData.artist = artist;
    if (description !== undefined) updateData.description = description;
    if (category_id !== undefined) updateData.category_id = category_id;
    if (image_url) updateData.image_url = image_url;
    if (images) updateData.images = images;
    if (tags) updateData.tags = tags;
    if (is_featured !== undefined) updateData.is_featured = is_featured;
    if (is_new !== undefined) updateData.is_new = is_new;
    if (status) updateData.status = status;

    const { data: poster, error: posterError } = await supabaseAdmin
      .from('posters')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (posterError) {
      return NextResponse.json({ error: posterError.message }, { status: 400 });
    }

    // Update sizes if provided
    if (sizes) {
      // Delete existing sizes
      await supabaseAdmin.from('poster_sizes').delete().eq('poster_id', id);

      // Insert new sizes
      if (sizes.length > 0) {
        const sizesData = sizes.map((size: any) => ({
          poster_id: id,
          name: size.name,
          dimensions: size.dimensions,
          price: size.price,
          stock_quantity: size.stock_quantity || 0,
          is_available: size.is_available !== false,
          display_order: size.display_order || 0,
        }));

        await supabaseAdmin.from('poster_sizes').insert(sizesData);
      }
    }

    return NextResponse.json({ data: poster });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const { data: { user } } = await supabaseAdmin.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    // Delete sizes first (cascade should handle this, but being explicit)
    await supabaseAdmin.from('poster_sizes').delete().eq('poster_id', id);

    // Delete poster
    const { error } = await supabaseAdmin
      .from('posters')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Poster deleted successfully' });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

