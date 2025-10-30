/**
 * PMERIT Tech Help Submit Function
 * Cloudflare Pages Function
 * 
 * Handles tech help ticket submissions
 * Stores tickets in Cloudflare KV and optionally sends email notifications
 */

export async function onRequestPost(context) {
  const {request, env} = context;

  try {
    // CORS headers
    const corsHeaders = {
      // TODO: Replace '*' with actual domain in production (e.g., 'https://peoplemerit.com')
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight request
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Parse request body
    const body = await request.json();

    // Validate required fields
    if (!body.message || !body.category) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields: message and category'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Sanitize inputs
    const ticket = {
      id: `TH-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      name: body.name || null,
      email: body.email || null,
      category: body.category,
      message: body.message.slice(0, 1000), // Limit message length
      meta: body.meta || {},
      status: 'new',
      createdAt: new Date().toISOString(),
      ip: request.headers.get('CF-Connecting-IP') || 'unknown',
      userAgent: request.headers.get('User-Agent') || 'unknown'
    };

    // Rate limiting check (simple IP-based)
    const rateLimitKey = `ratelimit:${ticket.ip}`;
    if (env.TECH_HELP_KV) {
      const recentSubmissions = await env.TECH_HELP_KV.get(rateLimitKey);
      if (recentSubmissions && parseInt(recentSubmissions) >= 5) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Rate limit exceeded. Please try again later.'
        }), {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
    }

    // Store ticket in KV
    if (env.TECH_HELP_KV) {
      try {
        // Store the ticket
        await env.TECH_HELP_KV.put(
          `ticket:${ticket.id}`,
          JSON.stringify(ticket),
          {
            expirationTtl: 60 * 60 * 24 * 90  // 90 days
          }
        );

        // Update rate limit counter
        const currentCount = await env.TECH_HELP_KV.get(rateLimitKey) || '0';
        await env.TECH_HELP_KV.put(
          rateLimitKey,
          (parseInt(currentCount) + 1).toString(),
          {
            expirationTtl: 60 * 60  // 1 hour
          }
        );

        console.log('✅ Ticket stored in KV:', ticket.id);
      } catch (error) {
        console.error('❌ Error storing ticket in KV:', error);
        // Continue even if KV storage fails
      }
    }

    // Send email notification (if webhook configured)
    if (env.TECH_HELP_EMAIL_WEBHOOK) {
      try {
        await fetch(env.TECH_HELP_EMAIL_WEBHOOK, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ticketId: ticket.id,
            category: ticket.category,
            message: ticket.message,
            meta: ticket.meta,
            createdAt: ticket.createdAt
          })
        });
        console.log('✅ Email notification sent for ticket:', ticket.id);
      } catch (error) {
        console.error('❌ Error sending email notification:', error);
        // Continue even if email fails
      }
    }

    // Return success response
    return new Response(JSON.stringify({
      success: true,
      ticketId: ticket.id,
      status: 'received',
      message: 'Your tech help request has been submitted successfully'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });

  } catch (error) {
    console.error('Error in tech help submit function:', error);
    
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
