// /functions/api/assessment/start.js
// Cloudflare Worker - PMERIT Assessment Start Endpoint (aligned with assessment.html frontend)

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
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
      // Parse request
      const body = await request.json();
      const { mode, user_agent, timestamp, userId, sessionId } = body || {};

      // Generate session ID if not provided
      const assessmentSessionId = sessionId || crypto.randomUUID();
      const user_id = userId || 'guest';

      // Mode: 'quickstart' or 'comprehensive'
      const sectionMode = (mode === 'comprehensive') ? 'comprehensive' : 'quickstart';

      // Connect to PostgreSQL
      const { Client } = await import('pg');
      const client = new Client({
        connectionString: env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });
      await client.connect();

      // Insert session row
      const sessionResult = await client.query(`
        INSERT INTO assessment_sessions (
          id, user_id, status, started_at, session_type, user_agent
        ) VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO NOTHING
        RETURNING id, started_at
      `, [
        assessmentSessionId,
        user_id,
        'in_progress',
        new Date(timestamp || Date.now()),
        sectionMode === 'comprehensive' ? 'personality_assessment_comprehensive' : 'personality_assessment_quick',
        user_agent || ''
      ]);

      // Compose sections
      // Each section: { id, title, type, questions }
      // Questions: id, text, type, options, placeholder, maxLength
      const sections = [];

      // Section 1: Personality Profile (Big Five, Likert)
      const personalityQuestions = await client.query(`
        SELECT id, question_text AS text, question_type AS type, options
        FROM assessment_questions
        WHERE section = 'personality' AND enabled = true
        ORDER BY order_number ASC
        LIMIT $1
      `, [sectionMode === 'comprehensive' ? 12 : 5]);
      sections.push({
        id: 'personality',
        title: 'Personality Profile',
        type: 'big_five',
        questions: personalityQuestions.rows.map((q, i) => ({
          id: `personality_${i + 1}`,
          text: q.text,
          type: 'likert'
        }))
      });

      // Section 2: Work Preferences (Multiple Choice)
      const prefQuestions = await client.query(`
        SELECT id, question_text AS text, options
        FROM assessment_questions
        WHERE section = 'preferences' AND enabled = true
        ORDER BY order_number ASC
        LIMIT $1
      `, [sectionMode === 'comprehensive' ? 5 : 3]);
      sections.push({
        id: 'preferences',
        title: 'Work Preferences',
        type: 'multiple_choice',
        questions: prefQuestions.rows.map((q, i) => ({
          id: `preferences_${i + 1}`,
          text: q.text,
          type: 'multiple_choice',
          options: q.options
        }))
      });

      // Section 3: Motivations & Values (Open Ended)
      const motivQuestions = await client.query(`
        SELECT id, question_text AS text
        FROM assessment_questions
        WHERE section = 'motivations' AND enabled = true
        ORDER BY order_number ASC
        LIMIT 2
      `);
      sections.push({
        id: 'motivations',
        title: 'Motivations & Values',
        type: 'open_ended',
        questions: motivQuestions.rows.map((q, i) => ({
          id: `motivations_${i + 1}`,
          text: q.text,
          type: 'open_ended',
          placeholder: 'Share your motivations or values...',
          maxLength: 500
        }))
      });

      // Section 4: Skills & Experience (Mixed)
      const skillQuestions = await client.query(`
        SELECT id, question_text AS text, question_type AS type, options
        FROM assessment_questions
        WHERE section = 'skills' AND enabled = true
        ORDER BY order_number ASC
        LIMIT 3
      `);
      sections.push({
        id: 'skills',
        title: 'Skills & Experience',
        type: 'mixed',
        questions: skillQuestions.rows.map((q, i) => ({
          id: `skills_${i + 1}`,
          text: q.text,
          type: q.type === 'likert' ? 'likert' : q.type === 'multiple_choice' ? 'multiple_choice' : 'open_ended',
          options: q.options || undefined,
          placeholder: q.type === 'open_ended' ? 'Describe your skills...' : undefined,
          maxLength: q.type === 'open_ended' ? 500 : undefined
        }))
      });

      // Section 5: Work Context (Multiple Choice)
      const contextQuestions = await client.query(`
        SELECT id, question_text AS text, options
        FROM assessment_questions
        WHERE section = 'context' AND enabled = true
        ORDER BY order_number ASC
        LIMIT 2
      `);
      sections.push({
        id: 'context',
        title: 'Work Context',
        type: 'multiple_choice',
        questions: contextQuestions.rows.map((q, i) => ({
          id: `context_${i + 1}`,
          text: q.text,
          type: 'multiple_choice',
          options: q.options
        }))
      });

      await client.end();

      // Response format for assessment.html JS
      return new Response(JSON.stringify({
        success: true,
        session_id: assessmentSessionId,
        started_at: sessionResult.rows[0]?.started_at || new Date().toISOString(),
        sections,
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
