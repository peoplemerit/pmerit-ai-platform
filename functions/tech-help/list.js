/**
 * PMERIT Tech Help List Function
 * Cloudflare Pages Function
 * 
 * Lists tech help tickets (admin only)
 * Retrieves tickets from Cloudflare KV with pagination
 */

export async function onRequestGet(context) {
  const {request, env} = context;

  try {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',  // TODO: Restrict to actual domain in production
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight request
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // TODO: Add authentication check
    // const authHeader = request.headers.get('Authorization');
    // if (!authHeader || !isValidToken(authHeader)) {
    //   return new Response(JSON.stringify({
    //     success: false,
    //     error: 'Unauthorized'
    //   }), {
    //     status: 401,
    //     headers: { 'Content-Type': 'application/json', ...corsHeaders }
    //   });
    // }

    // Get query parameters
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const perPage = Math.min(parseInt(url.searchParams.get('perPage') || '20'), 100);
    const status = url.searchParams.get('status') || 'all';

    if (!env.TECH_HELP_KV) {
      return new Response(JSON.stringify({
        success: false,
        error: 'KV namespace not configured'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // List all ticket keys
    const listResult = await env.TECH_HELP_KV.list({
      prefix: 'ticket:',
      limit: 1000  // Cloudflare KV list limit
    });

    // Fetch all tickets
    const tickets = [];
    for (const key of listResult.keys) {
      const ticketData = await env.TECH_HELP_KV.get(key.name);
      if (ticketData) {
        const ticket = JSON.parse(ticketData);
        
        // Filter by status if specified
        if (status === 'all' || ticket.status === status) {
          tickets.push(ticket);
        }
      }
    }

    // Sort tickets by creation date (newest first)
    tickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Paginate results
    const totalTickets = tickets.length;
    const totalPages = Math.ceil(totalTickets / perPage);
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedTickets = tickets.slice(startIndex, endIndex);

    // Return response
    return new Response(JSON.stringify({
      success: true,
      tickets: paginatedTickets,
      pagination: {
        page: page,
        perPage: perPage,
        total: totalTickets,
        pages: totalPages
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });

  } catch (error) {
    console.error('Error in tech help list function:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
