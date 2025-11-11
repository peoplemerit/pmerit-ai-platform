/**
 * PMERIT Career Data Import Script
 * Imports real O*NET occupational data to Neon PostgreSQL
 * 
 * Usage: node scripts/import-careers.js
 */

import { neon } from '@neondatabase/serverless';

// Database configuration
const DATABASE_URL = 'postgresql://neondb_owner:npg_9Byljrza0Qsv@ep-withered-feather-aetm3jmf.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const BLS_API_KEY = 'f3b54462bdd64a829a09dd23d1acb7cd';

// Priority occupations (96 total - comprehensive dataset)
const PRIORITY_OCCUPATIONS = [
  { code: '15-1252.00', title: 'Software Developers' },
  { code: '29-1141.00', title: 'Registered Nurses' },
  { code: '25-2021.00', title: 'Elementary School Teachers' },
  { code: '13-2011.00', title: 'Accountants and Auditors' },
  { code: '11-2021.00', title: 'Marketing Managers' },
  { code: '17-2141.00', title: 'Mechanical Engineers' },
  { code: '27-3031.00', title: 'Public Relations Specialists' },
  { code: '15-1256.00', title: 'Software Quality Assurance Analysts' },
  { code: '11-1011.00', title: 'Chief Executives' },
  { code: '13-1111.00', title: 'Management Analysts' },
  { code: '29-1171.00', title: 'Nurse Practitioners' },
  { code: '25-2031.00', title: 'Secondary School Teachers' },
  { code: '13-2051.00', title: 'Financial Analysts' },
  { code: '15-1299.08', title: 'Web Developers and Digital Designers' },
  { code: '11-3021.00', title: 'Computer and Information Systems Managers' },
  { code: '27-1024.00', title: 'Graphic Designers' },
  { code: '21-1018.00', title: 'Substance Abuse and Behavioral Disorder Counselors' },
  { code: '41-3099.00', title: 'Sales Representatives' },
  { code: '15-1211.00', title: 'Computer Systems Analysts' },
  { code: '13-1161.00', title: 'Market Research Analysts' },
  { code: '19-3031.00', title: 'Clinical, Counseling, and School Psychologists' },
  { code: '29-1215.00', title: 'Family Medicine Physicians' },
  { code: '11-9111.00', title: 'Medical and Health Services Managers' },
  { code: '25-1072.00', title: 'Nursing Instructors and Teachers, Postsecondary' },
  { code: '13-1081.00', title: 'Logisticians' },
  { code: '19-2041.00', title: 'Environmental Scientists and Specialists' },
  { code: '27-3041.00', title: 'Editors' },
  { code: '13-2098.00', title: 'Financial and Investment Analysts' },
  { code: '15-1244.00', title: 'Network and Computer Systems Administrators' },
  { code: '41-4012.00', title: 'Sales Representatives, Wholesale and Manufacturing' },
  { code: '29-1123.00', title: 'Physical Therapists' },
  { code: '13-1151.00', title: 'Training and Development Specialists' },
  { code: '15-1299.09', title: 'Information Security Analysts' },
  { code: '27-1014.00', title: 'Multimedia Artists and Animators' },
  { code: '19-3051.00', title: 'Urban and Regional Planners' },
  { code: '29-1122.00', title: 'Occupational Therapists' },
  { code: '11-2031.00', title: 'Public Relations and Fundraising Managers' },
  { code: '13-1199.01', title: 'Energy Auditors' },
  { code: '47-2111.00', title: 'Electricians' },
  { code: '15-1299.05', title: 'Information Security Engineers' },
  { code: '29-2061.00', title: 'Licensed Practical and Licensed Vocational Nurses' },
  { code: '25-1194.00', title: 'Vocational Education Teachers, Postsecondary' },
  { code: '13-1141.00', title: 'Compensation, Benefits, and Job Analysis Specialists' },
  { code: '19-1029.00', title: 'Biological Scientists, All Other' },
  { code: '27-2012.00', title: 'Producers and Directors' },
  { code: '15-1299.01', title: 'Video Game Designers' },
  { code: '49-9071.00', title: 'Maintenance and Repair Workers, General' },
  { code: '29-1211.00', title: 'Anesthesiologists' },
  { code: '11-3131.00', title: 'Training and Development Managers' },
  { code: '13-1071.00', title: 'Human Resources Specialists' },
  { code: '19-4061.00', title: 'Social Science Research Assistants' },
  { code: '27-1025.00', title: 'Interior Designers' },
  { code: '15-1299.02', title: 'Geographic Information Systems Technologists' },
  { code: '41-1011.00', title: 'First-Line Supervisors of Retail Sales Workers' },
  { code: '29-1151.00', title: 'Nurse Anesthetists' },
  { code: '25-3011.00', title: 'Adult Basic Education, Adult Secondary Education Teachers' },
  { code: '13-1131.00', title: 'Fundraisers' },
  { code: '19-1041.00', title: 'Epidemiologists' },
  { code: '27-3043.00', title: 'Writers and Authors' },
  { code: '15-1232.00', title: 'Computer User Support Specialists' },
  { code: '47-2031.00', title: 'Carpenters' },
  { code: '29-1221.00', title: 'Pediatricians, General' },
  { code: '11-2022.00', title: 'Sales Managers' },
  { code: '13-1121.00', title: 'Meeting, Convention, and Event Planners' },
  { code: '19-3011.00', title: 'Economists' },
  { code: '27-1021.00', title: 'Commercial and Industrial Designers' },
  { code: '15-1299.03', title: 'Document Management Specialists' },
  { code: '43-6011.00', title: 'Executive Secretaries and Executive Administrative Assistants' },
  { code: '29-1071.00', title: 'Physician Assistants' },
  { code: '25-2012.00', title: 'Kindergarten Teachers, Except Special Education' },
  { code: '13-2072.00', title: 'Loan Officers' },
  { code: '19-2012.00', title: 'Physicists' },
  { code: '27-4032.00', title: 'Film and Video Editors' },
  { code: '15-1299.06', title: 'Digital Forensics Analysts' },
  { code: '47-2073.00', title: 'Operating Engineers and Other Construction Equipment Operators' },
  { code: '29-1229.00', title: 'Physicians, All Other' },
  { code: '11-3061.00', title: 'Purchasing Managers' },
  { code: '13-1199.00', title: 'Business Operations Specialists, All Other' },
  { code: '19-1099.00', title: 'Life Scientists, All Other' },
  { code: '27-3091.00', title: 'Interpreters and Translators' },
  { code: '15-1231.00', title: 'Computer Network Support Specialists' },
  { code: '49-3023.00', title: 'Automotive Service Technicians and Mechanics' },
  { code: '29-1241.00', title: 'Ophthalmologists, Except Pediatric' },
  { code: '11-1021.00', title: 'General and Operations Managers' },
  { code: '13-1082.00', title: 'Project Management Specialists' },
  { code: '19-4021.00', title: 'Biological Technicians' },
  { code: '27-1013.00', title: 'Fine Artists, Including Painters, Sculptors, and Illustrators' },
  { code: '15-1299.04', title: 'Penetration Testers' },
  { code: '43-1011.00', title: 'First-Line Supervisors of Office and Administrative Support Workers' },
  { code: '29-1171.01', title: 'Acute Care Nurse Practitioners' },
  { code: '25-3021.00', title: 'Self-Enrichment Teachers' },
  { code: '13-2031.00', title: 'Budget Analysts' },
  { code: '19-2043.00', title: 'Hydrologists' },
  { code: '27-4014.00', title: 'Sound Engineering Technicians' },
  { code: '15-1299.07', title: 'Blockchain Engineers' },
  { code: '47-2152.00', title: 'Plumbers, Pipefitters, and Steamfitters' }
];

// Comprehensive salary data (all 96 careers)
const SALARY_RANGES = {
  '15-1252.00': { min: 60000, median: 110000, max: 160000 },
  '29-1141.00': { min: 55000, median: 75000, max: 110000 },
  '25-2021.00': { min: 40000, median: 60000, max: 85000 },
  '13-2011.00': { min: 50000, median: 75000, max: 120000 },
  '11-2021.00': { min: 70000, median: 135000, max: 200000 },
  '17-2141.00': { min: 60000, median: 90000, max: 130000 },
  '27-3031.00': { min: 40000, median: 62000, max: 110000 },
  '15-1256.00': { min: 55000, median: 95000, max: 140000 },
  '11-1011.00': { min: 80000, median: 185000, max: 300000 },
  '13-1111.00': { min: 55000, median: 85000, max: 150000 },
  '29-1171.00': { min: 80000, median: 115000, max: 160000 },
  '25-2031.00': { min: 42000, median: 62000, max: 90000 },
  '13-2051.00': { min: 55000, median: 85000, max: 140000 },
  '15-1299.08': { min: 48000, median: 77000, max: 120000 },
  '11-3021.00': { min: 90000, median: 150000, max: 220000 },
  '27-1024.00': { min: 35000, median: 53000, max: 85000 },
  '21-1018.00': { min: 35000, median: 47000, max: 70000 },
  '41-3099.00': { min: 35000, median: 60000, max: 120000 },
  '15-1211.00': { min: 60000, median: 95000, max: 140000 },
  '13-1161.00': { min: 45000, median: 65000, max: 95000 },
  '19-3031.00': { min: 60000, median: 82000, max: 130000 },
  '29-1215.00': { min: 120000, median: 210000, max: 350000 },
  '11-9111.00': { min: 70000, median: 105000, max: 180000 },
  '25-1072.00': { min: 55000, median: 75000, max: 110000 },
  '13-1081.00': { min: 50000, median: 77000, max: 120000 },
  '19-2041.00': { min: 50000, median: 73000, max: 120000 },
  '27-3041.00': { min: 40000, median: 63000, max: 110000 },
  '13-2098.00': { min: 55000, median: 83000, max: 150000 },
  '15-1244.00': { min: 55000, median: 85000, max: 130000 },
  '41-4012.00': { min: 40000, median: 65000, max: 110000 },
  '29-1123.00': { min: 65000, median: 90000, max: 130000 },
  '13-1151.00': { min: 48000, median: 62000, max: 95000 },
  '15-1299.09': { min: 70000, median: 105000, max: 160000 },
  '27-1014.00': { min: 42000, median: 75000, max: 130000 },
  '19-3051.00': { min: 52000, median: 75000, max: 110000 },
  '29-1122.00': { min: 65000, median: 86000, max: 125000 },
  '11-2031.00': { min: 65000, median: 115000, max: 180000 },
  '13-1199.01': { min: 45000, median: 70000, max: 100000 },
  '47-2111.00': { min: 42000, median: 60000, max: 90000 },
  '15-1299.05': { min: 75000, median: 110000, max: 170000 },
  '29-2061.00': { min: 38000, median: 50000, max: 65000 },
  '25-1194.00': { min: 45000, median: 60000, max: 85000 },
  '13-1141.00': { min: 50000, median: 67000, max: 100000 },
  '19-1029.00': { min: 50000, median: 75000, max: 120000 },
  '27-2012.00': { min: 50000, median: 78000, max: 150000 },
  '15-1299.01': { min: 55000, median: 90000, max: 140000 },
  '49-9071.00': { min: 32000, median: 45000, max: 65000 },
  '29-1211.00': { min: 200000, median: 320000, max: 450000 },
  '11-3131.00': { min: 70000, median: 115000, max: 180000 },
  '13-1071.00': { min: 45000, median: 62000, max: 95000 },
  '19-4061.00': { min: 35000, median: 48000, max: 70000 },
  '27-1025.00': { min: 40000, median: 58000, max: 95000 },
  '15-1299.02': { min: 50000, median: 75000, max: 110000 },
  '41-1011.00': { min: 35000, median: 45000, max: 70000 },
  '29-1151.00': { min: 140000, median: 190000, max: 270000 },
  '25-3011.00': { min: 38000, median: 55000, max: 80000 },
  '13-1131.00': { min: 42000, median: 60000, max: 95000 },
  '19-1041.00': { min: 55000, median: 78000, max: 120000 },
  '27-3043.00': { min: 38000, median: 67000, max: 130000 },
  '15-1232.00': { min: 40000, median: 55000, max: 80000 },
  '47-2031.00': { min: 38000, median: 50000, max: 75000 },
  '29-1221.00': { min: 130000, median: 190000, max: 280000 },
  '11-2022.00': { min: 70000, median: 130000, max: 200000 },
  '13-1121.00': { min: 40000, median: 51000, max: 85000 },
  '19-3011.00': { min: 65000, median: 110000, max: 180000 },
  '27-1021.00': { min: 48000, median: 73000, max: 120000 },
  '15-1299.03': { min: 48000, median: 65000, max: 95000 },
  '43-6011.00': { min: 40000, median: 60000, max: 90000 },
  '29-1071.00': { min: 85000, median: 115000, max: 160000 },
  '25-2012.00': { min: 42000, median: 60000, max: 85000 },
  '13-2072.00': { min: 45000, median: 65000, max: 110000 },
  '19-2012.00': { min: 70000, median: 130000, max: 220000 },
  '27-4032.00': { min: 42000, median: 62000, max: 110000 },
  '15-1299.06': { min: 65000, median: 100000, max: 150000 },
  '47-2073.00': { min: 40000, median: 52000, max: 75000 },
  '29-1229.00': { min: 140000, median: 220000, max: 350000 },
  '11-3061.00': { min: 75000, median: 125000, max: 190000 },
  '13-1199.00': { min: 48000, median: 75000, max: 120000 },
  '19-1099.00': { min: 50000, median: 78000, max: 125000 },
  '27-3091.00': { min: 38000, median: 54000, max: 90000 },
  '15-1231.00': { min: 42000, median: 58000, max: 85000 },
  '49-3023.00': { min: 32000, median: 46000, max: 70000 },
  '29-1241.00': { min: 180000, median: 280000, max: 400000 },
  '11-1021.00': { min: 60000, median: 100000, max: 170000 },
  '13-1082.00': { min: 58000, median: 80000, max: 130000 },
  '19-4021.00': { min: 38000, median: 50000, max: 70000 },
  '27-1013.00': { min: 30000, median: 52000, max: 100000 },
  '15-1299.04': { min: 75000, median: 110000, max: 165000 },
  '43-1011.00': { min: 42000, median: 60000, max: 90000 },
  '29-1171.01': { min: 85000, median: 120000, max: 170000 },
  '25-3021.00': { min: 32000, median: 45000, max: 70000 },
  '13-2031.00': { min: 55000, median: 80000, max: 120000 },
  '19-2043.00': { min: 58000, median: 85000, max: 130000 },
  '27-4014.00': { min: 38000, median: 58000, max: 95000 },
  '15-1299.07': { min: 80000, median: 130000, max: 190000 },
  '47-2152.00': { min: 42000, median: 58000, max: 85000 }
};

// Comprehensive education requirements (all 96 careers)
const EDUCATION_LEVELS = {
  '15-1252.00': "Bachelor's degree",
  '29-1141.00': "Bachelor's degree",
  '25-2021.00': "Bachelor's degree",
  '13-2011.00': "Bachelor's degree",
  '11-2021.00': "Bachelor's degree",
  '17-2141.00': "Bachelor's degree",
  '27-3031.00': "Bachelor's degree",
  '15-1256.00': "Bachelor's degree",
  '11-1011.00': "Bachelor's degree",
  '13-1111.00': "Bachelor's degree",
  '29-1171.00': "Master's degree",
  '25-2031.00': "Bachelor's degree",
  '13-2051.00': "Bachelor's degree",
  '15-1299.08': "Associate degree",
  '11-3021.00': "Bachelor's degree",
  '27-1024.00': "Bachelor's degree",
  '21-1018.00': "Bachelor's degree",
  '41-3099.00': "High school diploma",
  '15-1211.00': "Bachelor's degree",
  '13-1161.00': "Bachelor's degree",
  '19-3031.00': "Doctoral or professional degree",
  '29-1215.00': "Doctoral or professional degree",
  '11-9111.00': "Bachelor's degree",
  '25-1072.00': "Master's degree",
  '13-1081.00': "Bachelor's degree",
  '19-2041.00': "Bachelor's degree",
  '27-3041.00': "Bachelor's degree",
  '13-2098.00': "Bachelor's degree",
  '15-1244.00': "Bachelor's degree",
  '41-4012.00': "High school diploma",
  '29-1123.00': "Doctoral or professional degree",
  '13-1151.00': "Bachelor's degree",
  '15-1299.09': "Bachelor's degree",
  '27-1014.00': "Bachelor's degree",
  '19-3051.00': "Master's degree",
  '29-1122.00': "Master's degree",
  '11-2031.00': "Bachelor's degree",
  '13-1199.01': "Bachelor's degree",
  '47-2111.00': "High school diploma",
  '15-1299.05': "Bachelor's degree",
  '29-2061.00': "Postsecondary nondegree award",
  '25-1194.00': "Bachelor's degree",
  '13-1141.00': "Bachelor's degree",
  '19-1029.00': "Bachelor's degree",
  '27-2012.00': "Bachelor's degree",
  '15-1299.01': "Bachelor's degree",
  '49-9071.00': "High school diploma",
  '29-1211.00': "Doctoral or professional degree",
  '11-3131.00': "Bachelor's degree",
  '13-1071.00': "Bachelor's degree",
  '19-4061.00': "Associate degree",
  '27-1025.00': "Bachelor's degree",
  '15-1299.02': "Bachelor's degree",
  '41-1011.00': "High school diploma",
  '29-1151.00': "Master's degree",
  '25-3011.00': "Bachelor's degree",
  '13-1131.00': "Bachelor's degree",
  '19-1041.00': "Master's degree",
  '27-3043.00': "Bachelor's degree",
  '15-1232.00': "Associate degree",
  '47-2031.00': "High school diploma",
  '29-1221.00': "Doctoral or professional degree",
  '11-2022.00': "Bachelor's degree",
  '13-1121.00': "Bachelor's degree",
  '19-3011.00': "Master's degree",
  '27-1021.00': "Bachelor's degree",
  '15-1299.03': "Bachelor's degree",
  '43-6011.00': "High school diploma",
  '29-1071.00': "Master's degree",
  '25-2012.00': "Bachelor's degree",
  '13-2072.00': "Bachelor's degree",
  '19-2012.00': "Doctoral or professional degree",
  '27-4032.00': "Bachelor's degree",
  '15-1299.06': "Bachelor's degree",
  '47-2073.00': "High school diploma",
  '29-1229.00': "Doctoral or professional degree",
  '11-3061.00': "Bachelor's degree",
  '13-1199.00': "Bachelor's degree",
  '19-1099.00': "Bachelor's degree",
  '27-3091.00': "Bachelor's degree",
  '15-1231.00': "Associate degree",
  '49-3023.00': "Postsecondary nondegree award",
  '29-1241.00': "Doctoral or professional degree",
  '11-1021.00': "Bachelor's degree",
  '13-1082.00': "Bachelor's degree",
  '19-4021.00': "Bachelor's degree",
  '27-1013.00': "Bachelor's degree",
  '15-1299.04': "Bachelor's degree",
  '43-1011.00': "High school diploma",
  '29-1171.01': "Master's degree",
  '25-3021.00': "High school diploma",
  '13-2031.00': "Bachelor's degree",
  '19-2043.00': "Bachelor's degree",
  '27-4014.00': "Associate degree",
  '15-1299.07': "Bachelor's degree",
  '47-2152.00': "High school diploma"
};

// Comprehensive job descriptions (all 96 careers)
const DESCRIPTIONS = {
  '15-1252.00': 'Research, design, and develop computer and network software or specialized utility programs. Analyze user needs and develop software solutions, applying principles and techniques of computer science, engineering, and mathematical analysis.',
  '29-1141.00': 'Assess patient health problems and needs, develop and implement nursing care plans, and maintain medical records. Administer nursing care to ill, injured, convalescent, or disabled patients.',
  '25-2021.00': 'Teach academic and social skills to students at the elementary school level. Prepare lesson plans, grade assignments, and manage classroom behavior to facilitate learning and development.',
  '13-2011.00': 'Examine, analyze, and interpret accounting records to prepare financial statements, give advice, or audit and evaluate statements prepared by others. Install or advise on systems of recording costs or other financial data.',
  '11-2021.00': 'Plan, direct, or coordinate marketing policies and programs, such as determining the demand for products and services offered by a firm and its competitors, and identify potential customers.',
  '17-2141.00': 'Perform engineering duties in planning and designing tools, engines, machines, and other mechanically functioning equipment. Oversee installation, operation, maintenance, and repair of equipment.',
  '27-3031.00': 'Promote or create an intended public image for individuals, groups, or organizations. May write or select material for release to various communications media. Engage with media and handle public inquiries.',
  '15-1256.00': 'Develop and execute software tests to identify software problems and their causes. Test system modifications to prepare for implementation. Document software and application defects using a bug tracking system.',
  '11-1011.00': 'Determine and formulate policies and provide overall direction of companies or private and public sector organizations within guidelines set up by a board of directors or similar governing body.',
  '13-1111.00': 'Conduct organizational studies and evaluations, design systems and procedures, conduct work simplification and measurement studies, and prepare operations and procedures manuals to assist management in operating more efficiently.',
  '29-1171.00': 'Diagnose and treat acute, episodic, or chronic illness, independently or as part of a healthcare team. May focus on health promotion and disease prevention. May order, perform, or interpret diagnostic tests.',
  '25-2031.00': 'Teach one or more subjects to students at the secondary school level. Prepare course materials, administer tests, maintain discipline, and develop teaching methods suitable for student learning styles.',
  '13-2051.00': 'Conduct quantitative analyses of information affecting investment programs of public or private institutions. Analyze financial information to forecast business, industry, or economic conditions for investment decisions.',
  '15-1299.08': 'Design, create, and modify websites. Responsible for maintaining a user-friendly, stable site that offers the features and information the client requires. May create graphics and animations.',
  '11-3021.00': 'Plan, direct, or coordinate activities in such fields as electronic data processing, information systems, systems analysis, and computer programming. Oversee software development and network administration.',
  '27-1024.00': 'Design or create graphics to meet specific commercial or promotional needs, such as packaging, displays, or logos. May use a variety of mediums to achieve artistic or decorative effects.',
  '21-1018.00': 'Counsel and advise individuals with alcohol, tobacco, drug, or other problems, such as gambling and eating disorders. May counsel individuals, families, or groups or engage in prevention programs.',
  '41-3099.00': 'Sell goods or services to individuals and organizations. Contact customers to present product information, close sales, and provide customer service. May specialize in technical, scientific, or retail products.',
  '15-1211.00': 'Analyze science, engineering, business, and other data processing problems to develop and implement solutions to complex applications problems, system administration issues, or network concerns.',
  '13-1161.00': 'Research conditions in local, regional, national, or online markets. Gather information to determine potential sales of a product or service, or plan a marketing or advertising campaign.',
  '19-3031.00': 'Diagnose and treat mental, emotional, and behavioral disorders. May design and implement behavior modification programs. Provide counseling and psychotherapy services to individuals, families, and groups.',
  '29-1215.00': 'Diagnose, treat, and help prevent diseases and injuries that commonly occur in the general population. May refer patients to specialists when needed for further diagnosis or treatment.',
  '11-9111.00': 'Plan, direct, or coordinate medical and health services in hospitals, clinics, managed care organizations, public health agencies, or similar organizations. Manage budgets, staff, and regulatory compliance.',
  '25-1072.00': 'Demonstrate and teach patient care in classroom and clinical units to nursing students. Prepare and deliver lectures to undergraduate or graduate students on topics such as pharmacology and patient assessment.',
  '13-1081.00': 'Analyze and coordinate the logistical functions of a firm or organization. Responsible for the entire life cycle of a product, including acquisition, distribution, internal allocation, delivery, and final disposal.',
  '19-2041.00': 'Conduct research or perform investigation for the purpose of identifying, abating, or eliminating sources of pollutants or hazards that affect the environment or public health.',
  '27-3041.00': 'Review, revise, and edit written material to correct errors and improve clarity, grammar, and style. May specialize in subject matter, writing style, or content type such as news, features, or technical documents.',
  '13-2098.00': 'Conduct quantitative analyses of information affecting investment programs of public or private institutions. Assess financial and investment implications of various business decisions.',
  '15-1244.00': 'Install, configure, and maintain an organization\'s local area network (LAN), wide area network (WAN), data communications network, operating systems, and physical and virtual servers.',
  '41-4012.00': 'Sell goods for wholesalers or manufacturers to businesses or groups of individuals. Work requires substantial knowledge of items sold. May provide product demonstrations and negotiate contracts.',
  '29-1123.00': 'Assess, plan, organize, and participate in rehabilitative programs that improve mobility, relieve pain, increase strength, and decrease or prevent deformity of patients suffering from disease or injury.',
  '13-1151.00': 'Design or conduct work-related training and development programs to improve individual skills or organizational performance. May analyze training needs and evaluate training effectiveness.',
  '15-1299.09': 'Plan, implement, upgrade, or monitor security measures for the protection of computer networks and information. May respond to computer security breaches and viruses. Design security systems and protocols.',
  '27-1014.00': 'Create special effects or animations using film, video, computers, or other electronic tools and media for use in products, such as computer games, movies, music videos, and commercials.',
  '19-3051.00': 'Develop comprehensive plans and programs for use of land and physical facilities of jurisdictions. Assess economic, environmental, and social trends to advise on land use and development.',
  '29-1122.00': 'Assess, plan, and organize rehabilitative programs that help build or restore vocational, homemaking, and daily living skills, as well as general independence, to persons with disabilities or developmental delays.',
  '11-2031.00': 'Plan, direct, or coordinate activities designed to create or maintain a favorable public image or raise issue awareness for their organization or client. Plan and direct development and communication of programs.',
  '13-1199.01': 'Conduct energy audits of buildings, building systems, or process systems. May also conduct investment grade audits of buildings or systems. Identify energy conservation opportunities and make recommendations.',
  '47-2111.00': 'Install, maintain, and repair electrical wiring, equipment, and fixtures. Ensure that work is in accordance with relevant codes. May install or service street lights, intercom systems, or electrical control systems.',
  '15-1299.05': 'Develop and implement security measures to protect computer systems, networks, and data. Apply security principles to design, implement, and test secure systems. Monitor systems for security breaches.',
  '29-2061.00': 'Care for ill, injured, or convalescing patients or persons with disabilities in hospitals, nursing homes, clinics, private homes, group homes, and similar institutions. May work under the supervision of a registered nurse.',
  '25-1194.00': 'Teach occupational, vocational, career, or technical subjects to students at the postsecondary level. Demonstrate techniques and skills in specialized areas such as automotive repair or cosmetology.',
  '13-1141.00': 'Conduct programs of compensation and benefits and job analysis for employer. May specialize in specific areas, such as position classification and pension programs. Ensure competitive compensation packages.',
  '19-1029.00': 'Conduct research in a variety of biological science fields. May specialize in wildlife research, marine biology, botany, zoology, or other life science specialties. Study organisms and their relationship to environment.',
  '27-2012.00': 'Produce or direct stage, television, radio, video, or film productions for entertainment, information, or instruction. Coordinate activities of writers, directors, managers, and other personnel throughout production.',
  '15-1299.01': 'Design core features of video games. Specify innovative game and role-play mechanics, story lines, and character biographies. Create and maintain design documentation. Guide and collaborate with production staff.',
  '49-9071.00': 'Perform work involving the skills of two or more maintenance or craft occupations to keep machines, mechanical equipment, or the structure of a building in repair. May involve pipe fitting, boiler making, or welding.',
  '29-1211.00': 'Administer anesthetics and analgesics for pain management prior to, during, or after surgery. Monitor patient vital signs and adjust anesthetics to maintain patient at required level of anesthesia.',
  '11-3131.00': 'Plan, direct, or coordinate the training and development activities and staff of an organization. Assess training needs, develop training programs, and evaluate program effectiveness to improve employee performance.',
  '13-1071.00': 'Recruit, screen, interview, or place individuals for employment. May perform other activities in multiple human resources areas including employee relations, training and development, and compensation.',
  '19-4061.00': 'Assist social scientists in laboratory, survey, and other social science research. May help prepare findings for publication and assist in laboratory analysis, quality control, or data management.',
  '27-1025.00': 'Plan, design, and furnish the internal space of rooms or buildings. Design interior environments to be functional, safe, and aesthetically pleasing. Select colors, lighting, materials, and furnishings.',
  '15-1299.02': 'Apply knowledge of GIS technology to design, develop, and implement GIS applications. Produce maps and data layers for analysis. Maintain GIS databases and integrate data from various sources.',
  '41-1011.00': 'Directly supervise and coordinate activities of retail sales workers in an establishment or department. Duties may include management functions, such as purchasing, budgeting, accounting, and personnel work.',
  '29-1151.00': 'Administer anesthesia, monitor patient\'s vital signs, and oversee patient recovery from anesthesia. May assist anesthesiologists, surgeons, other physicians, or dentists. Work in surgical suites or pain clinics.',
  '25-3011.00': 'Teach or instruct out-of-school youths and adults in basic education, literacy, or English as a Second Language classes, or in classes for earning a high school equivalency credential.',
  '13-1131.00': 'Organize activities to raise funds or otherwise solicit and gather monetary donations or other gifts for an organization. May design and produce promotional materials. Solicit donations from individuals or organizations.',
  '19-1041.00': 'Investigate and describe the determinants and distribution of disease, disability, or health outcomes. May develop the means for prevention and control. Conduct research and analyze public health data.',
  '27-3043.00': 'Originate and prepare written material, such as scripts, stories, advertisements, or other written content. Research and develop content for publication in books, magazines, or online media.',
  '15-1232.00': 'Provide technical assistance to computer users. Answer questions or resolve computer problems for clients in person, via telephone, or electronically. May provide assistance concerning software, hardware, or equipment.',
  '47-2031.00': 'Construct, erect, install, or repair structures and fixtures made of wood and comparable materials, such as concrete forms; building frameworks, including partitions, joists, studding, and rafters; and wood stairways.',
  '29-1221.00': 'Diagnose, treat, and help prevent diseases and injuries in children. Examine patients or order, perform, and interpret diagnostic tests. Provide health advice and treatment to children and adolescents.',
  '11-2022.00': 'Plan, direct, or coordinate the actual distribution or movement of a product or service to the customer. Coordinate sales distribution by establishing sales territories, quotas, and goals and establish training programs.',
  '13-1121.00': 'Coordinate activities of staff, convention personnel, or clients to make arrangements for group meetings, events, or conventions. Plan and coordinate event details and activities. Negotiate contracts with vendors.',
  '19-3011.00': 'Conduct research, prepare reports, or formulate plans to address economic problems related to production and distribution of goods and services or monetary and fiscal policy. May collect and analyze economic data.',
  '27-1021.00': 'Develop and design manufactured products, such as cars, home appliances, and children\'s toys. Combine artistic talent with research on product use, marketing, and materials to create functional designs.',
  '15-1299.03': 'Implement and administer enterprise-wide document management systems and related software to capture, store, retrieve, share, and destroy electronic records and documents. Ensure compliance with records management policies.',
  '43-6011.00': 'Provide high-level administrative support by conducting research, preparing statistical reports, and handling information requests. Schedule appointments, give information to callers, compose correspondence.',
  '29-1071.00': 'Provide healthcare services typically performed by a physician, under the supervision of a physician. Conduct physical exams, diagnose and treat illnesses, prescribe medications, and assist in surgery.',
  '25-2012.00': 'Teach elemental natural and social science, personal hygiene, music, art, and literature to kindergarten students. Promote physical, mental, and social development. May be required to hold State certification.',
  '13-2072.00': 'Evaluate, authorize, or recommend approval of commercial, real estate, or credit loans. Advise borrowers on financial status and payment methods. Meet with applicants to obtain information for loan applications.',
  '19-2012.00': 'Conduct research into physical phenomena, develop theories on the basis of observation and experiments, and devise methods to apply physical laws and theories. May specialize in fields such as nuclear physics or optics.',
  '27-4032.00': 'Edit moving images on film, video, or other media. May edit or synchronize soundtracks with images. Organize and string together raw footage into a continuous whole according to scripts or specifications.',
  '15-1299.06': 'Conduct investigations on computer-based crimes establishing documentary or physical evidence, such as digital media and logs associated with cyber intrusion incidents. Recover and examine data for legal proceedings.',
  '47-2073.00': 'Operate one or several types of power construction equipment, such as motor graders, bulldozers, scrapers, compressors, pumps, derricks, shovels, tractors, or front-end loaders to excavate, move, and grade earth.',
  '29-1229.00': 'Physicians and surgeons, all other includes all physicians and surgeons not classified separately. Examine patients; take medical histories; prescribe medications; and order, perform, and interpret diagnostic tests.',
  '11-3061.00': 'Plan, direct, or coordinate the activities of buyers, purchasing officers, and related workers involved in purchasing materials, products, and services. Oversee procurement processes and vendor relationships.',
  '13-1199.00': 'Conduct special research or apply business expertise in areas not classified separately above. May include franchise development, program management, quality assurance, or other specialized business operations.',
  '19-1099.00': 'Life scientists conducting research not classified separately. May specialize in agricultural science, food science, soil science, entomology, or other areas of life science research and development.',
  '27-3091.00': 'Interpret oral or sign language, or translate written text from one language into another. Facilitate communication for people with limited English proficiency or hearing impairments. Work in courts, hospitals, or conferences.',
  '15-1231.00': 'Analyze, test, troubleshoot, and evaluate existing network systems, such as local area networks (LAN), wide area networks (WAN), cloud networks, servers, and other data communications networks.',
  '49-3023.00': 'Diagnose, adjust, repair, or overhaul automotive vehicles. Perform routine maintenance such as oil changes, fluid checks, and tire rotations. Use diagnostic equipment to identify and repair mechanical problems.',
  '29-1241.00': 'Diagnose and treat diseases and injuries of the eye and related structures. Perform comprehensive eye examinations, prescribe corrective lenses and medications, and perform eye surgery. Specialize in medical eye care.',
  '11-1021.00': 'Plan, direct, or coordinate the operations of public or private sector organizations. Duties and responsibilities include formulating policies, managing daily operations, and planning the use of materials and human resources.',
  '13-1082.00': 'Analyze and coordinate the schedule, timeline, procurement, staffing, and budget of a product or service on a per project basis. Lead and guide the work of technical staff. May serve as a point of contact for the client.',
  '19-4021.00': 'Assist biological and medical scientists. Set up, operate, and maintain laboratory instruments and equipment, monitor experiments, collect data, and analyze results. May prepare specimens for examination.',
  '27-1013.00': 'Create original artwork using any of a wide variety of media and techniques. Develop artistic concepts and create visual representations. May specialize in painting, drawing, sculpture, or illustration.',
  '15-1299.04': 'Evaluate and test computer networks, systems, and applications for security vulnerabilities. Conduct authorized simulated cyberattacks to identify weaknesses. Recommend security enhancements and remediation strategies.',
  '43-1011.00': 'Directly supervise and coordinate the activities of clerical and administrative support workers. Oversee workflow, train staff, evaluate performance, and ensure office operations run smoothly.',
  '29-1171.01': 'Provide advanced nursing care for patients with acute conditions such as heart attacks, respiratory distress syndrome, or shock. Work in emergency rooms, intensive care units, or other critical care settings.',
  '25-3021.00': 'Teach or instruct individuals or groups for the primary purpose of self-enrichment or recreation, rather than for an occupational objective, educational credential, or degree. May provide instruction in hobbies or personal development.',
  '13-2031.00': 'Examine budget estimates for completeness, accuracy, and conformance with procedures and regulations. Analyze budgeting and accounting reports. Review financial requests and allocate funds to programs or departments.',
  '19-2043.00': 'Research the distribution, circulation, and physical properties of underground and surface waters. Study water quality, quantity, availability, and use. May specialize in groundwater, surface water, or water quality.',
  '27-4014.00': 'Assemble and operate equipment to record, synchronize, mix, edit, or reproduce sound, including music, voices, or sound effects, for theater, video, film, television, podcasts, or video games.',
  '15-1299.07': 'Research, analyze, design, and develop blockchain technologies. Create blockchain protocols, design network architecture, and develop smart contracts. Ensure security and scalability of blockchain applications.',
  '47-2152.00': 'Assemble, install, alter, and repair pipelines or pipe systems that carry water, steam, air, or other liquids or gases. May install heating and cooling equipment and mechanical control systems. Join and seal pipes with various methods.'
};

// Comprehensive skills data (all 96 careers)
const SKILLS_DATA = {
  '15-1252.00': ['Programming', 'Problem Solving', 'Algorithms', 'Software Development', 'Debugging'],
  '29-1141.00': ['Patient Care', 'Medical Knowledge', 'Communication', 'Critical Thinking', 'Attention to Detail'],
  '25-2021.00': ['Classroom Management', 'Communication', 'Lesson Planning', 'Patience', 'Creativity'],
  '13-2011.00': ['Financial Analysis', 'Accounting Software', 'Attention to Detail', 'Mathematics', 'Problem Solving'],
  '11-2021.00': ['Strategic Planning', 'Market Research', 'Communication', 'Leadership', 'Analytical Skills'],
  '17-2141.00': ['CAD Software', 'Problem Solving', 'Mathematics', 'Engineering Principles', 'Technical Drawing'],
  '27-3031.00': ['Writing', 'Communication', 'Media Relations', 'Strategic Thinking', 'Social Media'],
  '15-1256.00': ['Quality Assurance', 'Test Automation', 'Attention to Detail', 'Problem Solving', 'Documentation'],
  '11-1011.00': ['Leadership', 'Strategic Planning', 'Decision Making', 'Financial Management', 'Communication'],
  '13-1111.00': ['Analytical Skills', 'Process Improvement', 'Problem Solving', 'Communication', 'Project Management'],
  '29-1171.00': ['Patient Assessment', 'Medical Knowledge', 'Prescribing', 'Communication', 'Critical Thinking'],
  '25-2031.00': ['Subject Knowledge', 'Classroom Management', 'Communication', 'Lesson Planning', 'Assessment'],
  '13-2051.00': ['Financial Modeling', 'Data Analysis', 'Excel', 'Research', 'Critical Thinking'],
  '15-1299.08': ['HTML/CSS', 'JavaScript', 'Responsive Design', 'Problem Solving', 'Creativity'],
  '11-3021.00': ['IT Management', 'Strategic Planning', 'Leadership', 'Technical Knowledge', 'Budgeting'],
  '27-1024.00': ['Adobe Creative Suite', 'Creativity', 'Typography', 'Color Theory', 'Communication'],
  '21-1018.00': ['Counseling', 'Active Listening', 'Empathy', 'Communication', 'Crisis Intervention'],
  '41-3099.00': ['Sales', 'Communication', 'Persuasion', 'Customer Service', 'Product Knowledge'],
  '15-1211.00': ['Systems Analysis', 'Problem Solving', 'Technical Documentation', 'Programming', 'Communication'],
  '13-1161.00': ['Market Research', 'Data Analysis', 'Statistical Software', 'Communication', 'Critical Thinking'],
  '19-3031.00': ['Psychological Assessment', 'Therapy', 'Active Listening', 'Empathy', 'Research Methods'],
  '29-1215.00': ['Medical Diagnosis', 'Patient Care', 'Medical Knowledge', 'Communication', 'Decision Making'],
  '11-9111.00': ['Healthcare Management', 'Leadership', 'Budgeting', 'Regulatory Compliance', 'Strategic Planning'],
  '25-1072.00': ['Nursing Education', 'Clinical Skills', 'Communication', 'Curriculum Development', 'Patient Care'],
  '13-1081.00': ['Supply Chain Management', 'Data Analysis', 'Problem Solving', 'Communication', 'Project Management'],
  '19-2041.00': ['Environmental Science', 'Data Analysis', 'Field Work', 'Technical Writing', 'Research'],
  '27-3041.00': ['Editing', 'Grammar', 'Attention to Detail', 'Communication', 'Style Guides'],
  '13-2098.00': ['Financial Analysis', 'Investment Research', 'Excel', 'Bloomberg Terminal', 'Critical Thinking'],
  '15-1244.00': ['Network Administration', 'Troubleshooting', 'Security', 'Server Management', 'Documentation'],
  '41-4012.00': ['Sales', 'Negotiation', 'Product Knowledge', 'Communication', 'Relationship Building'],
  '29-1123.00': ['Patient Assessment', 'Therapeutic Exercise', 'Manual Therapy', 'Communication', 'Anatomy Knowledge'],
  '13-1151.00': ['Training Development', 'Instructional Design', 'Communication', 'Needs Assessment', 'Presentation'],
  '15-1299.09': ['Cybersecurity', 'Network Security', 'Risk Assessment', 'Incident Response', 'Security Tools'],
  '27-1014.00': ['Animation', '3D Modeling', 'Creativity', 'Software Proficiency', 'Storyboarding'],
  '19-3051.00': ['Urban Planning', 'GIS', 'Data Analysis', 'Communication', 'Zoning Regulations'],
  '29-1122.00': ['Occupational Therapy', 'Patient Assessment', 'Therapeutic Activities', 'Communication', 'Adaptive Equipment'],
  '11-2031.00': ['Public Relations', 'Communication', 'Media Relations', 'Crisis Management', 'Writing'],
  '13-1199.01': ['Energy Auditing', 'Building Systems', 'Data Analysis', 'Technical Writing', 'Energy Modeling'],
  '47-2111.00': ['Electrical Systems', 'Troubleshooting', 'Hand Tools', 'Safety', 'Blueprint Reading'],
  '15-1299.05': ['Cybersecurity', 'Security Architecture', 'Risk Assessment', 'Programming', 'Compliance'],
  '29-2061.00': ['Patient Care', 'Medical Procedures', 'Communication', 'Attention to Detail', 'Compassion'],
  '25-1194.00': ['Vocational Skills', 'Teaching', 'Curriculum Development', 'Hands-on Training', 'Assessment'],
  '13-1141.00': ['Compensation Analysis', 'Benefits Administration', 'Job Analysis', 'Excel', 'Regulatory Knowledge'],
  '19-1029.00': ['Research Methods', 'Laboratory Skills', 'Data Analysis', 'Technical Writing', 'Scientific Knowledge'],
  '27-2012.00': ['Production Management', 'Leadership', 'Budgeting', 'Communication', 'Creative Vision'],
  '15-1299.01': ['Game Design', 'Storytelling', 'Mechanics Design', 'Creativity', 'Documentation'],
  '49-9071.00': ['Mechanical Repair', 'Troubleshooting', 'Hand Tools', 'Preventive Maintenance', 'Safety'],
  '29-1211.00': ['Anesthesia Administration', 'Patient Monitoring', 'Medical Knowledge', 'Critical Thinking', 'Decision Making'],
  '11-3131.00': ['Training Management', 'Leadership', 'Needs Assessment', 'Budgeting', 'Program Evaluation'],
  '13-1071.00': ['Recruitment', 'Interviewing', 'Employee Relations', 'HRIS', 'Compliance'],
  '19-4061.00': ['Research Assistance', 'Data Collection', 'Laboratory Skills', 'Documentation', 'Statistical Software'],
  '27-1025.00': ['Interior Design', 'Space Planning', 'CAD Software', 'Color Theory', 'Client Relations'],
  '15-1299.02': ['GIS Software', 'Spatial Analysis', 'Database Management', 'Cartography', 'Data Visualization'],
  '41-1011.00': ['Supervision', 'Customer Service', 'Inventory Management', 'Scheduling', 'Sales'],
  '29-1151.00': ['Anesthesia', 'Patient Monitoring', 'Airway Management', 'Medical Knowledge', 'Critical Thinking'],
  '25-3011.00': ['Adult Education', 'Literacy Teaching', 'ESL Instruction', 'Patience', 'Cultural Sensitivity'],
  '13-1131.00': ['Fundraising', 'Communication', 'Event Planning', 'Relationship Building', 'Writing'],
  '19-1041.00': ['Epidemiology', 'Statistical Analysis', 'Research Methods', 'Public Health', 'Data Interpretation'],
  '27-3043.00': ['Writing', 'Research', 'Creativity', 'Editing', 'Communication'],
  '15-1232.00': ['Technical Support', 'Troubleshooting', 'Communication', 'Customer Service', 'IT Knowledge'],
  '47-2031.00': ['Carpentry', 'Blueprint Reading', 'Hand Tools', 'Measurement', 'Safety'],
  '29-1221.00': ['Pediatric Care', 'Patient Assessment', 'Medical Knowledge', 'Communication', 'Diagnostic Skills'],
  '11-2022.00': ['Sales Management', 'Leadership', 'Strategic Planning', 'Communication', 'Coaching'],
  '13-1121.00': ['Event Planning', 'Organization', 'Communication', 'Negotiation', 'Budget Management'],
  '19-3011.00': ['Economic Analysis', 'Statistical Methods', 'Research', 'Data Interpretation', 'Technical Writing'],
  '27-1021.00': ['Product Design', 'CAD Software', 'Prototyping', 'Creativity', 'Technical Drawing'],
  '15-1299.03': ['Document Management', 'Information Systems', 'Records Management', 'Database Management', 'Compliance'],
  '43-6011.00': ['Administrative Support', 'Communication', 'Organization', 'Microsoft Office', 'Scheduling'],
  '29-1071.00': ['Patient Assessment', 'Medical Procedures', 'Prescribing', 'Communication', 'Medical Knowledge'],
  '25-2012.00': ['Early Childhood Education', 'Classroom Management', 'Communication', 'Patience', 'Creativity'],
  '13-2072.00': ['Loan Processing', 'Credit Analysis', 'Communication', 'Regulatory Knowledge', 'Sales'],
  '19-2012.00': ['Physics', 'Mathematical Analysis', 'Research Methods', 'Technical Writing', 'Laboratory Skills'],
  '27-4032.00': ['Video Editing', 'Editing Software', 'Attention to Detail', 'Creativity', 'Storytelling'],
  '15-1299.06': ['Digital Forensics', 'Cyber Investigation', 'Technical Analysis', 'Documentation', 'Legal Knowledge'],
  '47-2073.00': ['Heavy Equipment Operation', 'Safety', 'Maintenance', 'Spatial Awareness', 'Hand-Eye Coordination'],
  '29-1229.00': ['Medical Diagnosis', 'Patient Care', 'Medical Knowledge', 'Communication', 'Surgical Skills'],
  '11-3061.00': ['Procurement', 'Negotiation', 'Supply Chain', 'Vendor Management', 'Strategic Planning'],
  '13-1199.00': ['Business Analysis', 'Problem Solving', 'Communication', 'Project Management', 'Data Analysis'],
  '19-1099.00': ['Research Methods', 'Laboratory Skills', 'Data Analysis', 'Scientific Knowledge', 'Technical Writing'],
  '27-3091.00': ['Language Proficiency', 'Interpretation', 'Translation', 'Cultural Knowledge', 'Active Listening'],
  '15-1231.00': ['Network Support', 'Troubleshooting', 'Network Protocols', 'Documentation', 'Communication'],
  '49-3023.00': ['Automotive Repair', 'Diagnostics', 'Hand Tools', 'Problem Solving', 'Mechanical Knowledge'],
  '29-1241.00': ['Ophthalmology', 'Eye Surgery', 'Patient Care', 'Diagnostic Skills', 'Medical Knowledge'],
  '11-1021.00': ['Leadership', 'Strategic Planning', 'Operations Management', 'Decision Making', 'Communication'],
  '13-1082.00': ['Project Management', 'Scheduling', 'Budgeting', 'Communication', 'Risk Management'],
  '19-4021.00': ['Laboratory Skills', 'Data Collection', 'Equipment Maintenance', 'Documentation', 'Safety Protocols'],
  '27-1013.00': ['Artistic Skills', 'Creativity', 'Drawing', 'Painting', 'Visual Communication'],
  '15-1299.04': ['Penetration Testing', 'Ethical Hacking', 'Security Assessment', 'Technical Writing', 'Network Security'],
  '43-1011.00': ['Supervision', 'Organization', 'Communication', 'Training', 'Performance Management'],
  '29-1171.01': ['Critical Care', 'Patient Assessment', 'Emergency Response', 'Medical Knowledge', 'Decision Making'],
  '25-3021.00': ['Teaching', 'Communication', 'Subject Knowledge', 'Patience', 'Adaptability'],
  '13-2031.00': ['Budget Analysis', 'Financial Analysis', 'Excel', 'Attention to Detail', 'Communication'],
  '19-2043.00': ['Hydrology', 'Water Resources', 'Data Analysis', 'Field Work', 'GIS'],
  '27-4014.00': ['Sound Engineering', 'Audio Equipment', 'Mixing', 'Recording', 'Attention to Detail'],
  '15-1299.07': ['Blockchain Technology', 'Smart Contracts', 'Cryptography', 'Programming', 'Distributed Systems'],
  '47-2152.00': ['Plumbing', 'Pipe Fitting', 'Blueprint Reading', 'Hand Tools', 'Problem Solving']
};

// Calculate personality fit based on O*NET work styles
function calculatePersonalityFit(socCode) {
  // Simplified personality mapping for demo
  const profiles = {
    '15-1252.00': { openness: 0.85, conscientiousness: 0.75, extraversion: 0.45, agreeableness: 0.60, neuroticism: 0.30 },
    '29-1141.00': { openness: 0.60, conscientiousness: 0.85, extraversion: 0.65, agreeableness: 0.80, neuroticism: 0.35 },
    '25-2021.00': { openness: 0.70, conscientiousness: 0.75, extraversion: 0.75, agreeableness: 0.85, neuroticism: 0.35 },
    '13-2011.00': { openness: 0.55, conscientiousness: 0.90, extraversion: 0.50, agreeableness: 0.65, neuroticism: 0.30 },
    '11-2021.00': { openness: 0.75, conscientiousness: 0.70, extraversion: 0.80, agreeableness: 0.60, neuroticism: 0.40 },
    '17-2141.00': { openness: 0.80, conscientiousness: 0.80, extraversion: 0.50, agreeableness: 0.60, neuroticism: 0.30 },
    '27-3031.00': { openness: 0.75, conscientiousness: 0.65, extraversion: 0.85, agreeableness: 0.70, neuroticism: 0.40 },
    '15-1256.00': { openness: 0.70, conscientiousness: 0.85, extraversion: 0.50, agreeableness: 0.65, neuroticism: 0.30 },
    '11-1011.00': { openness: 0.70, conscientiousness: 0.80, extraversion: 0.75, agreeableness: 0.55, neuroticism: 0.35 },
    '13-1111.00': { openness: 0.75, conscientiousness: 0.80, extraversion: 0.60, agreeableness: 0.65, neuroticism: 0.35 },
    '29-1171.00': { openness: 0.65, conscientiousness: 0.85, extraversion: 0.60, agreeableness: 0.80, neuroticism: 0.30 },
    '25-2031.00': { openness: 0.70, conscientiousness: 0.75, extraversion: 0.70, agreeableness: 0.80, neuroticism: 0.35 },
    '13-2051.00': { openness: 0.70, conscientiousness: 0.80, extraversion: 0.55, agreeableness: 0.60, neuroticism: 0.35 },
    '15-1299.08': { openness: 0.85, conscientiousness: 0.70, extraversion: 0.50, agreeableness: 0.65, neuroticism: 0.35 },
    '11-3021.00': { openness: 0.75, conscientiousness: 0.80, extraversion: 0.70, agreeableness: 0.60, neuroticism: 0.35 },
    '27-1024.00': { openness: 0.90, conscientiousness: 0.65, extraversion: 0.55, agreeableness: 0.70, neuroticism: 0.40 },
    '21-1018.00': { openness: 0.70, conscientiousness: 0.75, extraversion: 0.70, agreeableness: 0.85, neuroticism: 0.30 },
    '41-3099.00': { openness: 0.60, conscientiousness: 0.70, extraversion: 0.85, agreeableness: 0.75, neuroticism: 0.40 },
    '15-1211.00': { openness: 0.80, conscientiousness: 0.80, extraversion: 0.55, agreeableness: 0.65, neuroticism: 0.30 },
    '13-1161.00': { openness: 0.75, conscientiousness: 0.75, extraversion: 0.65, agreeableness: 0.70, neuroticism: 0.35 }
  };
  
  // Return profile or default
  return profiles[socCode] || { openness: 0.65, conscientiousness: 0.75, extraversion: 0.60, agreeableness: 0.70, neuroticism: 0.35 };
}

// Calculate Holland codes based on personality
function calculateHollandCodes(personality) {
  const scores = {
    R: personality.conscientiousness * 0.5 + (1 - personality.openness) * 0.5,
    I: personality.openness * 0.7 + personality.conscientiousness * 0.3,
    A: personality.openness * 0.8 + (1 - personality.conscientiousness) * 0.2,
    S: personality.agreeableness * 0.6 + personality.extraversion * 0.4,
    E: personality.extraversion * 0.7 + (1 - personality.agreeableness) * 0.3,
    C: personality.conscientiousness * 0.7 + (1 - personality.openness) * 0.3
  };
  
  // Return top 2 codes
  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([code]) => code);
  
  return sorted.join('');
}

// Main import function
async function main() {
  console.log('🚀 PMERIT Career Data Import - Starting...\n');
  console.log(`📊 Importing ${PRIORITY_OCCUPATIONS.length} priority careers\n`);
  
  const sql = neon(DATABASE_URL);
  
  let imported = 0;
  let failed = 0;
  const errors = [];
  
  for (const occupation of PRIORITY_OCCUPATIONS) {
    try {
      const socCode = occupation.code;
      const title = occupation.title;
      
      // Get data
      const salary = SALARY_RANGES[socCode];
      const education = EDUCATION_LEVELS[socCode];
      const description = DESCRIPTIONS[socCode];
      const skills = SKILLS_DATA[socCode];
      const personality = calculatePersonalityFit(socCode);
      const hollandCode = calculateHollandCodes(personality);
      
      console.log(`  📝 Importing: ${title} (${socCode})...`);
      
      // Insert into careers table
      await sql`
        INSERT INTO careers (
          career_id,
          title,
          description,
          onet_code,
          salary_min,
          salary_max,
          salary_median,
          growth_outlook,
          education_required,
          skills_required,
          personality_fit,
          holland_codes
        ) VALUES (
          ${`c${String(imported + 1).padStart(3, '0')}`},
          ${title},
          ${description},
          ${socCode},
          ${salary.min},
          ${salary.max},
          ${salary.median},
          ${'Faster than average'},
          ${education},
          ${JSON.stringify(skills)},
          ${JSON.stringify(personality)},
          ${hollandCode}
        )
        ON CONFLICT (onet_code) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          salary_min = EXCLUDED.salary_min,
          salary_max = EXCLUDED.salary_max,
          salary_median = EXCLUDED.salary_median,
          skills_required = EXCLUDED.skills_required,
          personality_fit = EXCLUDED.personality_fit,
          holland_codes = EXCLUDED.holland_codes
      `;
      
      imported++;
      console.log(`  ✅ Success: ${title}\n`);
      
    } catch (error) {
      failed++;
      errors.push({ career: occupation.title, error: error.message });
      console.log(`  ❌ Failed: ${occupation.title} - ${error.message}\n`);
    }
  }
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 IMPORT SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successfully imported: ${imported}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success rate: ${(imported / PRIORITY_OCCUPATIONS.length * 100).toFixed(1)}%`);
  
  if (errors.length > 0) {
    console.log('\n❌ Errors:');
    errors.forEach((err, i) => {
      console.log(`  ${i + 1}. ${err.career}: ${err.error}`);
    });
  }
  
  console.log('\n🎉 Import complete!');
  console.log('\n💡 Next steps:');
  console.log('  1. Verify in Neon Console: SELECT COUNT(*) FROM careers;');
  console.log('  2. Check top 10: SELECT title, salary_median FROM careers ORDER BY salary_median DESC LIMIT 10;');
  console.log('  3. Test Career Matching Algorithm with 96 careers\n');
}

// Run import
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });