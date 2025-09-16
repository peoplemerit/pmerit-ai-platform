// State management
const state = {
  auth: false,
  dark: false,
  vh: false,
  support: false,
  tts: false,
  lang: 'en'
};

// Career tracks data
const TRACKS = [
  {k:'fullstack', name:'Software Development (Full-stack)', blurb:'Front-end + back-end foundations with project practice.'},
  {k:'data', name:'Data Analytics', blurb:'Spreadsheets → SQL → dashboards for real insights.'},
  {k:'uiux', name:'UI/UX Design', blurb:'Design thinking, wireframes, prototypes, usability.'},
  {k:'marketing', name:'Digital Marketing', blurb:'SEO, content, ads, analytics for growth.'},
  {k:'support', name:'Customer Support (Remote)', blurb:'Ticketing, empathy, SLAs, tooling.'},
  {k:'va', name:'Virtual Assistance / Operations', blurb:'Scheduling, docs, communication, tooling.'},
  {k:'cloud', name:'Cloud & DevOps (Intro)', blurb:'Cloud basics, CI/CD, containers overview.'},
];

// Rotating tips for insights
const tips = [
  "Pro tip: Keep notes in your own words for better recall.",
  "Short, frequent study sessions are more effective than long cramming sessions.",
  "Relate new concepts to things you already understand for better retention.",
  "Teach what you've learned to someone else to solidify your understanding.",
  "Take breaks during study sessions to improve focus and retention."
];
