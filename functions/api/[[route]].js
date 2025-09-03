/**
 * Cloudflare Workers API for PMERIT Platform
 * Handles all backend functionality including database integration
 * File: functions/api/[[route]].js
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS headers for all responses
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    };

    // Handle CORS preflight requests
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route API requests
      if (path.startsWith('/api/')) {
        const response = await handleApiRequest(request, env, path.substring(4));
        
        // Add CORS headers to API responses
        Object.entries(corsHeaders).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
        
        return response;
      }

      // Serve static assets (fallback)
      return new Response('Not Found', { status: 404 });

    } catch (error) {
      console.error('Worker error:', error);
      
      return new Response(JSON.stringify({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }
};

/**
 * Handle API requests
 */
async function handleApiRequest(request, env, path) {
  const method = request.method;
  const segments = path.split('/').filter(Boolean);
  
  // Health check endpoint
  if (path === 'health') {
    return handleHealthCheck(env);
  }
  
  // Assessment endpoints
  if (segments[0] === 'assessment') {
    if (segments[1] === 'questions' && method === 'GET') {
      return handleGetAssessmentQuestions(request, env);
    }
    if (segments[1] === 'submit' && method === 'POST') {
      return handleSubmitAssessment(request, env);
    }
  }
  
  // Chat endpoint
  if (segments[0] === 'chat' && method === 'POST') {
    return handleChatMessage(request, env);
  }
  
  // Authentication endpoints
  if (segments[0] === 'auth') {
    if (segments[1] === 'login' && method === 'POST') {
      return handleLogin(request, env);
    }
    if (segments[1] === 'register' && method === 'POST') {
      return handleRegister(request, env);
    }
    if (segments[1] === 'profile' && method === 'GET') {
      return handleGetProfile(request, env);
    }
  }

  return new Response('Not Found', { status: 404 });
}

/**
 * Health check endpoint
 */
async function handleHealthCheck(env) {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {}
  };

  // Check database connection
  try {
    if (env.DB) {
      const result = await env.DB.prepare('SELECT 1 as test').first();
      health.services.database = result ? 'connected' : 'error';
    } else {
      health.services.database = 'not_configured';
    }
  } catch (error) {
    health.services.database = 'error';
    health.database_error = error.message;
  }

  // Check AI service (optional)
  try {
    if (env.AI_API_URL) {
      // Ping AI service with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const aiResponse = await fetch(`${env.AI_API_URL}/health`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      health.services.ai = aiResponse.ok ? 'connected' : 'error';
    } else {
      health.services.ai = 'not_configured';
    }
  } catch (error) {
    health.services.ai = 'error';
  }

  // Determine overall status
  const hasErrors = Object.values(health.services).some(status => status === 'error');
  if (hasErrors) {
    health.status = 'degraded';
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;

  return new Response(JSON.stringify(health), {
    status: statusCode,
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * Get assessment questions from database
 */
async function handleGetAssessmentQuestions(request, env) {
  try {
    // Authentication check
    const authResult = await authenticateRequest(request, env);
    if (!authResult.success) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get assessment questions from database
    let questions = [];
    
    if (env.DB) {
      try {
        const result = await env.DB.prepare(`
          SELECT id, question_text, question_type, options, category
          FROM assessment_questions 
          WHERE is_active = 1 
          ORDER BY display_order
          LIMIT 10
        `).all();
        
        questions = result.results.map(row => ({
          id: row.id,
          question: row.question_text,
          type: row.question_type,
          options: row.options ? JSON.parse(row.options) : [],
          category: row.category
        }));
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Fall back to default questions
        questions = getDefaultAssessmentQuestions();
      }
    } else {
      // No database configured, use defaults
      questions = getDefaultAssessmentQuestions();
    }

    const assessmentData = {
      id: generateAssessmentId(),
      questions,
      userProfile: {
        userId: authResult.userId,
        isNew: !authResult.hasCompletedAssessment,
        source: env.DB ? 'database' : 'fallback'
      },
      metadata: {
        version: '1.0',
        language: 'en',
        estimatedDuration: questions.length * 30 // seconds
      }
    };

    return new Response(JSON.stringify(assessmentData), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Assessment error:', error);
    
    return new Response(JSON.stringify({
      error: 'Assessment Unavailable',
      message: 'Unable to load assessment questions'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Submit assessment responses
 */
async function handleSubmitAssessment(request, env) {
  try {
    const authResult = await authenticateRequest(request, env);
    if (!authResult.success) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await request.json();
    const { assessmentId, responses } = data;

    // Save responses to database
    if (env.DB) {
      try {
        // Insert assessment session
        const sessionResult = await env.DB.prepare(`
          INSERT INTO user_assessment_sessions (user_id, assessment_id, started_at, completed_at)
          VALUES (?, ?, ?, ?)
        `).bind(
          authResult.userId,
          assessmentId,
          new Date().toISOString(),
          new Date().toISOString()
        ).run();

        // Insert individual responses
        for (const response of responses) {
          await env.DB.prepare(`
            INSERT INTO user_responses (session_id, question_id, response_data, timestamp)
            VALUES (?, ?, ?, ?)
          `).bind(
            sessionResult.meta.last_row_id,
            response.questionId,
            JSON.stringify(response.answer),
            new Date().toISOString()
          ).run();
        }
      } catch (dbError) {
        console.error('Database save error:', dbError);
      }
    }

    // Generate learning path recommendations
    const recommendations = generateLearningPath(responses);

    return new Response(JSON.stringify({
      success: true,
      assessmentId,
      recommendations,
      message: 'Assessment completed successfully'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Submit assessment error:', error);
    
    return new Response(JSON.stringify({
      error: 'Submission Failed',
      message: 'Unable to process assessment responses'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Handle chat messages
 */
async function handleChatMessage(request, env) {
  try {
    const data = await request.json();
    const { message, context } = data;

    // Simple AI response (replace with actual AI integration)
    let aiResponse = "Thank you for your question! I'm here to help guide your learning journey.";
    
    // Basic keyword responses
    if (message.toLowerCase().includes('assessment')) {
      aiResponse = "Our assessment system analyzes your learning style and interests to create a personalized education plan. Would you like to begin your assessment?";
    } else if (message.toLowerCase().includes('course')) {
      aiResponse = "We offer courses in technology, business, healthcare, and more. Each course is tailored to your skill level and career goals.";
    } else if (message.toLowerCase().includes('career')) {
      aiResponse = "Our career guidance system uses real job market data to recommend career paths that match your skills and interests.";
    }

    // If AI service is configured, use it
    if (env.AI_API_URL) {
      try {
        const aiRequest = await fetch(`${env.AI_API_URL}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            context: context || 'general',
            system: 'You are Pmerit AI, a helpful educational assistant.'
          })
        });

        if (aiRequest.ok) {
          const aiData = await aiRequest.json();
          aiResponse = aiData.response || aiResponse;
        }
      } catch (aiError) {
        console.error('AI service error:', aiError);
        // Use fallback response
      }
    }

    return new Response(JSON.stringify({
      response: aiResponse,
      timestamp: new Date().toISOString(),
      context: context || 'general'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Chat error:', error);
    
    return new Response(JSON.stringify({
      error: 'Chat Unavailable',
      message: 'Unable to process chat message'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Authentication helpers
 */
async function authenticateRequest(request, env) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { success: false, error: 'No auth token' };
  }

  const token = authHeader.substring(7);
  
  // Simple token validation (replace with proper JWT validation)
  if (token === 'demo_token') {
    return { 
      success: true, 
      userId: 'demo_user',
      hasCompletedAssessment: false 
    };
  }

  // TODO: Implement proper JWT validation
  return { success: false, error: 'Invalid token' };
}

/**
 * Default assessment questions (fallback)
 */
function getDefaultAssessmentQuestions() {
  return [
    {
      id: 1,
      type: 'multiple_choice',
      question: 'What best describes your learning style?',
      options: [
        'Visual learner (I learn best by seeing)',
        'Auditory learner (I learn best by listening)', 
        'Kinesthetic learner (I learn best by doing)',
        'Reading/Writing learner (I learn best by reading and writing)'
      ],
      category: 'learning_style'
    },
    {
      id: 2,
      type: 'multiple_choice',
      question: 'What is your primary career interest?',
      options: [
        'Technology and Software Development',
        'Business and Entrepreneurship',
        'Healthcare and Medicine',
        'Education and Training',
        'Creative Arts and Design'
      ],
      category: 'career_interest'
    },
    {
      id: 3,
      type: 'rating',
      question: 'How comfortable are you with technology?',
      options: ['1 - Not comfortable', '2', '3', '4', '5 - Very comfortable'],
      category: 'tech_comfort'
    },
    {
      id: 4,
      type: 'multiple_choice',
      question: 'What is your highest level of education?',
      options: [
        'High School',
        'Some College',
        'Associates Degree',
        'Bachelors Degree',
        'Masters Degree or Higher'
      ],
      category: 'education_level'
    },
    {
      id: 5,
      type: 'multiple_choice',
      question: 'How many hours per week can you dedicate to learning?',
      options: [
        '1-3 hours',
        '4-6 hours',
        '7-10 hours',
        '11-15 hours',
        '16+ hours'
      ],
      category: 'time_commitment'
    }
  ];
}

/**
 * Generate learning path recommendations
 */
function generateLearningPath(responses) {
  // Simple recommendation logic (replace with AI-powered analysis)
  const recommendations = {
    primaryTrack: 'Technology',
    learningStyle: 'Visual',
    suggestedCourses: [
      'Introduction to Programming',
      'Web Development Fundamentals',
      'Database Design Basics'
    ],
    estimatedDuration: '3-6 months',
    difficultyLevel: 'Beginner'
  };

  // Analyze responses to customize recommendations
  responses.forEach(response => {
    if (response.questionId === 2) { // Career interest
      if (response.answer.includes('Technology')) {
        recommendations.primaryTrack = 'Technology';
      } else if (response.answer.includes('Business')) {
        recommendations.primaryTrack = 'Business';
        recommendations.suggestedCourses = [
          'Business Fundamentals',
          'Marketing Essentials',
          'Financial Planning'
        ];
      }
    }
  });

  return recommendations;
}

/**
 * Utility functions
 */
function generateAssessmentId() {
  return 'assessment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Additional endpoints (login, register, profile) would go here
 */
async function handleLogin(request, env) {
  // Placeholder for login functionality
  return new Response(JSON.stringify({
    token: 'demo_token',
    userId: 'demo_user',
    message: 'Login successful'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleRegister(request, env) {
  // Placeholder for registration functionality
  return new Response(JSON.stringify({
    message: 'Registration successful'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleGetProfile(request, env) {
  // Placeholder for profile functionality
  return new Response(JSON.stringify({
    userId: 'demo_user',
    name: 'Demo User',
    email: 'demo@pmerit.com'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
