-- =====================================================
-- PMERIT AI INTELLIGENCE DATABASE - AI ACTIVITY STORAGE
-- Container: pmerit-ai (Port 8006)
-- Database: pmerit_ai (Port 5434)
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =================================================================
-- AI CONVERSATION INTELLIGENCE
-- =================================================================

-- AI conversation history and context
CREATE TABLE ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    session_id UUID NOT NULL,
    conversation_type VARCHAR(50) NOT NULL, -- 'tutoring', 'assessment', 'career_guidance'
    message_type VARCHAR(20) NOT NULL, -- 'user', 'ai', 'system'
    message_content TEXT NOT NULL,
    ai_model_used VARCHAR(100), -- 'gpt-4', 'claude-3', 'ollama_codellama'
    context_data JSONB, -- Course context, learning objectives
    cultural_context JSONB, -- Global vs local career focus
    response_time_ms INTEGER,
    token_usage INTEGER,
    confidence_score DECIMAL(3,2),
    feedback_rating INTEGER CHECK (feedback_rating BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT NOW()
);

-- AI conversation sessions for context tracking
CREATE TABLE ai_conversation_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    session_start TIMESTAMP DEFAULT NOW(),
    session_end TIMESTAMP,
    session_type VARCHAR(50) NOT NULL,
    total_messages INTEGER DEFAULT 0,
    learning_objectives JSONB,
    outcomes_achieved JSONB,
    cultural_adaptation_used JSONB,
    session_quality_score DECIMAL(3,2)
);

-- =================================================================
-- PERSONALIZED LEARNING MODELS
-- =================================================================

-- Individual student learning profiles powered by AI
CREATE TABLE student_learning_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    learning_style JSONB NOT NULL, -- Visual, auditory, kinesthetic, etc.
    knowledge_state JSONB NOT NULL, -- Skills mastered, gaps identified
    difficulty_preferences JSONB,
    pace_analysis JSONB, -- Learning speed, optimal session length
    ai_recommendations JSONB, -- Personalized content suggestions
    cultural_learning_context JSONB, -- Global vs local career preferences
    career_interests JSONB, -- Remote vs local job preferences
    engagement_patterns JSONB, -- When most active, preferred content types
    last_updated TIMESTAMP DEFAULT NOW(),
    model_version VARCHAR(20) DEFAULT '1.0'
);

-- AI-powered skill assessments and gap analysis
CREATE TABLE ai_skill_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    assessment_type VARCHAR(50) NOT NULL, -- 'initial', 'progress', 'mastery'
    skills_assessed JSONB NOT NULL, -- Skills and competency levels
    ai_analysis JSONB NOT NULL, -- AI insights and recommendations
    learning_gaps JSONB, -- Areas needing improvement
    strengths JSONB, -- Areas of excellence
    career_readiness_score DECIMAL(3,2),
    cultural_career_fit JSONB, -- Global vs local job market fit
    recommended_learning_path JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =================================================================
-- AI MODEL PERFORMANCE TRACKING
-- =================================================================

-- AI model performance analytics
CREATE TABLE ai_model_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_name VARCHAR(100) NOT NULL,
    model_version VARCHAR(50),
    interaction_type VARCHAR(50) NOT NULL, -- 'tutoring', 'assessment', 'career'
    response_quality_score DECIMAL(3,2),
    user_satisfaction_rating INTEGER CHECK (user_satisfaction_rating BETWEEN 1 AND 5),
    processing_time_ms INTEGER,
    resource_usage JSONB, -- CPU, memory, tokens used
    cultural_accuracy_score DECIMAL(3,2), -- How well it handles cultural context
    bias_detection_score DECIMAL(3,2), -- Bias monitoring
    cost_per_interaction DECIMAL(8,4), -- AI service costs
    created_at TIMESTAMP DEFAULT NOW()
);

-- =================================================================
-- INDEXES FOR AI PERFORMANCE
-- =================================================================

CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_session_id ON ai_conversations(session_id);
CREATE INDEX idx_ai_conversations_created_at ON ai_conversations(created_at);
CREATE INDEX idx_ai_conversation_sessions_user_id ON ai_conversation_sessions(user_id);
CREATE INDEX idx_student_learning_models_user_id ON student_learning_models(user_id);
CREATE INDEX idx_ai_skill_assessments_user_id ON ai_skill_assessments(user_id);
CREATE INDEX idx_ai_model_performance_model_name ON ai_model_performance(model_name);
