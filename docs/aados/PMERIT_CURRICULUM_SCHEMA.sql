-- ============================================================================
-- PMERIT CURRICULUM DATABASE SCHEMA
-- ============================================================================
-- Version: 1.0
-- Created: December 2, 2025
-- Database: Neon PostgreSQL
-- Purpose: Curriculum management for PMERIT educational platform
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PATHWAY TABLES (4 Tables)
-- ============================================================================

-- 1. Pathways (Top-level organization)
-- Represents the 14 learning pathways across 3 track types
CREATE TABLE IF NOT EXISTS pathways (
    pathway_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    track_type VARCHAR(20) NOT NULL CHECK (track_type IN ('global_remote', 'local_education', 'local_career')),
    pathway_name VARCHAR(255) NOT NULL,
    pathway_slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_class VARCHAR(50), -- FontAwesome class e.g., 'fa-chart-line'
    icon_url TEXT,
    estimated_duration_weeks INTEGER,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'all_levels')),
    target_outcome TEXT,
    tags TEXT[], -- Array of skill tags
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE pathways IS 'Top-level learning pathways organized by track type (Global Remote, Local Education, Local Career)';

-- 2. Courses (Belong to pathways)
-- Each pathway contains multiple courses (typically 12 per Global Remote pathway)
CREATE TABLE IF NOT EXISTS courses (
    course_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pathway_id UUID REFERENCES pathways(pathway_id) ON DELETE CASCADE,
    course_code VARCHAR(20) UNIQUE NOT NULL, -- e.g., 'WD-101', 'DA-102'
    course_title VARCHAR(255) NOT NULL,
    course_slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    learning_objectives TEXT[], -- Array of learning objectives
    estimated_duration_weeks INTEGER,
    estimated_hours INTEGER, -- Total hours to complete
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    prerequisite_course_ids UUID[], -- Array of prerequisite course IDs
    required_skills TEXT[], -- Skills needed before starting
    thumbnail_url TEXT,
    intro_video_url TEXT,
    syllabus JSONB, -- Detailed syllabus as JSON
    instructor_name VARCHAR(255),
    instructor_bio TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    is_free BOOLEAN DEFAULT TRUE,
    price_usd DECIMAL(10,2) DEFAULT 0.00,
    enrollment_limit INTEGER, -- NULL = unlimited
    current_enrollments INTEGER DEFAULT 0,
    rating_average DECIMAL(3,2) DEFAULT 0.00,
    rating_count INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    published_at TIMESTAMPTZ,
    archived_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE courses IS 'Individual courses within pathways, containing modules and lessons';

-- 3. Course Modules (Belong to courses)
-- Each course is divided into modules (typically 4-6 per course)
CREATE TABLE IF NOT EXISTS course_modules (
    module_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    module_number INTEGER NOT NULL,
    module_title VARCHAR(255) NOT NULL,
    description TEXT,
    learning_objectives TEXT[],
    estimated_duration_hours INTEGER,
    is_required BOOLEAN DEFAULT TRUE,
    prerequisite_module_ids UUID[],
    unlock_date TIMESTAMPTZ, -- For drip content
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id, module_number)
);

COMMENT ON TABLE course_modules IS 'Modules within courses, grouping related lessons together';

-- 4. Lessons (Belong to modules)
-- Individual learning units within modules
CREATE TABLE IF NOT EXISTS lessons (
    lesson_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES course_modules(module_id) ON DELETE CASCADE,
    lesson_number INTEGER NOT NULL,
    lesson_title VARCHAR(255) NOT NULL,
    lesson_type VARCHAR(20) NOT NULL CHECK (lesson_type IN ('video', 'reading', 'interactive', 'quiz', 'project', 'discussion')),
    content_url TEXT, -- URL to video, PDF, etc.
    content_text TEXT, -- Markdown/HTML content for reading lessons
    content_metadata JSONB, -- Duration, file size, etc.
    estimated_duration_minutes INTEGER,
    is_required BOOLEAN DEFAULT TRUE,
    is_preview BOOLEAN DEFAULT FALSE, -- Can be viewed without enrollment
    prerequisite_lesson_ids UUID[],
    transcript TEXT, -- For video lessons
    resources JSONB, -- Additional downloadable resources
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(module_id, lesson_number)
);

COMMENT ON TABLE lessons IS 'Individual lessons/learning units within modules';

-- ============================================================================
-- MATERIALS LIBRARY (2 Tables)
-- ============================================================================

-- 5. Materials Library
-- Central repository for all uploaded materials
CREATE TABLE IF NOT EXISTS materials (
    material_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_type VARCHAR(20) NOT NULL CHECK (material_type IN ('pdf', 'video', 'image', 'document', 'link', 'audio', 'archive')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    duration_seconds INTEGER, -- For video/audio
    tags TEXT[],
    category VARCHAR(100),
    is_public BOOLEAN DEFAULT FALSE,
    download_count INTEGER DEFAULT 0,
    uploaded_by UUID, -- References users table
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE materials IS 'Central library of all uploaded learning materials';

-- 6. Material Attachments
-- Links materials to pathways, courses, modules, or lessons
CREATE TABLE IF NOT EXISTS material_attachments (
    attachment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID REFERENCES materials(material_id) ON DELETE CASCADE,
    attached_to_type VARCHAR(20) NOT NULL CHECK (attached_to_type IN ('pathway', 'course', 'module', 'lesson')),
    attached_to_id UUID NOT NULL,
    attachment_label VARCHAR(100), -- e.g., "Supplementary Reading", "Practice File"
    is_required BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE material_attachments IS 'Junction table linking materials to content items';

-- ============================================================================
-- STUDENT ENROLLMENT TABLES (3 Tables)
-- ============================================================================

-- 7. Pathway Enrollments
-- Tracks student enrollment in entire pathways
CREATE TABLE IF NOT EXISTS pathway_enrollments (
    enrollment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- References users table
    pathway_id UUID REFERENCES pathways(pathway_id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'dropped', 'expired')),
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    courses_completed INTEGER DEFAULT 0,
    total_courses INTEGER DEFAULT 0,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    expected_completion TIMESTAMPTZ,
    certificate_url TEXT,
    certificate_issued_at TIMESTAMPTZ,
    notes TEXT,
    UNIQUE(user_id, pathway_id)
);

COMMENT ON TABLE pathway_enrollments IS 'Student enrollments in learning pathways';

-- 8. Course Enrollments
-- Tracks student enrollment in individual courses
CREATE TABLE IF NOT EXISTS course_enrollments (
    enrollment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    pathway_enrollment_id UUID REFERENCES pathway_enrollments(enrollment_id) ON DELETE SET NULL,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'dropped', 'failed')),
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    lessons_completed INTEGER DEFAULT 0,
    total_lessons INTEGER DEFAULT 0,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    last_accessed_at TIMESTAMPTZ,
    time_spent_minutes INTEGER DEFAULT 0,
    final_grade DECIMAL(5,2),
    certificate_url TEXT,
    certificate_issued_at TIMESTAMPTZ,
    UNIQUE(user_id, course_id)
);

COMMENT ON TABLE course_enrollments IS 'Student enrollments in individual courses';

-- 9. Lesson Progress
-- Tracks student progress through individual lessons
CREATE TABLE IF NOT EXISTS lesson_progress (
    progress_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    lesson_id UUID REFERENCES lessons(lesson_id) ON DELETE CASCADE,
    course_enrollment_id UUID REFERENCES course_enrollments(enrollment_id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'skipped')),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    time_spent_seconds INTEGER DEFAULT 0,
    last_position JSONB, -- Video timestamp, scroll position, etc.
    score DECIMAL(5,2), -- For quiz/assessment lessons
    attempts INTEGER DEFAULT 0,
    notes TEXT, -- Student's personal notes
    bookmarked BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, lesson_id)
);

COMMENT ON TABLE lesson_progress IS 'Individual lesson completion tracking per student';

-- ============================================================================
-- ASSESSMENT TABLES (3 Tables)
-- ============================================================================

-- 10. Assessments
-- Quizzes, exams, projects, and portfolios
CREATE TABLE IF NOT EXISTS assessments (
    assessment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    module_id UUID REFERENCES course_modules(module_id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(lesson_id) ON DELETE CASCADE,
    assessment_type VARCHAR(20) NOT NULL CHECK (assessment_type IN ('quiz', 'exam', 'project', 'portfolio', 'peer_review')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    passing_score DECIMAL(5,2) DEFAULT 70.00,
    total_points DECIMAL(7,2) DEFAULT 100.00,
    time_limit_minutes INTEGER, -- NULL = unlimited
    max_attempts INTEGER DEFAULT 3, -- NULL = unlimited
    shuffle_questions BOOLEAN DEFAULT FALSE,
    show_correct_answers BOOLEAN DEFAULT TRUE,
    show_correct_after VARCHAR(20) DEFAULT 'submission' CHECK (show_correct_after IN ('never', 'submission', 'deadline', 'always')),
    available_from TIMESTAMPTZ,
    available_until TIMESTAMPTZ,
    is_published BOOLEAN DEFAULT FALSE,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE assessments IS 'Assessment definitions (quizzes, exams, projects)';

-- 11. Assessment Questions
-- Questions within assessments
CREATE TABLE IF NOT EXISTS assessment_questions (
    question_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES assessments(assessment_id) ON DELETE CASCADE,
    question_type VARCHAR(20) NOT NULL CHECK (question_type IN ('multiple_choice', 'multiple_select', 'true_false', 'short_answer', 'essay', 'matching', 'fill_blank', 'code')),
    question_text TEXT NOT NULL,
    question_media_url TEXT, -- Image or video for the question
    options JSONB, -- For multiple choice: [{id, text, is_correct}]
    correct_answer JSONB, -- Varies by question type
    points DECIMAL(5,2) DEFAULT 1.00,
    partial_credit BOOLEAN DEFAULT FALSE,
    explanation TEXT, -- Shown after answering
    hint TEXT,
    tags TEXT[],
    difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE assessment_questions IS 'Individual questions within assessments';

-- 12. Assessment Attempts
-- Student attempts at assessments
CREATE TABLE IF NOT EXISTS assessment_attempts (
    attempt_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    assessment_id UUID REFERENCES assessments(assessment_id) ON DELETE CASCADE,
    course_enrollment_id UUID REFERENCES course_enrollments(enrollment_id) ON DELETE CASCADE,
    attempt_number INTEGER DEFAULT 1,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    time_spent_seconds INTEGER,
    answers JSONB, -- {question_id: {answer, is_correct, points_earned}}
    score DECIMAL(7,2),
    percentage DECIMAL(5,2),
    passed BOOLEAN,
    feedback TEXT, -- Instructor feedback
    graded_by UUID, -- For manual grading
    graded_at TIMESTAMPTZ,
    ip_address INET,
    user_agent TEXT
);

COMMENT ON TABLE assessment_attempts IS 'Student assessment attempt records';

-- ============================================================================
-- LOCALIZATION TABLES (2 Tables)
-- ============================================================================

-- 13. Content Translations
-- Translations for all content types
CREATE TABLE IF NOT EXISTS content_translations (
    translation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('pathway', 'course', 'module', 'lesson', 'material', 'assessment', 'question')),
    content_id UUID NOT NULL,
    language_code VARCHAR(10) NOT NULL, -- e.g., 'en', 'yo' (Yoruba), 'ig' (Igbo), 'ha' (Hausa)
    field_name VARCHAR(50) NOT NULL, -- e.g., 'title', 'description', 'content_text'
    translated_text TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    is_machine_translated BOOLEAN DEFAULT FALSE,
    translated_by UUID,
    reviewed_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(content_type, content_id, language_code, field_name)
);

COMMENT ON TABLE content_translations IS 'Translations for content in multiple languages';

-- 14. Cultural Adaptations
-- Region-specific content adaptations (examples, case studies, etc.)
CREATE TABLE IF NOT EXISTS cultural_adaptations (
    adaptation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES lessons(lesson_id) ON DELETE CASCADE,
    region_code VARCHAR(10) NOT NULL, -- e.g., 'US-ME' (Maine), 'NG' (Nigeria), 'NG-LA' (Lagos)
    adaptation_type VARCHAR(20) NOT NULL CHECK (adaptation_type IN ('example', 'analogy', 'case_study', 'context', 'currency', 'measurement')),
    original_content TEXT,
    adapted_content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    created_by UUID,
    reviewed_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE cultural_adaptations IS 'Culturally adapted content for different regions';

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Pathway indexes
CREATE INDEX IF NOT EXISTS idx_pathways_track_type ON pathways(track_type);
CREATE INDEX IF NOT EXISTS idx_pathways_published ON pathways(is_published);
CREATE INDEX IF NOT EXISTS idx_pathways_slug ON pathways(pathway_slug);

-- Course indexes
CREATE INDEX IF NOT EXISTS idx_courses_pathway ON courses(pathway_id);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(course_slug);
CREATE INDEX IF NOT EXISTS idx_courses_code ON courses(course_code);

-- Module indexes
CREATE INDEX IF NOT EXISTS idx_modules_course ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_modules_sort ON course_modules(course_id, sort_order);

-- Lesson indexes
CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_type ON lessons(lesson_type);
CREATE INDEX IF NOT EXISTS idx_lessons_sort ON lessons(module_id, sort_order);

-- Materials indexes
CREATE INDEX IF NOT EXISTS idx_materials_type ON materials(material_type);
CREATE INDEX IF NOT EXISTS idx_materials_tags ON materials USING GIN(tags);

-- Material attachments indexes
CREATE INDEX IF NOT EXISTS idx_attachments_material ON material_attachments(material_id);
CREATE INDEX IF NOT EXISTS idx_attachments_target ON material_attachments(attached_to_type, attached_to_id);

-- Enrollment indexes
CREATE INDEX IF NOT EXISTS idx_pathway_enrollments_user ON pathway_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_pathway_enrollments_status ON pathway_enrollments(status);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_status ON course_enrollments(status);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_pathway ON course_enrollments(pathway_enrollment_id);

-- Progress indexes
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_enrollment ON lesson_progress(course_enrollment_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_status ON lesson_progress(status);

-- Assessment indexes
CREATE INDEX IF NOT EXISTS idx_assessments_course ON assessments(course_id);
CREATE INDEX IF NOT EXISTS idx_assessments_module ON assessments(module_id);
CREATE INDEX IF NOT EXISTS idx_assessments_type ON assessments(assessment_type);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_assessment ON assessment_questions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_user ON assessment_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_assessment ON assessment_attempts(assessment_id);

-- Translation indexes
CREATE INDEX IF NOT EXISTS idx_translations_content ON content_translations(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_translations_language ON content_translations(language_code);

-- Cultural adaptation indexes
CREATE INDEX IF NOT EXISTS idx_adaptations_lesson ON cultural_adaptations(lesson_id);
CREATE INDEX IF NOT EXISTS idx_adaptations_region ON cultural_adaptations(region_code);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
        AND table_name IN ('pathways', 'courses', 'course_modules', 'lessons', 'materials', 'assessments', 'content_translations', 'cultural_adaptations')
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS update_%I_updated_at ON %I;
            CREATE TRIGGER update_%I_updated_at
                BEFORE UPDATE ON %I
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();
        ', t, t, t, t);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SEED DATA: Initial Pathways
-- ============================================================================

-- Insert the 14 pathways matching the frontend
INSERT INTO pathways (track_type, pathway_name, pathway_slug, description, icon_class, difficulty_level, tags, is_published, sort_order) VALUES

-- Global Remote Tracks (6)
('global_remote', 'Data Analytics', 'data-analytics', 'Learn to analyze data, create visualizations, and drive business insights with modern analytics tools.', 'fa-chart-line', 'beginner', ARRAY['Python', 'SQL', 'Tableau', 'Statistics'], TRUE, 1),
('global_remote', 'Digital Marketing', 'digital-marketing', 'Master SEO, social media marketing, content strategy, and analytics to grow businesses online.', 'fa-bullhorn', 'beginner', ARRAY['SEO', 'Social Media', 'Analytics', 'Content'], TRUE, 2),
('global_remote', 'UX Design', 'ux-design', 'Create user-centered designs, conduct research, and build intuitive interfaces for web and mobile.', 'fa-palette', 'beginner', ARRAY['Figma', 'User Research', 'Prototyping', 'UI Design'], TRUE, 3),
('global_remote', 'Web Development', 'web-development', 'Build modern, responsive websites and web applications using the latest technologies and frameworks.', 'fa-code', 'beginner', ARRAY['HTML/CSS', 'JavaScript', 'React', 'Node.js'], TRUE, 4),
('global_remote', 'Project Management', 'project-management', 'Lead teams, manage projects, and deliver results using agile methodologies and PM best practices.', 'fa-tasks', 'intermediate', ARRAY['Agile', 'Scrum', 'Leadership', 'Planning'], TRUE, 5),
('global_remote', 'Business Analysis', 'business-analysis', 'Bridge the gap between business needs and technical solutions through strategic analysis.', 'fa-briefcase', 'intermediate', ARRAY['Requirements', 'Process Modeling', 'Strategy', 'Communication'], TRUE, 6),

-- Local Education Tracks (4)
('local_education', 'Early Childhood Education', 'early-childhood', 'Foundational programs for nursery and kindergarten focusing on holistic child development.', 'fa-child', 'all_levels', ARRAY['Ages 3-5', 'Play-Based', 'Social Skills', 'Early Literacy'], TRUE, 1),
('local_education', 'Primary School', 'primary-school', 'Core academic subjects and essential skills for grades 1-6 with personalized learning support.', 'fa-book-open', 'all_levels', ARRAY['Math', 'Reading', 'Science', 'Art'], TRUE, 2),
('local_education', 'Secondary School', 'secondary-school', 'Advanced curricula preparing students for college and career pathways through grades 7-12.', 'fa-graduation-cap', 'all_levels', ARRAY['STEM', 'Humanities', 'College Prep', 'Career Ready'], TRUE, 3),
('local_education', 'College & University', 'college-university', 'Higher education programs with degree and certification pathways in partnership with institutions.', 'fa-university', 'advanced', ARRAY['Bachelor''s', 'Associate', 'Certificates', 'Online'], TRUE, 4),

-- Local Career Pathways (4)
('local_career', 'Healthcare Careers', 'healthcare-careers', 'Training for medical assistants, nursing, and healthcare administration roles in local facilities.', 'fa-heartbeat', 'beginner', ARRAY['Nursing', 'Medical Tech', 'Admin', 'Certified'], TRUE, 1),
('local_career', 'Skilled Trades', 'skilled-trades', 'Hands-on training in electrical, plumbing, HVAC, and construction trades with apprenticeships.', 'fa-tools', 'beginner', ARRAY['Electrical', 'Plumbing', 'HVAC', 'Apprenticeship'], TRUE, 2),
('local_career', 'Hospitality & Service', 'hospitality-service', 'Customer service, culinary arts, and hotel management programs for the tourism industry.', 'fa-concierge-bell', 'beginner', ARRAY['Culinary', 'Hotel Mgmt', 'Customer Service', 'Tourism'], TRUE, 3),
('local_career', 'Public Service', 'public-service', 'Career preparation for public safety, social work, and government administration positions.', 'fa-landmark', 'beginner', ARRAY['Fire/EMS', 'Social Work', 'Admin', 'Community'], TRUE, 4)

ON CONFLICT (pathway_slug) DO UPDATE SET
    description = EXCLUDED.description,
    tags = EXCLUDED.tags,
    updated_at = NOW();

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify table creation
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name IN (
    'pathways', 'courses', 'course_modules', 'lessons',
    'materials', 'material_attachments',
    'pathway_enrollments', 'course_enrollments', 'lesson_progress',
    'assessments', 'assessment_questions', 'assessment_attempts',
    'content_translations', 'cultural_adaptations'
)
ORDER BY table_name;

-- Verify pathways were seeded
SELECT pathway_name, track_type, is_published FROM pathways ORDER BY track_type, sort_order;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================