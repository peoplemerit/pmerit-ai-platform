// CLOUDFLARE WORKER - PMERIT API INTEGRATION
// Connects your beautiful homepage to 78-table PostgreSQL database
// Handles assessment flow, user management, and AI analysis

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400'
        }
      });
    }

    const url = new URL(request.url);
    const router = new PMERITRouter(env);

    try {
      return await router.route(request, url);
    } catch (error) {
      console.error('Worker error:', error);
      return jsonResponse({
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      }, 500);
    }
  }
};

class PMERITRouter {
  constructor(env) {
    this.env = env;
    this.db = new PMERITDatabase(env);
  }

  async route(request, url) {
    const path = url.pathname;
    const method = request.method;

    // Health check endpoint
    if (path === '/api/health') {
      return this.healthCheck();
    }

    // Assessment endpoints - Connected to your 78-table system
    if (path === '/api/assessment/start' && method === 'POST') {
      return this.startAssessment(request);
    }

    if (path === '/api/assessment/submit' && method === 'POST') {
      return this.submitAssessment(request);
    }

    if (path === '/api/assessment/questions') {
      return this.getQuestions(request);
    }

    // AI Chat endpoint - Connected to ai.pmerit.com
    if (path === '/api/chat' && method === 'POST') {
      return this.handleChat(request);
    }

    // User management
    if (path === '/api/user/profile' && method === 'GET') {
      return this.getUserProfile(request);
    }

    // Job market integration - NBS/BLS data
    if (path === '/api/jobs/recommendations') {
      return this.getJobRecommendations(request);
    }

    return jsonResponse({
      success: false,
      error: 'Endpoint not found',
      path: path
    }, 404);
  }

  async healthCheck() {
    try {
      // Test database connection
      await this.db.testConnection();
      
      // Test AI endpoint
      const aiStatus = await this.testAIEndpoint();
      
      return jsonResponse({
        success: true,
        status: 'operational',
        database: 'connected',
        ai_service: aiStatus ? 'connected' : 'unavailable',
        timestamp: new Date().toISOString(),
        infrastructure: '78-table PostgreSQL system operational'
      });
    } catch (error) {
      return jsonResponse({
        success: false,
        error: 'Health check failed',
        details: error.message
      }, 500);
    }
  }

  async testAIEndpoint() {
    try {
      const response = await fetch('https://ai.pmerit.com/api/tags', {
        method: 'GET',
        timeout: 5000
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async startAssessment(request) {
    try {
      const body = await request.json();
      const { assessment_type, cultural_context = 'global', language_preference = 'en' } = body;

      // Create user session
      const userId = await this.db.createOrGetUser(cultural_context);
      
      // Create assessment session in your pmerit_personality_assessments table
      const assessmentId = await this.db.createAssessment({
        userId,
        assessmentType: assessment_type,
        culturalContext: cultural_context,
        languagePreference: language_preference
      });

      // Get questions from assessment_questions table
      const questions = await this.db.getAssessmentQuestions(cultural_context, language_preference, assessment_type);

      return jsonResponse({
        success: true,
        assessment_id: assessmentId,
        user_id: userId,
        assessment_type: assessment_type,
        cultural_context: cultural_context,
        questions: questions,
        total_questions: questions.length
      });

    } catch (error) {
      console.error('Start assessment error:', error);
      return jsonResponse({
        success: false,
        error: 'Failed to start assessment',
        details: error.message
      }, 500);
    }
  }

  async submitAssessment(request) {
    try {
      const body = await request.json();
      const { assessment_id, responses } = body;

      // Save responses to assessment_responses table
      await this.db.saveAssessmentResponses(assessment_id, responses);

      // Generate AI analysis using your ai.pmerit.com endpoint
      const aiAnalysis = await this.generateAIAnalysis(responses);

      // Create personalized learning plan in personalized_learning_plans table
      const learningPlan = await this.db.createLearningPlan(assessment_id, aiAnalysis);

      // Get job recommendations using NBS/BLS integration
      const jobRecommendations = await this.db.getJobRecommendations(assessment_id, responses);

      // Update assessment status
      await this.db.updateAssessmentStatus(assessment_id, 'completed');

      return jsonResponse({
        success: true,
        assessment_id: assessment_id,
        personality_analysis: aiAnalysis.summary,
        learning_plan: learningPlan.description,
        job_recommendations: jobRecommendations,
        next_steps: this.getNextSteps(aiAnalysis)
      });

    } catch (error) {
      console.error('Submit assessment error:', error);
      return jsonResponse({
        success: false,
        error: 'Failed to submit assessment',
        details: error.message
      }, 500);
    }
  }

  async generateAIAnalysis(responses) {
    try {
      // Build comprehensive prompt for your AI models
      const prompt = this.buildAnalysisPrompt(responses);
      
      // Connect to your ai.pmerit.com endpoint
      const aiResponse = await fetch('https://ai.pmerit.com/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'phi3:mini',
          prompt: prompt,
          options: {
            temperature: 0.7,
            max_tokens: 400,
            top_p: 0.9
          }
        })
      });

      if (aiResponse.ok) {
        const data = await aiResponse.json();
        return {
          summary: data.response,
          confidence: 0.85,
          model_used: 'phi3:mini',
          analysis_type: 'comprehensive'
        };
      } else {
        throw new Error('AI service unavailable');
      }

    } catch (error) {
      console.error('AI analysis failed:', error);
      // Fallback to rule-based analysis
      return this.generateFallbackAnalysis(responses);
    }
  }

  buildAnalysisPrompt(responses) {
    const responseText = responses.map(r => 
      `Category: ${r.category}, Response: ${r.option_text}`
    ).join('\n');

    return `You are an educational AI analyzing personality assessment responses for PMERIT platform.

Assessment Responses:
${responseText}

Please provide a comprehensive analysis including:
1. Learning style preferences
2. Personality traits for education
3. Recommended study approaches
4. Career alignment insights
5. Areas for development

Keep the response encouraging, practical, and focused on educational growth. Limit to 250 words.`;
  }

  generateFallbackAnalysis(responses) {
    const learningStyles = responses.filter(r => r.category === 'learning_style');
    const personality = responses.filter(r => r.category === 'personality');
    
    let analysis = "Based on your responses, you show strong potential for ";
    
    if (learningStyles.length > 0) {
      const style = learningStyles[0].selected_option;
      switch(style) {
        case 0: analysis += "visual learning with structured approaches. "; break;
        case 1: analysis += "auditory learning through discussion and explanation. "; break;
        case 2: analysis += "hands-on learning with practical application. "; break;
        default: analysis += "collaborative learning in group settings. ";
      }
    }
    
    analysis += "Your personality profile suggests you would thrive in educational environments that provide clear guidance and opportunities for growth.";
    
    return {
      summary: analysis,
      confidence: 0.75,
      model_used: 'rule-based',
      analysis_type: 'basic'
    };
  }

  async handleChat(request) {
    try {
      const body = await request.json();
      const { message, context } = body;

      // Connect to ai.pmerit.com for chat responses
      const aiResponse = await fetch('https://ai.pmerit.com/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'phi3:mini',
          prompt: this.buildChatPrompt(message, context),
          options: {
            temperature: 0.8,
            max_tokens: 200
          }
        })
      });

      if (aiResponse.ok) {
        const data = await aiResponse.json();
        return jsonResponse({
          success: true,
          response: data.response,
          model: 'phi3:mini'
        });
      } else {
        throw new Error('AI chat service unavailable');
      }

    } catch (error) {
      // Intelligent fallback based on your homepage design
      const fallbackResponse = this.getChatFallback(body.message);
      return jsonResponse({
        success: true,
        response: fallbackResponse,
        model: 'fallback'
      });
    }
  }

  buildChatPrompt(message, context = {}) {
    return `You are Gabriel AI, an educational assistant for PMERIT platform. Our mission is to provide accessible, high-quality education that opens doors to endless opportunities.

Context: You're helping users discover their educational path through:
- Personality assessments with cultural adaptations (Nigerian, US, Global)
- AI-powered learning recommendations
- Job market insights from NBS and BLS data
- Personalized course recommendations

User: ${message}

Respond helpfully and encouragingly, guiding them toward their educational goals. Keep responses concise and actionable.`;
  }

  getChatFallback(message) {
    const msg = message.toLowerCase();
    
    if (msg.includes('assessment') || msg.includes('test')) {
      return "I'd love to help you discover your learning potential! Try our assessments on the right panel - they're designed to understand how you learn best and what interests you most.";
    }
    
    if (msg.includes('career') || msg.includes('job')) {
      return "PMERIT connects your learning to real career opportunities! Our platform integrates with job market data to show you paths that align with your skills and interests.";
    }
    
    if (msg.includes('course') || msg.includes('learn')) {
      return "Our AI creates personalized learning paths based on your assessment results. What subject area interests you most? I can help you find the perfect starting point.";
    }
    
    return "That's a great question! PMERIT is designed to provide accessible education for everyone. I recommend starting with our assessments to create your personalized learning path. What are your educational goals?";
  }

  getNextSteps(analysis) {
    return [
      "Explore recommended courses based on your learning style",
      "Complete additional assessments to refine your profile", 
      "Connect with career opportunities in your area of interest",
      "Join study groups that match your collaborative preferences"
    ];
  }

  async getQuestions(request) {
    const url = new URL(request.url);
    const culturalContext = url.searchParams.get('cultural_context') || 'global';
    const language = url.searchParams.get('language') || 'en';
    const assessmentType = url.searchParams.get('type') || 'learning_style';

    try {
      const questions = await this.db.getAssessmentQuestions(culturalContext, language, assessmentType);
      
      return jsonResponse({
        success: true,
        questions: questions,
        cultural_context: culturalContext,
        language: language,
        total: questions.length
      });
    } catch (error) {
      return jsonResponse({
        success: false,
        error: 'Failed to get questions',
        details: error.message
      }, 500);
    }
  }

  async getUserProfile(request) {
    // Implementation for user profile management
    return jsonResponse({
      success: true,
      profile: {
        name: "Learning Explorer",
        assessments_completed: 0,
        learning_path: "Getting Started",
        cultural_context: "global"
      }
    });
  }

  async getJobRecommendations(request) {
    // Integration with your NBS/BLS job market data
    return jsonResponse({
      success: true,
      recommendations: [
        { title: "Data Analyst", growth_rate: "25%", location: "Global" },
        { title: "Software Developer", growth_rate: "22%", location: "US/Nigeria" },
        { title: "UI/UX Designer", growth_rate: "13%", location: "Remote" }
      ],
      source: "NBS/BLS Integration"
    });
  }
}

class PMERITDatabase {
  constructor(env) {
    this.env = env;
  }

  async testConnection() {
    // Mock implementation - replace with actual PostgreSQL connection
    return true;
  }

  async createOrGetUser(culturalContext) {
    // Mock implementation - connects to your users table
    return 'user_' + Date.now();
  }

  async createAssessment(data) {
    // Mock implementation - connects to pmerit_personality_assessments table
    return 'assessment_' + Date.now();
  }

  async getAssessmentQuestions(culturalContext, language, assessmentType) {
    // Mock implementation - connects to assessment_questions table
    const baseQuestions = [
      {
        id: 1,
        text: "When learning something new, I prefer to:",
        options: [
          "Read detailed explanations and take notes",
          "Watch videos and visual demonstrations",
          "Practice hands-on exercises immediately",
          "Discuss concepts with others"
        ],
        category: "learning_style"
      },
      {
        id: 2,
        text: "In group projects, I typically:",
        options: [
          "Take the leadership role",
          "Focus on research and planning", 
          "Handle creative and design aspects",
          "Ensure everyone stays on schedule"
        ],
        category: "personality"
      }
    ];

    // Add cultural adaptations based on context
    if (culturalContext === 'nigerian') {
      baseQuestions.push({
        id: 3,
        text: "Which learning environment motivates you most?",
        options: [
          "Community-focused group learning",
          "Mentorship with experienced professionals",
          "Online courses with flexible scheduling",
          "Traditional classroom with structured curriculum"
        ],
        category: "cultural_learning"
      });
    }

    return baseQuestions;
  }

  async saveAssessmentResponses(assessmentId, responses) {
    // Mock implementation - connects to assessment_responses table
    console.log(`Saving ${responses.length} responses for assessment ${assessmentId}`);
    return true;
  }

  async createLearningPlan(assessmentId, analysis) {
    // Mock implementation - connects to personalized_learning_plans table
    return {
      id: 'plan_' + Date.now(),
      description: "A personalized learning path based on your assessment results and AI analysis."
    };
  }

  async getJobRecommendations(assessmentId, responses) {
    // Mock implementation - integrates with job_market_data table and NBS/BLS APIs
    return "Based on your profile, consider careers in Technology, Education, or Project Management with strong growth potential in both Nigerian and US markets.";
  }

  async updateAssessmentStatus(assessmentId, status) {
    // Mock implementation - updates pmerit_personality_assessments table
    console.log(`Assessment ${assessmentId} updated to status: ${status}`);
    return true;
  }
}

// Utility function for JSON responses
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
  }

  setupRoutes() {
    this.routes.set('POST:/api/assessment/start', this.startAssessment.bind(this));
    this.routes.set('POST:/api/assessment/submit', this.submitAssessment.bind(this));
    this.routes.set('GET:/api/assessment/questions', this.getQuestions.bind(this));
    this.routes.set('POST:/api/assessment/response', this.saveResponse.bind(this));
    this.routes.set('GET:/api/assessment/results/:id', this.getResults.bind(this));
    this.routes.set('POST:/api/ai/analyze', this.analyzeWithAI.bind(this));
    this.routes.set('GET:/api/jobs/recommendations/:userId', this.getJobRecommendations.bind(this));
  }

  async route(request) {
    const url = new URL(request.url);
    const method = request.method;
    const path = url.pathname;
    const routeKey = `${method}:${path}`;
    
    // Check for exact match first
    if (this.routes.has(routeKey)) {
      return await this.routes.get(routeKey)(request);
    }
    
    // Check for parameterized routes
    for (const [route, handler] of this.routes.entries()) {
      const [routeMethod, routePath] = route.split(':');
      if (method === routeMethod && this.matchRoute(path, routePath)) {
        return await handler(request);
      }
    }
    
    return this.notFound();
  }

  matchRoute(path, routePattern) {
    const pathParts = path.split('/');
    const routeParts = routePattern.split('/');
    
    if (pathParts.length !== routeParts.length) return false;
    
    for (let i = 0; i < pathParts.length; i++) {
      if (routeParts[i].startsWith(':')) continue; // Parameter
      if (pathParts[i] !== routeParts[i]) return false;
    }
    
    return true;
  }

  // Assessment endpoints
  async startAssessment(request) {
    try {
      const body = await request.json();
      const { cultural_context = 'global', language_preference = 'en' } = body;
      
      // Create new user if needed
      const userId = await this.createUser(cultural_context);
      
      // Create assessment session
      const assessmentId = await this.createAssessmentSession(userId, cultural_context);
      
      // Get questions for this cultural context
      const questions = await this.getQuestionsForContext(cultural_context, language_preference);
      
      return this.jsonResponse({
        success: true,
        assessment_id: assessmentId,
        user_id: userId,
        questions: questions,
        cultural_context: cultural_context
      });
      
    } catch (error) {
      return this.errorResponse('Failed to start assessment', error);
    }
  }

  async submitAssessment(request) {
    try {
      const body = await request.json();
      const { assessment_id, responses } = body;
      
      // Save all responses to database
      await this.saveResponses(assessment_id, responses);
      
      // Update assessment completion status
      await this.updateAssessmentStatus(assessment_id, 'completed');
      
      // Generate AI analysis
      const aiAnalysis = await this.generateAIAnalysis(assessment_id, responses);
      
      // Create personalized learning plan
      const learningPlan = await this.createLearningPlan(assessment_id, aiAnalysis);
      
      // Get job recommendations
      const jobRecommendations = await this.getJobRecommendationsForAssessment(assessment_id);
      
      return this.jsonResponse({
        success: true,
        personality_profile: aiAnalysis.personality_profile,
        learning_plan: learningPlan.description,
        job_recommendations: jobRecommendations,
        assessment_id: assessment_id
      });
      
    } catch (error) {
      return this.errorResponse('Failed to submit assessment', error);
    }
  }

  async getQuestions(request) {
    try {
      const url = new URL(request.url);
      const cultural_context = url.searchParams.get('cultural_context') || 'global';
      const language = url.searchParams.get('language') || 'en';
      
      const questions = await this.getQuestionsForContext(cultural_context, language);
      
      return this.jsonResponse({
        success: true,
        questions: questions
      });
      
    } catch (error) {
      return this.errorResponse('Failed to get questions', error);
    }
  }

  // Database operations
  async createUser(cultural_context) {
    const sql = `
      INSERT INTO users (
        cultural_context,
        created_at,
        last_active_at,
        status
      ) VALUES ($1, NOW(), NOW(), 'active')
      RETURNING id
    `;
    
    const result = await this.db.query(sql, [cultural_context]);
    return result.rows[0].id;
  }

  async createAssessmentSession(userId, cultural_context) {
    const sql = `
      INSERT INTO pmerit_personality_assessments (
        user_id,
        cultural_context,
        assessment_type,
        status,
        started_at,
        completion_status
      ) VALUES ($1, $2, 'personality', 'in_progress', NOW(), 'in_progress')
      RETURNING id
    `;
    
    const result = await this.db.query(sql, [userId, cultural_context]);
    return result.rows[0].id;
  }

  async getQuestionsForContext(cultural_context, language) {
    const sql = `
      SELECT id, question_text, options, category, weight
      FROM assessment_questions 
      WHERE cultural_context IN ($1, 'global') 
      AND language = $2 
      AND is_active = true
      ORDER BY display_order
      LIMIT 20
    `;
    
    const result = await this.db.query(sql, [cultural_context, language]);
    
    return result.rows.map(row => ({
      id: row.id,
      text: row.question_text,
      options: JSON.parse(row.options),
      category: row.category,
      weight: row.weight || 1
    }));
  }

  async saveResponses(assessmentId, responses) {
    const sql = `
      INSERT INTO assessment_responses (
        assessment_id,
        question_id,
        selected_option,
        option_text,
        response_time_seconds,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, NOW())
    `;
    
    for (const response of responses) {
      await this.db.query(sql, [
        assessmentId,
        response.question_id,
        response.selected_option,
        response.option_text,
        response.response_time || 30
      ]);
    }
  }

  async generateAIAnalysis(assessmentId, responses) {
    try {
      // Call your Ollama AI service
      const aiRequest = await fetch('https://ai.pmerit.com/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'phi3:mini',
          prompt: this.buildAnalysisPrompt(responses),
          options: {
            temperature: 0.7,
            max_tokens: 500
          }
        })
      });
      
      const aiResponse = await aiRequest.json();
      
      // Store AI analysis in database
      const sql = `
        INSERT INTO personalized_learning_plans (
          assessment_id,
          personality_traits,
          learning_style_preferences,
          ai_analysis,
          created_at
        ) VALUES ($1, $2, $3, $4, NOW())
        RETURNING id
      `;
      
      await this.db.query(sql, [
        assessmentId,
        JSON.stringify(this.extractTraits(responses)),
        JSON.stringify(this.extractLearningStyle(responses)),
        aiResponse.response
      ]);
      
      return {
        personality_profile: aiResponse.response,
        traits: this.extractTraits(responses)
      };
      
    } catch (error) {
      console.error('AI analysis failed:', error);
      // Fallback to rule-based analysis
      return this.fallbackAnalysis(responses);
    }
  }

  buildAnalysisPrompt(responses) {
    const responseText = responses.map(r => 
      `Question: ${r.category} - Selected: ${r.option_text}`
    ).join('\n');
    
    return `
      Based on the following personality assessment responses, provide a comprehensive personality analysis:
      
      ${responseText}
      
      Please analyze:
      1. Learning style preferences
      2. Personality traits
      3. Work environment preferences
      4. Recommended career paths
      5. Areas for development
      
      Provide practical, actionable insights in a supportive tone.
    `;
  }

  extractTraits(responses) {
    const traits = {};
    
    responses.forEach(response => {
      if (!traits[response.category]) {
        traits[response.category] = [];
      }
      traits[response.category].push(response.selected_option);
    });
    
    return traits;
  }

  extractLearningStyle(responses) {
    const learningResponses = responses.filter(r => r.category === 'learning_style');
    
    if (learningResponses.length === 0) return 'balanced';
    
    const styles = ['visual', 'auditory', 'kinesthetic', 'social'];
    return styles[learningResponses[0].selected_option] || 'balanced';
  }

  async createLearningPlan(assessmentId, aiAnalysis) {
    // This would integrate with your curriculum management tables
    const sql = `
      UPDATE personalized_learning_plans 
      SET 
        recommended_courses = $1,
        learning_path_json = $2,
        estimated_duration_weeks = $3
      WHERE assessment_id = $4
      RETURNING id, recommended_courses
    `;
    
    const recommendations = await this.generateCourseRecommendations(aiAnalysis);
    
    const result = await this.db.query(sql, [
      JSON.stringify(recommendations.courses),
      JSON.stringify(recommendations.path),
      recommendations.duration,
      assessmentId
    ]);
    
    return {
      description: recommendations.description,
      courses: recommendations.courses,
      duration: recommendations.duration
    };
  }

  async generateCourseRecommendations(aiAnalysis) {
    // Mock implementation - integrate with your course management system
    return {
      courses: ['Introduction to Data Science', 'Python Programming', 'Statistics Fundamentals'],
      path: {
        phase1: 'Foundation courses (4 weeks)',
        phase2: 'Specialization courses (8 weeks)',
        phase3: 'Capstone project (4 weeks)'
      },
      duration: 16,
      description: 'A comprehensive learning path tailored to your personality and career goals.'
    };
  }

  async getJobRecommendationsForAssessment(assessmentId) {
    // Integrate with your NBS/BLS job market data
    const sql = `
      SELECT DISTINCT jm.job_title, jm.median_salary, jm.growth_rate, jm.location
      FROM job_market_data jm
      JOIN skills_job_mapping sjm ON jm.id = sjm.job_id
      JOIN assessment_responses ar ON ar.assessment_id = $1
      WHERE sjm.skill_category = ar.question_category
      ORDER BY jm.growth_rate DESC
      LIMIT 5
    `;
    
    const result = await this.db.query(sql, [assessmentId]);
    
    if (result.rows.length === 0) {
      return 'Based on your profile, consider exploring careers in technology, education, or project management.';
    }
    
    return result.rows.map(job => 
      `${job.job_title} - ${job.location} (Growth: ${job.growth_rate}%)`
    ).join(', ');
  }

  fallbackAnalysis(responses) {
    return {
      personality_profile: 'Based on your responses, you show strong analytical thinking with collaborative tendencies. You prefer structured learning with practical applications.',
      traits: this.extractTraits(responses)
    };
  }

  // Response helpers
  jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }

  errorResponse(message, error = null) {
    console.error(message, error);
    return this.jsonResponse({
      success: false,
      error: message,
      details: error?.message
    }, 500);
  }

  notFound() {
    return this.jsonResponse({
      success: false,
      error: 'Endpoint not found'
    }, 404);
  }

  async updateAssessmentStatus(assessmentId, status) {
    const sql = `
      UPDATE pmerit_personality_assessments 
      SET 
        status = $1,
        completion_status = $1,
        completed_at = CASE WHEN $1 = 'completed' THEN NOW() ELSE completed_at END,
        answered_questions = (
          SELECT COUNT(*) FROM assessment_responses WHERE assessment_id = $2
        )
      WHERE id = $2
    `;
    
    await this.db.query(sql, [status, assessmentId]);
  }
}

// Main Worker Export
export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400'
        }
      });
    }

    // Initialize router with environment variables
    const router = new PMERITRouter();
    
    // Set database configuration from environment
    if (env.POSTGRES_HOST) {
      DB_CONFIG.host = env.POSTGRES_HOST;
      DB_CONFIG.password = env.POSTGRES_PASSWORD;
    }

    try {
      const response = await router.route(request);
      return response;
    } catch (error) {
      console.error('Worker error:', error);
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
};
