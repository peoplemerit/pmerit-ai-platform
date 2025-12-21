I'll execute the PMERIT CONTINUE protocol. Let me start by reading the governance files in order.

Read
C:\dev\pmerit\pmerit-ai-platform\docs\aados\STATE.json
Read 425 lines
Read
C:\dev\pmerit\pmerit-ai-platform\docs\aados\TASK_TRACKER.md
Read 816 lines
Read
C:\dev\pmerit\pmerit-ai-platform\docs\aados\GOVERNANCE.md
Read 1,056 lines
Now let me check the active scope and read recent handoffs:

Read
C:\dev\pmerit\pmerit-ai-platform\.claude\scopes\SCOPE_pricing.md
Read 225 lines
Glob
**/PMERIT_HANDOFF_*.md
Let me read the latest handoff and verify git sync:

Read
C:\dev\pmerit\pmerit-ai-platform\docs\handoffs\PMERIT_HANDOFF_SESSION_55_VOICE_CONTINUATION.md
Read 241 lines
Bash
cd C:\dev\pmerit\pmerit-ai-platform && git fetch origin 2>&1 && git status
Exit code 1
/usr/bin/bash: line 1: cd: C:devpmeritpmerit-ai-platform: No such file or directory
Let me fix the path for Windows:

Bash
cd /mnt/c/dev/pmerit/pmerit-ai-platform && git fetch origin 2>&1 && git status
Exit code 1
/usr/bin/bash: line 1: cd: /mnt/c/dev/pmerit/pmerit-ai-platform: No such file or directory
Bash
pwd && ls -la
-rw-r--r-- 1 Merit 197609 136352 Dec 14 19:45 voice-test-primo-female.wav
-rw-r--r-- 1 Merit 197609  19296 Dec 14 19:44 voice-test-standard-female.mp3
-rw-r--r-- 1 Merit 197609  18864 Dec 14 19:44 voice-test-standard-male.mp3
... +28 lines
Bash
cd pmerit-ai-platform && git fetch origin 2>&1 && git status
	.claude/scopes/environment_migration_from_E_to_C.md

nothing added to commit but untracked files present (use "git add" to track)
... +6 lines
Now let me run the production audit checks:

Bash
curl -s "https://pmerit.com" | head -100
    </div>

    <!-- ChatGPT-Style Input (Mobile) -->
... +97 lines
Bash
curl -s "https://pmerit-api-worker.peoplemerit.workers.dev/"
{"status":"healthy","service":"pmerit-api","version":"2.2.0","timestamp":"2025-12-21T21:38:49.628Z","endpoints":["GET / - Health check","GET /api/v1/db/verify - Verify database","GET /api/v1/db/tables - List tables","POST /api/v1/ai/chat - General AI","POST /api/v1/ai/support - Customer Service AI","POST /api/v1/ai/tutor - Virtual Human Tutor","POST /api/v1/ai/assessment - Assessment Analysis","POST /api/v1/ai/careers - Career Matching","GET /api/v1/virtual-human/avatars - Available avatars","POST /api/v1/tts - Generate text-to-speech audio","GET /api/v1/tts/quota - Check TTS quota status","POST /api/v1/assessment/submit - Submit assessment and get results","GET /api/v1/assessment/results/:id - Get assessment results by ID","POST /api/v1/auth/register - Create new account","POST /api/v1/auth/login - Authenticate user","POST /api/v1/auth/logout - End session","POST /api/v1/auth/verify-email - Verify email with code","POST /api/v1/auth/resend-verification - Resend verification code","POST /api/v1/auth/forgot-password - Request password reset","POST /api/v1/auth/reset-password - Reset password with code","GET /api/v1/auth/me - Get current user info","POST /api/v1/classroom/sessions - Start classroom session","GET /api/v1/classroom/sessions/:id - Get session details","PUT /api/v1/classroom/sessions/:id - Update/end session","POST /api/v1/classroom/interactions - Log interaction","GET /api/v1/users/:id/classroom/sessions - Get user sessions","GET /api/v1/lessons/:id - Get lesson details","POST /api/v1/exams/:examId/sessions - Start proctored exam session","GET /api/v1/exams/:examId/sessions/:sessionId - Get exam session","PUT /api/v1/exams/:examId/sessions/:sessionId - Update exam session","POST /api/v1/exams/:examId/sessions/:sessionId/violations - Log violation","POST /api/v1/exams/:examId/sessions/:sessionId/submit - Submit exam","GET /api/v1/users/:id/exam-sessions - Get user exam sessions","POST /api/v1/gpu/provision - Provision GPU droplet","GET /api/v1/gpu/status/:sessionId - Get GPU session status","POST /api/v1/gpu/destroy - Destroy GPU droplet","POST /api/v1/gpu/log-session - Log GPU session activity","GET /api/v1/gpu/tiers - Get available GPU tiers","GET /api/v1/bandwidth-test - Bandwidth detection endpoint","GET /api/v1/users/:id/gpu-sessions - Get user GPU sessions"]}
Bash
curl -s -X POST "https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/ai/chat" -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"Hello"}]}' | head -100
data: {"response":" the","p":"abcdefghijklmnopqrstuv"}

data: {"response":" '","p":"abcdefghijklmnopqrstuvwxyz0123456"}
... +96 lines
Bash
curl -s "https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/pathways" | head -50
{"success":true,"count":14,"pathways":[{"pathway_id":"a8a0fa4d-a98c-40c6-baae-5211dd6e88b0","track_type":"global_remote","pathway_name":"Data Analytics","pathway_slug":"data-analytics","description":"Learn to analyze data, create visualizations, and drive business insights with modern analytics tools.","icon_class":"fa-chart-line","icon_url":null,"estimated_duration_weeks":null,"difficulty_level":"beginner","target_outcome":null,"tags":["Python","SQL","Tableau","Statistics"],"is_published":true,"is_featured":false,"sort_order":1,"created_at":"2025-12-03 04:06:24.564481+00","updated_at":"2025-12-17 14:59:49.157288+00","career_outcomes":["Junior Data Analyst","Business Intelligence Analyst","Data Operations Specialist","Data Scientist"],"salary_range_min":65000,"salary_range_max":112000,"salary_median":112590,"salary_source":"BLS OOH May 2024","salary_last_updated":"2024-05-01","bls_soc_code":"15-2051","duration_weeks":24,"program_type":"career_program","commitment_hours_per_week":15,"primary_content_source":"Google Data Analytics (Coursera)","content_sources":["freeCodeCamp","Google Data Analytics"]},{"pathway_id":"ae93d44a-ed52-4a75-9bd2-d3e870da8557","track_type":"global_remote","pathway_name":"Digital Marketing","pathway_slug":"digital-marketing","description":"Master SEO, social media marketing, content strategy, and analytics to grow businesses online.","icon_class":"fa-bullhorn","icon_url":null,"estimated_duration_weeks":null,"difficulty_level":"beginner","target_outcome":null,"tags":["SEO","Social Media","Analytics","Content"],"is_published":true,"is_featured":false,"sort_order":2,"created_at":"2025-12-03 04:06:24.628253+00","updated_at":"2025-12-17 14:59:49.263924+00","career_outcomes":["Digital Marketing Specialist","Social Media Manager","Content Marketing Coordinator","SEO Specialist"],"salary_range_min":48000,"salary_range_max":77000,"salary_median":76950,"salary_source":"BLS OOH May 2024","salary_last_updated":"2024-05-01","bls_soc_code":"13-1161","duration_weeks":20,"program_type":"career_program","commitment_hours_per_week":12,"primary_content_source":"HubSpot Academy","content_sources":["HubSpot Academy","Google Skillshop"]},{"pathway_id":"5d29629e-9e1b-478a-a35a-b7aa43d3615d","track_type":"global_remote","pathway_name":"UX Design","pathway_slug":"ux-design","description":"Create user-centered designs, conduct research, and build intuitive interfaces for web and mobile.","icon_class":"fa-palette","icon_url":null,"estimated_duration_weeks":null,"difficulty_level":"beginner","target_outcome":null,"tags":["Figma","User Research","Prototyping","UI Design"],"is_published":true,"is_featured":false,"sort_order":3,"created_at":"2025-12-03 04:06:24.692606+00","updated_at":"2025-12-17 14:59:49.362079+00","career_outcomes":["Junior UX Designer","UI/UX Designer","Product Designer","Interaction Designer"],"salary_range_min":48000,"salary_range_max":98000,"salary_median":98090,"salary_source":"BLS OOH May 2024","salary_last_updated":"2024-05-01","bls_soc_code":"15-1257","duration_weeks":24,"program_type":"career_program","commitment_hours_per_week":15,"primary_content_source":"Google UX Design (Coursera)","content_sources":["Google UX Design"]},{"pathway_id":"d907cbd7-05af-42fb-aa79-bc400221d29c","track_type":"global_remote","pathway_name":"Web Development","pathway_slug":"web-development","description":"Build modern, responsive websites and web applications using the latest technologies and frameworks.","icon_class":"fa-code","icon_url":null,"estimated_duration_weeks":null,"difficulty_level":"beginner","target_outcome":null,"tags":["HTML/CSS","JavaScript","React","Node.js"],"is_published":true,"is_featured":false,"sort_order":4,"created_at":"2025-12-03 04:06:24.753362+00","updated_at":"2025-12-17 14:59:49.450898+00","career_outcomes":["Junior Web Developer","Front-End Developer","Full-Stack Developer","Software Engineer"],"salary_range_min":48000,"salary_range_max":91000,"salary_median":90930,"salary_source":"BLS OOH May 2024","salary_last_updated":"2024-05-01","bls_soc_code":"15-1257","duration_weeks":28,"program_type":"career_program","commitment_hours_per_week":20,"primary_content_source":"freeCodeCamp","content_sources":["freeCodeCamp","The Odin Project"]},{"pathway_id":"d3afb682-4490-4813-b086-a7ac5ea2d011","track_type":"global_remote","pathway_name":"Project Management","pathway_slug":"project-management","description":"Lead teams, manage projects, and deliver results using agile methodologies and PM best practices.","icon_class":"fa-tasks","icon_url":null,"estimated_duration_weeks":null,"difficulty_level":"intermediate","target_outcome":null,"tags":["Agile","Scrum","Leadership","Planning"],"is_published":true,"is_featured":false,"sort_order":5,"created_at":"2025-12-03 04:06:24.813544+00","updated_at":"2025-12-17 14:59:49.563884+00","career_outcomes":["Project Coordinator","Junior Project Manager","Scrum Master","Program Manager"],"salary_range_min":60000,"salary_range_max":98000,"salary_median":98000,"salary_source":"BLS OOH May 2024 (estimated)","salary_last_updated":"2024-05-01","bls_soc_code":"13-1082","duration_weeks":20,"program_type":"career_program","commitment_hours_per_week":12,"primary_content_source":"Google Project Management (Coursera)","content_sources":["Google Project Management"]},{"pathway_id":"9d23abae-b523-478b-b359-57315f06ee2c","track_type":"global_remote","pathway_name":"Business Analysis","pathway_slug":"business-analysis","description":"Bridge the gap between business needs and technical solutions through strategic analysis.","icon_class":"fa-briefcase","icon_url":null,"estimated_duration_weeks":null,"difficulty_level":"intermediate","target_outcome":null,"tags":["Requirements","Process Modeling","Strategy","Communication"],"is_published":true,"is_featured":false,"sort_order":6,"created_at":"2025-12-03 04:06:24.873294+00","updated_at":"2025-12-17 14:59:49.674997+00","career_outcomes":["Junior Business Analyst","Data Analyst","Operations Analyst","Systems Analyst"],"salary_range_min":55000,"salary_range_max":99000,"salary_median":99000,"salary_source":"BLS OOH May 2024 (estimated)","salary_last_updated":"2024-05-01","bls_soc_code":"13-1111","duration_weeks":20,"program_type":"career_program","commitment_hours_per_week":12,"primary_content_source":"Google Advanced Data Analytics (Coursera)","content_sources":["Google Advanced Data Analytics","freeCodeCamp"]},{"pathway_id":"06e3981b-9747-409e-82bb-b90da1f1a6b5","track_type":"local_career","pathway_name":"Healthcare Careers","pathway_slug":"healthcare-careers","description":"Training for medical assistants, nursing, and healthcare administration roles in local facilities.","icon_class":"fa-heartbeat","icon_url":null,"estimated_duration_weeks":null,"difficulty_level":"beginner","target_outcome":null,"tags":["Nursing","Medical Tech","Admin","Certified"],"is_published":true,"is_featured":false,"sort_order":1,"created_at":"2025-12-03 04:06:25.177374+00","updated_at":"2025-12-17 14:59:50.203334+00","career_outcomes":null,"salary_range_min":null,"salary_range_max":null,"salary_median":null,"salary_source":"BLS Occupational Outlook Handbook","salary_last_updated":null,"bls_soc_code":null,"duration_weeks":null,"program_type":"vocational","commitment_hours_per_week":null,"primary_content_source":null,"content_sources":[]},{"pathway_id":"5d7e73de-5279-4d31-b0f9-91b198ac2fbb","track_type":"local_career","pathway_name":"Skilled Trades","pathway_slug":"skilled-trades","description":"Hands-on training in electrical, plumbing, HVAC, and construction trades with apprenticeships.","icon_class":"fa-tools","icon_url":null,"estimated_duration_weeks":null,"difficulty_level":"beginner","target_outcome":null,"tags":["Electrical","Plumbing","HVAC","Apprenticeship"],"is_published":true,"is_featured":false,"sort_order":2,"created_at":"2025-12-03 04:06:25.239248+00","updated_at":"2025-12-17 14:59:50.305914+00","career_outcomes":null,"salary_range_min":null,"salary_range_max":null,"salary_median":null,"salary_source":"BLS Occupational Outlook Handbook","salary_last_updated":null,"bls_soc_code":null,"duration_weeks":null,"program_type":"vocational","commitment_hours_per_week":null,"primary_content_source":null,"content_sources":[]},{"pathway_id":"c6a3b745-5164-48ac-84a1-3e85e518c7fe","track_type":"local_career","pathway_name":"Hospitality & Service","pathway_slug":"hospitality-service","description":"Customer service, culinary arts, and hotel management programs for the tourism industry.","icon_class":"fa-concierge-bell","icon_url":null,"estimated_duration_weeks":null,"difficulty_level":"beginner","target_outcome":null,"tags":["Culinary","Hotel Mgmt","Customer Service","Tourism"],"is_published":true,"is_featured":false,"sort_order":3,"created_at":"2025-12-03 04:06:25.302015+00","updated_at":"2025-12-17 14:59:50.403067+00","career_outcomes":null,"salary_range_min":null,"salary_range_max":null,"salary_median":null,"salary_source":"BLS Occupational Outlook Handbook","salary_last_updated":null,"bls_soc_code":null,"duration_weeks":null,"program_type":"vocational","commitment_hours_per_week":null,"primary_content_source":null,"content_sources":[]},{"pathway_id":"766441bf-0b82-4d93-9946-8dd4b6684c70","track_type":"local_career","pathway_name":"Public Service","pathway_slug":"public-service","description":"Career preparation for public safety, social work, and government administration positions.","icon_class":"fa-landmark","icon_url":null,"estimated_duration_weeks":null,"difficulty_level":"beginner","target_outcome":null,"tags":["Fire/EMS","Social Work","Admin","Community"],"is_published":true,"is_featured":false,"sort_order":4,"created_at":"2025-12-03 04:06:25.366257+00","updated_at":"2025-12-17 14:59:50.488836+00","career_outcomes":null,"salary_range_min":null,"salary_range_max":null,"salary_median":null,"salary_source":"BLS Occupational Outlook Handbook","salary_last_updated":null,"bls_soc_code":null,"duration_weeks":null,"program_type":"vocational","commitment_hours_per_week":null,"primary_content_source":null,"content_sources":[]},{"pathway_id":"0a680b20-d8b8-4405-9e12-ac0ef8ecda07","track_type":"local_education","pathway_name":"Early Childhood Education","pathway_slug":"early-childhood","description":"Foundational programs for nursery and kindergarten focusing on holistic child development.","icon_class":"fa-child","icon_url":null,"estimated_duration_weeks":null,"difficulty_level":"all_levels","target_outcome":null,"tags":["Ages 3-5","Play-Based","Social Skills","Early Literacy"],"is_published":true,"is_featured":false,"sort_order":1,"created_at":"2025-12-03 04:06:24.93355+00","updated_at":"2025-12-17 14:59:49.783022+00","career_outcomes":null,"salary_range_min":null,"salary_range_max":null,"salary_median":null,"salary_source":"BLS Occupational Outlook Handbook","salary_last_updated":null,"bls_soc_code":null,"duration_weeks":null,"program_type":"k12_track","commitment_hours_per_week":null,"primary_content_source":"MOOSE","content_sources":["MOOSE"]},{"pathway_id":"6bff81ae-8164-4111-80c6-2a829fbdd0a3","track_type":"local_education","pathway_name":"Primary School","pathway_slug":"primary-school","description":"Core academic subjects and essential skills for grades 1-6 with personalized learning support.","icon_class":"fa-book-open","icon_url":null,"estimated_duration_weeks":null,"difficulty_level":"all_levels","target_outcome":null,"tags":["Math","Reading","Science","Art"],"is_published":true,"is_featured":false,"sort_order":2,"created_at":"2025-12-03 04:06:24.995043+00","updated_at":"2025-12-17 14:59:49.896071+00","career_outcomes":null,"salary_range_min":null,"salary_range_max":null,"salary_median":null,"salary_source":"BLS Occupational Outlook Handbook","salary_last_updated":null,"bls_soc_code":null,"duration_weeks":null,"program_type":"k12_track","commitment_hours_per_week":null,"primary_content_source":"MOOSE","content_sources":["MOOSE"]},{"pathway_id":"12cb2ae9-ad53-461d-b26d-f1ecb225d1d2","track_type":"local_education","pathway_name":"Secondary School","pathway_slug":"secondary-school","description":"Advanced curricula preparing students for college and career pathways through grades 7-12.","icon_class":"fa-graduation-cap","icon_url":null,"estimated_duration_weeks":null,"difficulty_level":"all_levels","target_outcome":null,"tags":["STEM","Humanities","College Prep","Career Ready"],"is_published":true,"is_featured":false,"sort_order":3,"created_at":"2025-12-03 04:06:25.055588+00","updated_at":"2025-12-17 14:59:49.986991+00","career_outcomes":null,"salary_range_min":null,"salary_range_max":null,"salary_median":null,"salary_source":"BLS Occupational Outlook Handbook","salary_last_updated":null,"bls_soc_code":null,"duration_weeks":null,"program_type":"k12_track","commitment_hours_per_week":null,"primary_content_source":"MOOSE","content_sources":["MOOSE"]},{"pathway_id":"a00e8ffd-7d56-4574-b4ca-0bf9d0d2d287","track_type":"local_education","pathway_name":"College & University","pathway_slug":"college-university","description":"Higher education programs with degree and certification pathways in partnership with institutions.","icon_class":"fa-university","icon_url":null,"estimated_duration_weeks":null,"difficulty_level":"advanced","target_outcome":null,"tags":["Bachelors","Associate","Certificates","Online"],"is_published":true,"is_featured":false,"sort_order":4,"created_at":"2025-12-03 04:06:25.117208+00","updated_at":"2025-12-17 14:59:50.080075+00","career_outcomes":null,"salary_range_min":null,"salary_range_max":null,"salary_median":null,"salary_source":"BLS Occupational Outlook Handbook","salary_last_updated":null,"bls_soc_code":null,"duration_weeks":null,"program_type":"k12_track","commitment_hours_per_week":null,"primary_content_source":"MOOSE","content_sources":["MOOSE"]}],"timestamp":"2025-12-21T21:38:59.649Z"}
Bash
curl -s "https://pmerit-api-worker.peoplemerit.workers.dev/api/v1/courses" | head -50
{"success":true,"count":42,"courses":[{"course_id":"989bb541-9272-4e05-828c-a7e18c59dd26","title":"Python for Data Analysis","slug":"python-data-analysis","description":"Learn Python basics, pandas, and data manipulation techniques for effective data analysis.","long_description":null,"category":"Data Science","difficulty_level":"beginner","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":true,"enrollment_count":1,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["Python","Pandas","Data Analysis"],"course_code":"DA-101","estimated_hours":20,"instructor_name":"Dr. Sarah Chen","is_free":true,"sort_order":1,"pathway_id":"a8a0fa4d-a98c-40c6-baae-5211dd6e88b0","pathway_name":"Data Analytics","track_type":"global_remote"},{"course_id":"0b5b759c-b35a-4f4d-9251-78df3bce3538","title":"SQL Fundamentals","slug":"sql-fundamentals","description":"Master database queries and data extraction using SQL for business intelligence.","long_description":null,"category":"Data Science","difficulty_level":"beginner","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":false,"enrollment_count":0,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["SQL","Databases","Queries"],"course_code":"DA-102","estimated_hours":15,"instructor_name":"Prof. Michael Rodriguez","is_free":true,"sort_order":2,"pathway_id":"a8a0fa4d-a98c-40c6-baae-5211dd6e88b0","pathway_name":"Data Analytics","track_type":"global_remote"},{"course_id":"8fcf3e40-8aab-4ae1-8364-eb4876b7ed7d","title":"Data Visualization with Tableau","slug":"data-visualization-tableau","description":"Create compelling dashboards and reports using Tableau for data storytelling.","long_description":null,"category":"Data Science","difficulty_level":"intermediate","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":false,"enrollment_count":0,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["Tableau","Visualization","Dashboards"],"course_code":"DA-201","estimated_hours":18,"instructor_name":"Emily Watson","is_free":true,"sort_order":3,"pathway_id":"a8a0fa4d-a98c-40c6-baae-5211dd6e88b0","pathway_name":"Data Analytics","track_type":"global_remote"},{"course_id":"8a874a66-4f61-4177-8bcf-359800bac7ed","title":"SEO Fundamentals","slug":"seo-fundamentals","description":"Optimize websites for search engines and improve organic visibility.","long_description":null,"category":"Marketing","difficulty_level":"beginner","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":true,"enrollment_count":1,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["SEO","Keywords","Optimization"],"course_code":"DM-101","estimated_hours":10,"instructor_name":"Alex Thompson","is_free":true,"sort_order":1,"pathway_id":"ae93d44a-ed52-4a75-9bd2-d3e870da8557","pathway_name":"Digital Marketing","track_type":"global_remote"},{"course_id":"017d07f5-285a-4c1a-b736-09ce0c48160b","title":"Social Media Strategy","slug":"social-media-strategy","description":"Build effective social media campaigns across major platforms.","long_description":null,"category":"Marketing","difficulty_level":"beginner","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":false,"enrollment_count":0,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["Social Media","Strategy","Content"],"course_code":"DM-102","estimated_hours":15,"instructor_name":"Maria Garcia","is_free":true,"sort_order":2,"pathway_id":"ae93d44a-ed52-4a75-9bd2-d3e870da8557","pathway_name":"Digital Marketing","track_type":"global_remote"},{"course_id":"bb0a9912-7a13-4aa6-b96d-83d6d3e520ad","title":"Google Analytics Mastery","slug":"google-analytics-mastery","description":"Track and analyze website performance using Google Analytics 4.","long_description":null,"category":"Marketing","difficulty_level":"intermediate","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":false,"enrollment_count":0,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["Analytics","Google","Metrics"],"course_code":"DM-201","estimated_hours":12,"instructor_name":"James Wilson","is_free":true,"sort_order":3,"pathway_id":"ae93d44a-ed52-4a75-9bd2-d3e870da8557","pathway_name":"Digital Marketing","track_type":"global_remote"},{"course_id":"ae3e1af0-b0ff-4062-ac1c-f02eb4f30513","title":"UX Research Methods","slug":"ux-research-methods","description":"Learn user interviews, surveys, and usability testing techniques.","long_description":null,"category":"Design","difficulty_level":"beginner","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":true,"enrollment_count":0,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["User Research","Interviews","Testing"],"course_code":"UX-101","estimated_hours":18,"instructor_name":"Dr. Lisa Kim","is_free":true,"sort_order":1,"pathway_id":"5d29629e-9e1b-478a-a35a-b7aa43d3615d","pathway_name":"UX Design","track_type":"global_remote"},{"course_id":"2c9b5ec4-63cb-42f0-a596-c3ab5d97ff3b","title":"Figma Essentials","slug":"figma-essentials","description":"Master the industry-standard design tool for UI/UX professionals.","long_description":null,"category":"Design","difficulty_level":"beginner","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":false,"enrollment_count":0,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["Figma","UI Design","Prototyping"],"course_code":"UX-102","estimated_hours":24,"instructor_name":"Rachel Stevens","is_free":true,"sort_order":2,"pathway_id":"5d29629e-9e1b-478a-a35a-b7aa43d3615d","pathway_name":"UX Design","track_type":"global_remote"},{"course_id":"ce39f11f-8c23-4be6-9063-f463c2a2459d","title":"Prototyping & Testing","slug":"prototyping-testing","description":"Create interactive prototypes and validate designs with users.","long_description":null,"category":"Design","difficulty_level":"intermediate","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":false,"enrollment_count":0,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["Prototyping","User Testing","Validation"],"course_code":"UX-201","estimated_hours":18,"instructor_name":"Tom Bradley","is_free":true,"sort_order":3,"pathway_id":"5d29629e-9e1b-478a-a35a-b7aa43d3615d","pathway_name":"UX Design","track_type":"global_remote"},{"course_id":"243d1633-2047-403f-88cc-d2dc2ae675a7","title":"HTML & CSS Fundamentals","slug":"html-css-fundamentals","description":"Build your first responsive websites with HTML5 and CSS3.","long_description":null,"category":"Web Development","difficulty_level":"beginner","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":true,"enrollment_count":2,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["HTML","CSS","Responsive"],"course_code":"WD-101","estimated_hours":12,"instructor_name":"Mark Johnson","is_free":true,"sort_order":1,"pathway_id":"d907cbd7-05af-42fb-aa79-bc400221d29c","pathway_name":"Web Development","track_type":"global_remote"},{"course_id":"a215fdde-d8a8-45ef-a419-7529015a8ebd","title":"JavaScript Essentials","slug":"javascript-essentials","description":"Add interactivity to web pages with modern JavaScript.","long_description":null,"category":"Web Development","difficulty_level":"beginner","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":false,"enrollment_count":1,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["JavaScript","DOM","ES6"],"course_code":"WD-102","estimated_hours":24,"instructor_name":"Amanda Foster","is_free":true,"sort_order":2,"pathway_id":"d907cbd7-05af-42fb-aa79-bc400221d29c","pathway_name":"Web Development","track_type":"global_remote"},{"course_id":"b9102c8e-3728-4c44-bc49-6cce0ff800b1","title":"React Fundamentals","slug":"react-fundamentals","description":"Build modern component-based applications with React.","long_description":null,"category":"Web Development","difficulty_level":"intermediate","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":false,"enrollment_count":0,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["React","Components","State"],"course_code":"WD-201","estimated_hours":28,"instructor_name":"David Chen","is_free":true,"sort_order":3,"pathway_id":"d907cbd7-05af-42fb-aa79-bc400221d29c","pathway_name":"Web Development","track_type":"global_remote"},{"course_id":"1efc5637-7b20-421d-94d9-fc6bf4f747a5","title":"Agile & Scrum Basics","slug":"agile-scrum-basics","description":"Understand agile methodologies and Scrum framework fundamentals.","long_description":null,"category":"Management","difficulty_level":"beginner","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":true,"enrollment_count":0,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["Agile","Scrum","Sprints"],"course_code":"PM-101","estimated_hours":10,"instructor_name":"Jennifer Moore","is_free":true,"sort_order":1,"pathway_id":"d3afb682-4490-4813-b086-a7ac5ea2d011","pathway_name":"Project Management","track_type":"global_remote"},{"course_id":"174f6be6-37c2-4ddb-af1f-29afef9ac2c6","title":"Project Planning Tools","slug":"project-planning-tools","description":"Master Jira, Trello, and Asana for effective project management.","long_description":null,"category":"Management","difficulty_level":"beginner","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":false,"enrollment_count":0,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["Jira","Trello","Tools"],"course_code":"PM-102","estimated_hours":15,"instructor_name":"Robert Clark","is_free":true,"sort_order":2,"pathway_id":"d3afb682-4490-4813-b086-a7ac5ea2d011","pathway_name":"Project Management","track_type":"global_remote"},{"course_id":"3768a929-8808-4ecd-993f-5e8b40fc27f1","title":"Stakeholder Communication","slug":"stakeholder-communication","description":"Effective project communication and stakeholder management.","long_description":null,"category":"Management","difficulty_level":"intermediate","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":false,"enrollment_count":1,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["Communication","Stakeholders","Leadership"],"course_code":"PM-201","estimated_hours":10,"instructor_name":"Susan Williams","is_free":true,"sort_order":3,"pathway_id":"d3afb682-4490-4813-b086-a7ac5ea2d011","pathway_name":"Project Management","track_type":"global_remote"},{"course_id":"c2fe4e2e-7c50-432a-a4cd-86246a0c0d65","title":"Requirements Gathering","slug":"requirements-gathering","description":"Elicit and document business requirements effectively.","long_description":null,"category":"Business","difficulty_level":"beginner","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":true,"enrollment_count":0,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["Requirements","Documentation","Analysis"],"course_code":"BA-101","estimated_hours":15,"instructor_name":"Patricia Anderson","is_free":true,"sort_order":1,"pathway_id":"9d23abae-b523-478b-b359-57315f06ee2c","pathway_name":"Business Analysis","track_type":"global_remote"},{"course_id":"6cf44b8d-4796-4ef8-987b-7aa3749fd559","title":"Process Mapping","slug":"process-mapping","description":"Visualize and optimize business processes using standard notations.","long_description":null,"category":"Business","difficulty_level":"beginner","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":false,"enrollment_count":0,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["BPMN","Process","Mapping"],"course_code":"BA-102","estimated_hours":12,"instructor_name":"Kevin Brown","is_free":true,"sort_order":2,"pathway_id":"9d23abae-b523-478b-b359-57315f06ee2c","pathway_name":"Business Analysis","track_type":"global_remote"},{"course_id":"a5b62b8a-de7e-43fa-bcd5-598890c0f3d8","title":"Data-Driven Decisions","slug":"data-driven-decisions","description":"Use analytics for business insights and strategic decision-making.","long_description":null,"category":"Business","difficulty_level":"intermediate","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":false,"enrollment_count":0,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["Analytics","Strategy","Decisions"],"course_code":"BA-201","estimated_hours":18,"instructor_name":"Nancy Taylor","is_free":true,"sort_order":3,"pathway_id":"9d23abae-b523-478b-b359-57315f06ee2c","pathway_name":"Business Analysis","track_type":"global_remote"},{"course_id":"208496c7-2a42-4416-974e-bd27203d83a0","title":"CNA Certification Prep","slug":"cna-certification-prep","description":"Prepare for Certified Nursing Assistant certification exam.","long_description":null,"category":"Healthcare","difficulty_level":"beginner","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":true,"enrollment_count":0,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["CNA","Nursing","Certification"],"course_code":"HC-101","estimated_hours":40,"instructor_name":"RN Jessica Roberts","is_free":true,"sort_order":1,"pathway_id":"06e3981b-9747-409e-82bb-b90da1f1a6b5","pathway_name":"Healthcare Careers","track_type":"local_career"},{"course_id":"e3471138-ad16-46c4-aceb-d5ea235ef1bc","title":"Medical Terminology","slug":"medical-terminology","description":"Essential healthcare vocabulary and medical abbreviations.","long_description":null,"category":"Healthcare","difficulty_level":"beginner","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":false,"enrollment_count":0,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["Medical","Terminology","Vocabulary"],"course_code":"HC-102","estimated_hours":16,"instructor_name":"Dr. Ryan Walker","is_free":true,"sort_order":2,"pathway_id":"06e3981b-9747-409e-82bb-b90da1f1a6b5","pathway_name":"Healthcare Careers","track_type":"local_career"},{"course_id":"5a2de2b6-5cd1-49ac-87ad-06fce977bdfc","title":"Patient Care Fundamentals","slug":"patient-care-fundamentals","description":"Hands-on patient care techniques and bedside manner.","long_description":null,"category":"Healthcare","difficulty_level":"beginner","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":false,"enrollment_count":0,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["Patient Care","Healthcare","Clinical"],"course_code":"HC-103","estimated_hours":24,"instructor_name":"LPN Maria Sanchez","is_free":true,"sort_order":3,"pathway_id":"06e3981b-9747-409e-82bb-b90da1f1a6b5","pathway_name":"Healthcare Careers","track_type":"local_career"},{"course_id":"2a77e2c3-15ca-47a7-bcac-cfc458ab9374","title":"Electrical Basics","slug":"electrical-basics","description":"Circuits, wiring, and electrical safety fundamentals.","long_description":null,"category":"Trades","difficulty_level":"beginner","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":true,"enrollment_count":0,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["Electrical","Wiring","Safety"],"course_code":"ST-101","estimated_hours":30,"instructor_name":"Master Electrician John Davis","is_free":true,"sort_order":1,"pathway_id":"5d7e73de-5279-4d31-b0f9-91b198ac2fbb","pathway_name":"Skilled Trades","track_type":"local_career"},{"course_id":"2e11c0eb-c504-4a96-af3d-b5c70795fb7b","title":"Plumbing Fundamentals","slug":"plumbing-fundamentals","description":"Pipe systems, fixtures, and residential plumbing repairs.","long_description":null,"category":"Trades","difficulty_level":"beginner","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":false,"enrollment_count":0,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["Plumbing","Pipes","Fixtures"],"course_code":"ST-102","estimated_hours":30,"instructor_name":"Licensed Plumber Tony Martinez","is_free":true,"sort_order":2,"pathway_id":"5d7e73de-5279-4d31-b0f9-91b198ac2fbb","pathway_name":"Skilled Trades","track_type":"local_career"},{"course_id":"229bcef2-06de-4018-adb4-4524c6e910bd","title":"OSHA Safety Certification","slug":"osha-safety-certification","description":"Workplace safety requirements and OSHA 10 certification prep.","long_description":null,"category":"Trades","difficulty_level":"beginner","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":false,"enrollment_count":0,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["OSHA","Safety","Certification"],"course_code":"ST-103","estimated_hours":10,"instructor_name":"Safety Officer Lisa Turner","is_free":true,"sort_order":3,"pathway_id":"5d7e73de-5279-4d31-b0f9-91b198ac2fbb","pathway_name":"Skilled Trades","track_type":"local_career"},{"course_id":"02d21c3e-bc64-49ec-8b7d-fed568b5642b","title":"Culinary Arts Basics","slug":"culinary-arts-basics","description":"Cooking techniques, food safety, and kitchen fundamentals.","long_description":null,"category":"Hospitality","difficulty_level":"beginner","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":true,"enrollment_count":0,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["Culinary","Cooking","Food Safety"],"course_code":"HS-101","estimated_hours":32,"instructor_name":"Chef Anthony Rivera","is_free":true,"sort_order":1,"pathway_id":"c6a3b745-5164-48ac-84a1-3e85e518c7fe","pathway_name":"Hospitality & Service","track_type":"local_career"},{"course_id":"e747a5f7-5f27-44c0-a418-0d4df3c72498","title":"Customer Service Excellence","slug":"customer-service-excellence","description":"Communication, problem resolution, and guest satisfaction.","long_description":null,"category":"Hospitality","difficulty_level":"beginner","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":false,"enrollment_count":0,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["Customer Service","Communication","Guest Relations"],"course_code":"HS-102","estimated_hours":16,"instructor_name":"Stephanie Brooks","is_free":true,"sort_order":2,"pathway_id":"c6a3b745-5164-48ac-84a1-3e85e518c7fe","pathway_name":"Hospitality & Service","track_type":"local_career"},{"course_id":"5bc13936-22c3-45b9-a011-fa56646e29cd","title":"Hotel Operations","slug":"hotel-operations","description":"Front desk, housekeeping, and hotel management basics.","long_description":null,"category":"Hospitality","difficulty_level":"beginner","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":false,"enrollment_count":0,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["Hotel","Management","Operations"],"course_code":"HS-103","estimated_hours":24,"instructor_name":"General Manager Carlos Hernandez","is_free":true,"sort_order":3,"pathway_id":"c6a3b745-5164-48ac-84a1-3e85e518c7fe","pathway_name":"Hospitality & Service","track_type":"local_career"},{"course_id":"470df672-bf36-46b3-a4e3-68541367b6a0","title":"Emergency Response Training","slug":"emergency-response-training","description":"First aid, CPR, and emergency protocols certification.","long_description":null,"category":"Public Safety","difficulty_level":"beginner","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":true,"enrollment_count":0,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["Emergency","First Aid","CPR"],"course_code":"PU-101","estimated_hours":30,"instructor_name":"Captain James Wilson","is_free":true,"sort_order":1,"pathway_id":"766441bf-0b82-4d93-9946-8dd4b6684c70","pathway_name":"Public Service","track_type":"local_career"},{"course_id":"09feadef-3c5a-499b-8318-7b5340772d67","title":"Community Services","slug":"community-services","description":"Social work basics and case management fundamentals.","long_description":null,"category":"Social Services","difficulty_level":"beginner","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":false,"enrollment_count":1,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["Social Work","Case Management","Community"],"course_code":"PU-102","estimated_hours":16,"instructor_name":"MSW Helen Patterson","is_free":true,"sort_order":2,"pathway_id":"766441bf-0b82-4d93-9946-8dd4b6684c70","pathway_name":"Public Service","track_type":"local_career"},{"course_id":"f14d0777-dbea-412b-9b18-d4d851759382","title":"Public Administration","slug":"public-administration","description":"Government operations and civic engagement.","long_description":null,"category":"Government","difficulty_level":"intermediate","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":false,"enrollment_count":0,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["Government","Civics","Administration"],"course_code":"PU-103","estimated_hours":24,"instructor_name":"Director Margaret Collins","is_free":true,"sort_order":3,"pathway_id":"766441bf-0b82-4d93-9946-8dd4b6684c70","pathway_name":"Public Service","track_type":"local_career"},{"course_id":"905ebb09-9973-4371-b034-450727281bf2","title":"Foundational Literacy","slug":"foundational-literacy","description":"Letter recognition, phonics, and early reading skills for ages 3-5.","long_description":null,"category":"Early Education","difficulty_level":"beginner","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":true,"enrollment_count":0,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["Literacy","Phonics","Reading"],"course_code":"EC-101","estimated_hours":24,"instructor_name":"Ms. Rebecca Mills","is_free":true,"sort_order":1,"pathway_id":"0a680b20-d8b8-4405-9e12-ac0ef8ecda07","pathway_name":"Early Childhood Education","track_type":"local_education"},{"course_id":"55f317fb-5845-4258-9f30-401b2612605b","title":"Number Concepts","slug":"number-concepts","description":"Counting, shapes, and basic math readiness for young learners.","long_description":null,"category":"Early Education","difficulty_level":"beginner","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":false,"enrollment_count":1,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["Math","Numbers","Shapes"],"course_code":"EC-102","estimated_hours":18,"instructor_name":"Mr. Daniel Hughes","is_free":true,"sort_order":2,"pathway_id":"0a680b20-d8b8-4405-9e12-ac0ef8ecda07","pathway_name":"Early Childhood Education","track_type":"local_education"},{"course_id":"37469744-c25e-4dc6-8af2-f4dca775410b","title":"Social-Emotional Learning","slug":"social-emotional-learning","description":"Self-regulation, cooperation, and empathy development.","long_description":null,"category":"Early Education","difficulty_level":"beginner","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":false,"enrollment_count":0,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["SEL","Emotions","Social Skills"],"course_code":"EC-103","estimated_hours":18,"instructor_name":"Dr. Karen White","is_free":true,"sort_order":3,"pathway_id":"0a680b20-d8b8-4405-9e12-ac0ef8ecda07","pathway_name":"Early Childhood Education","track_type":"local_education"},{"course_id":"e53e96eb-74fc-4d04-b534-16cc6eb2acc7","title":"Reading Comprehension","slug":"reading-comprehension","description":"Fluency, vocabulary, and comprehension strategies for grades 1-5.","long_description":null,"category":"Primary Education","difficulty_level":"beginner","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":true,"enrollment_count":0,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["Reading","Comprehension","Vocabulary"],"course_code":"PS-101","estimated_hours":30,"instructor_name":"Mrs. Sandra Lopez","is_free":true,"sort_order":1,"pathway_id":"6bff81ae-8164-4111-80c6-2a829fbdd0a3","pathway_name":"Primary School","track_type":"local_education"},{"course_id":"fb621ea9-bd96-451d-9906-5c4eb964f4f9","title":"Math Foundations","slug":"math-foundations","description":"Arithmetic, problem-solving, and math fluency fundamentals.","long_description":null,"category":"Primary Education","difficulty_level":"beginner","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":false,"enrollment_count":1,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["Math","Arithmetic","Problem Solving"],"course_code":"PS-102","estimated_hours":30,"instructor_name":"Mr. Thomas Green","is_free":true,"sort_order":2,"pathway_id":"6bff81ae-8164-4111-80c6-2a829fbdd0a3","pathway_name":"Primary School","track_type":"local_education"},{"course_id":"5a4c6c16-312c-4394-b1e6-c6b76a7bb1d0","title":"Science Exploration","slug":"science-exploration","description":"Hands-on experiments and discovery-based science learning.","long_description":null,"category":"Primary Education","difficulty_level":"beginner","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":false,"enrollment_count":0,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["Science","Experiments","Discovery"],"course_code":"PS-103","estimated_hours":24,"instructor_name":"Dr. Michael Brown","is_free":true,"sort_order":3,"pathway_id":"6bff81ae-8164-4111-80c6-2a829fbdd0a3","pathway_name":"Primary School","track_type":"local_education"},{"course_id":"c1ec0663-e3e3-4344-823c-76da0e2f87de","title":"Algebra & Geometry","slug":"algebra-geometry","description":"Core math concepts for college readiness in grades 6-12.","long_description":null,"category":"Secondary Education","difficulty_level":"intermediate","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":true,"enrollment_count":0,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["Algebra","Geometry","Math"],"course_code":"SS-101","estimated_hours":36,"instructor_name":"Prof. Elizabeth Davis","is_free":true,"sort_order":1,"pathway_id":"12cb2ae9-ad53-461d-b26d-f1ecb225d1d2","pathway_name":"Secondary School","track_type":"local_education"},{"course_id":"0d8025c5-00d7-4920-a1d6-638bfaa52f51","title":"English Language Arts","slug":"english-language-arts","description":"Writing, analysis, and communication skills development.","long_description":null,"category":"Secondary Education","difficulty_level":"intermediate","estimated_duration":null,"price":null,"thumbnail_url":null,"preview_video_url":null,"is_published":true,"is_featured":false,"enrollment_count":0,"rating_average":null,"rating_count":0,"language":"en","prerequisites":null,"learning_outcomes":null,"tags":["English","Writing","Analysis"],"course_code":"SS-102","estimated_hours":36,"instructor_name":"Mrs. Victoria Adams","is_free":true,"sort_order":2,"pathway_id":"12cb2ae9-ad53-461d-b26d-f1ecb225d1d2","path

... [1 lines truncated] ...
All production systems are healthy. Now I have all the information needed for the Auto-Continuity response. Let me update STATE.json with the new session number:

Read
C:\dev\pmerit\pmerit-ai-platform\docs\aados\STATE.json
Read 30 lines
The session is already at 65. Now let me update STATE.json with the current session 66 and audit timestamp:

Edit
C:\dev\pmerit\pmerit-ai-platform\docs\aados\STATE.json
  "schema_version": "3.2",

  "schema_notes": "Session 65 - Migrated from E:\\pmerit to C:\\dev\\pmerit + Isolated Node.js v20.18.1",

 

  "last_updated": "2025-12-21T21:15:00Z",

  "last_updated_by": "claude-code",

 

  "session_number": 65,

  "schema_notes": "Session 66 - Migrated from E:\\pmerit to C:\\dev\\pmerit + Isolated Node.js v20.18.1",

 

  "last_updated": "2025-12-21T21:39:00Z",

  "last_updated_by": "claude-code",

 

  "session_number": 66,

  "last_audit_date": "2025-12-21",

🔄 PMERIT AUTO-CONTINUITY ACTIVATED — Session 66
🔒 Sync Gate: Confirmed (branch up to date with origin/main)
📍 Current Phase: POST_CLASSROOM (Voice System Complete / ARCH-2 / Assessment Enhancements)
📊 Phase Status: ready_for_execution
🎯 Active Requirement: VOICE_SYSTEM_COMPLETE
📂 Active Scope: SCOPE_pricing (status: frontend_complete)
⚡ Workflow Mode: direct_execution

📋 HANDOFF REVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Latest: PMERIT_HANDOFF_SESSION_55_VOICE_CONTINUATION.md
Status: In Progress (Premium voices blocked)

Incomplete Tasks:

 Premium Piper TTS deployment blocked (RunPod terminal paste issues)
 Options: SSH, Jupyter File Browser, GitHub clone, or skip premium
🩺 PRODUCTION AUDIT (Quick Check)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Component	Status	Notes
Frontend	✅	pmerit.com loading correctly
Backend API	✅	v2.2.0 healthy, 40+ endpoints
AI Services	✅	Chat streaming responses working
Pathways	✅	14 pathways returned
Courses	✅	42 courses returned
Homepage Gate	✅	9/10 verified (H7 partial)
📊 Current State Summary
Completed Scopes:

SCOPE_HOMEPAGE ✅
SCOPE_ASSESSMENT ✅
SCOPE_DASHBOARD ✅
SCOPE_CLASSROOM ✅
SCOPE_AVATAR ✅
SCOPE_ENROLLMENT ✅
SCOPE_TTS ✅
SCOPE_Learning_Pathways ✅
SCOPE_courses ✅
In Progress:

SCOPE_pricing (frontend_complete, backend NOT implemented)
SCOPE_donate (frontend_complete, backend NOT implemented)
SCOPE_EMAIL_SYSTEM (in_progress)
SCOPE_ADMIN (Phase B frontend complete)
Not Started:

SCOPE_CREDENTIALS (ARCH-2/3 blockchain)
SCOPE_SELF_HOSTED_PREMIUM (Dell R740 infrastructure)
📚 Reference Docs
Feature Spec: docs/handoffs/BRAINSTORM_ASU_LIKE_SCHEMA.md
User Flow: docs/project/Pmerit-comprehensively-narrative-users-and-Admin-Journey.md
Active Scope: .claude/scopes/SCOPE_pricing.md
⏭️ Next Action
Based on the audit and handoff review, several paths are available:

Continue Voice System — Resolve RunPod premium TTS deployment (SSH/Jupyter/GitHub clone)
Pricing Backend — Implement subscription/payment API endpoints
Email System — Continue SCOPE_EMAIL_SYSTEM work
Admin Portal — Continue Phase B work
Classroom UX Redesign — App Shell architecture (planning complete)
Note: 2 untracked files detected in repo:

.claude/scopes/CLAUDE_WEB_INSTRUCTIONS.MD
.claude/scopes/environment_migration_from_E_to_C.md
What would you like to focus on this session?

I want you to update "CLAUDE_WEB_INSTRUCTIONS.MD" with the migration information in "environment_migration_from_E_to_C.md".

Let me read both files to understand what needs to be updated:

Read
C:\dev\pmerit\pmerit-ai-platform\.claude\scopes\CLAUDE_WEB_INSTRUCTIONS.MD
Read 273 lines
Read
C:\dev\pmerit\pmerit-ai-platform\.claude\scopes\environment_migration_from_E_to_C.md
Read 1,027 lines
I see - the environment_migration_from_E_to_C.md file contains the transcript of the migration session. The CLAUDE_WEB_INSTRUCTIONS.MD file still has the old E:\pmerit paths. Let me update it with the new environment information:

Edit
C:\dev\pmerit\pmerit-ai-platform\.claude\scopes\CLAUDE_WEB_INSTRUCTIONS.MD
# CLAUDE WEB INSTRUCTIONS (Synced Copy)

 

**Purpose:** This file mirrors Claude Web's instructions so Claude Code has visibility into what the Architect role sees.

**Last Synced:** 2025-12-13

**Sync Method:** Manual copy from Claude Web settings

**Workflow Version:** 2.0 (Reality-First)

**Last Synced:** 2025-12-21

**Sync Method:** Manual copy from Claude Web settings

**Workflow Version:** 2.1 (Reality-First + Local Environment Migration)

Edit
C:\dev\pmerit\pmerit-ai-platform\.claude\scopes\CLAUDE_WEB_INSTRUCTIONS.MD
- **API:** https://pmerit-api-worker.peoplemerit.workers.dev

- **Repository (Frontend):** https://github.com/peoplemerit/pmerit-ai-platform

- **Repository (Backend):** https://github.com/peoplemerit/pmerit-api-worker

- **Local Path (Frontend):** E:\pmerit\pmerit-ai-platform

- **Local Path (Backend):** E:\pmerit\pmerit-api-worker

- **Local Path (Project Root):** `C:\dev\pmerit\`

- **Local Path (Frontend):** `C:\dev\pmerit\pmerit-ai-platform`

- **Local Path (Backend):** `C:\dev\pmerit\pmerit-api-worker`

 

### Isolated Node.js Environment (NEW - Session 65)

 

The project uses a **local Node.js installation** to prevent system updates from affecting development.

 

| Component | Location |

|-----------|----------|

| **Node.js** | `C:\dev\pmerit\.node\node-v20.18.1-win-x64\` |

| **Version** | v20.18.1 LTS |

| **NPM** | v10.8.2 |

 

**Before running npm/node commands, activate the environment:**

Show full diff (4 more lines)
Edit
C:\dev\pmerit\pmerit-ai-platform\.claude\scopes\CLAUDE_WEB_INSTRUCTIONS.MD
 

| ID | Name | Local Path | When to Use |

|----|------|------------|-------------|

| `FE` | Frontend | `E:\pmerit\pmerit-ai-platform` | UI, styling, client JS, docs |

| `BE` | Backend | `E:\pmerit\pmerit-api-worker` | API endpoints, AI personas, TTS |

| `FE` | Frontend | `C:\dev\pmerit\pmerit-ai-platform` | UI, styling, client JS, docs |

| `BE` | Backend | `C:\dev\pmerit\pmerit-api-worker` | API endpoints, AI personas, TTS |

| `DB` | Database | Neon Dashboard | Schema changes, data migrations |

| `TR` | Translation | Azure Portal | Translation API config |

Edit
C:\dev\pmerit\pmerit-ai-platform\.claude\scopes\CLAUDE_WEB_INSTRUCTIONS.MD
## ⚡ Session Startup

 

### Using PowerShell Script (Recommended)

 

```powershell

# From E:\pmerit\pmerit-ai-platform

.\Start-PmeritSession.ps1

```

### Activating the Local Environment (Required)

 

```powershell

# Step 1: Navigate to project root

cd C:\dev\pmerit

 

# Step 2: Activate isolated Node.js environment

.\pmerit-env.ps1

 

# Step 3: Navigate to frontend or backend as needed

cd pmerit-ai-platform  # or pmerit-api-worker

```

Show full diff (4 more lines)
Edit
C:\dev\pmerit\pmerit-ai-platform\.claude\scopes\CLAUDE_WEB_INSTRUCTIONS.MD
### Commit Changes

 

```bash

cd E:\pmerit\pmerit-ai-platform

git add .claude/CLAUDE_WEB_SYNC.md

cd C:\dev\pmerit\pmerit-ai-platform

git add .claude/scopes/CLAUDE_WEB_INSTRUCTIONS.MD

git commit -m "docs: Sync Claude Web instructions"

git push origin main

```

Edit
C:\dev\pmerit\pmerit-ai-platform\.claude\scopes\CLAUDE_WEB_INSTRUCTIONS.MD
---

 

*Last Synced: 2025-12-12*

*Last Synced: 2025-12-21*

*Migration: E:\pmerit → C:\dev\pmerit (Session 65)*

The CLAUDE_WEB_INSTRUCTIONS.MD file has been updated with all the migration information. Here's a summary of the changes:

Updates made to CLAUDE_WEB_INSTRUCTIONS.MD:

Section	Change
Header	Updated Last Synced to 2025-12-21, Workflow Version to 2.1
Project Identity	Updated all local paths from E:\pmerit to C:\dev\pmerit\
New Section	Added "Isolated Node.js Environment" with v20.18.1 LTS details
Environment Map	Updated FE/BE paths to new C: drive location
Session Startup	Replaced old script with new pmerit-env.ps1 activation steps
New Note	Added Migration Note explaining the change
Commit Changes	Updated path in example command
Footer	Updated sync date and added migration note
Would you like me to commit these changes and optionally delete the environment_migration_from_E_to_C.md file (since its content has now been integrated)?

Yes

Bash
cd /c/dev/pmerit/pmerit-ai-platform && git add .claude/scopes/CLAUDE_WEB_INSTRUCTIONS.MD .claude/scopes/environment_migration_from_E_to_C.md docs/aados/STATE.json && git status --short
A  .claude/scopes/CLAUDE_WEB_INSTRUCTIONS.MD
A  .claude/scopes/environment_migration_from_E_to_C.md
M  docs/aados/STATE.json
API Error: 401 {"type":"error","error":{"type":"authentication_error","message":"OAuth token has expired. Please obtain a new token or refresh your existing token."},"request_id":"req_011CWLactzu7b1x5Pr2gdZLX"} · Please run /login

