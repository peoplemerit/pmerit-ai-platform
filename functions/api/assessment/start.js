// /functions/api/assessment/start.js
// Cloudflare Worker - Assessment Start Endpoint

export default {
  async fetch(request, env, ctx) {
    // Handle CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      // Get user data from request
      const { userId, sessionId } = await request.json();
      
      // Generate session ID if not provided
      const assessmentSessionId = sessionId || crypto.randomUUID();
      
      // Connect to PostgreSQL database
      const { Client } = await import('pg');
      const client = new Client({
        connectionString: env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });

      await client.connect();

      // Start assessment session in database
      const sessionResult = await client.query(`
        INSERT INTO assessment_sessions (
          id, 
          user_id, 
          status, 
          started_at,
          session_type
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING id, started_at
      `, [
        assessmentSessionId,
        userId || 'guest',
        'in_progress',
        new Date(),
        'personality_assessment'
      ]);

      // Fetch first 3 assessment questions
      const questionsResult = await client.query(`
        SELECT 
          id,
          question_text,
          question_type,
          options,
          section,
          order_number
        FROM assessment_questions 
        WHERE section = 'quick_assessment'
        ORDER BY order_number 
        LIMIT 3
      `);

      await client.end();

      // Return session data and questions
      return new Response(JSON.stringify({
        success: true,
        sessionId: assessmentSessionId,
        startedAt: sessionResult.rows[0].started_at,
        questions: questionsResult.rows,
        totalQuestions: 3,
        currentQuestion: 1,
        message: 'Assessment started successfully'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

    } catch (error) {
      console.error('Assessment start error:', error);
      
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to start assessment',
        message: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};
