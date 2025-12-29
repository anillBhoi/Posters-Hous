import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .order('created_at', { ascending: false });

    // If not admin, only show user's orders
    if (profile?.role !== 'admin') {
      query = query.eq('user_id', user.id);
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
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
    const body = await request.json();
    const {
      email,
      full_name,
      phone,
      shipping_address,
      billing_address,
      items,
      subtotal,
      tax_amount,
      shipping_amount,
      discount_amount,
      coupon_id,
      total_amount,
      payment_method,
      payment_id,
    } = body;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        email,
        full_name,
        phone,
        shipping_address: shipping_address,
        billing_address: billing_address || shipping_address,
        subtotal,
        tax_amount: tax_amount || 0,
        shipping_amount: shipping_amount || 0,
        discount_amount: discount_amount || 0,
        coupon_id,
        total_amount,
        payment_method,
        payment_id,
        status: 'pending',
        payment_status: payment_id ? 'paid' : 'pending',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Create order items
    if (items && items.length > 0) {
      const orderItems = items.map((item: any) => ({
        order_id: order.id,
        poster_id: item.poster_id,
        poster_title: item.poster_title,
        poster_image_url: item.poster_image_url,
        size_name: item.size_name,
        size_dimensions: item.size_dimensions,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      }));

      await supabase.from('order_items').insert(orderItems);
    }

    // Update coupon usage if applicable
    if (coupon_id) {
      await supabase.rpc('increment_coupon_usage', { coupon_id });
    }

    return NextResponse.json({ data: order }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

