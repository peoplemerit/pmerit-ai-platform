/**
 * Assessment API Example Usage
 * Demonstrates the complete workflow using all 5 endpoints
 * 
 * @example Run with: node example-usage.js
 */

// Configuration
const API_BASE_URL = 'http://localhost:8788/api/v1/assessment'; // Adjust for your environment

/**
 * Generate mock 120 answers for testing
 */
function generateMockAnswers() {
  const answers = {};
  const traits = ['O', 'C', 'E', 'A', 'N'];
  
  for (const trait of traits) {
    for (let facet = 1; facet <= 6; facet++) {
      for (let q = 1; q <= 4; q++) {
        const questionId = `${trait}${facet}_${q}`;
        // Random answer between 1-5
        answers[questionId] = Math.floor(Math.random() * 5) + 1;
      }
    }
  }
  
  return answers;
}

/**
 * Example 1: Complete Assessment Flow
 */
async function completeAssessmentFlow() {
  console.log('=== Example 1: Complete Assessment Flow ===\n');
  
  try {
    // Step 1: Start assessment
    console.log('Step 1: Starting assessment...');
    const startResponse = await fetch(`${API_BASE_URL}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: null, // Anonymous user
        consent: {
          privacy: true,
          data: true,
          terms: true
        }
      })
    });
    
    const startData = await startResponse.json();
    console.log('✓ Session created:', startData.sessionId);
    console.log();
    
    const sessionId = startData.sessionId;
    const answers = {};
    
    // Step 2: Answer questions with auto-save
    console.log('Step 2: Answering questions with auto-save...');
    const allAnswers = generateMockAnswers();
    const questionIds = Object.keys(allAnswers);
    
    for (let i = 0; i < questionIds.length; i++) {
      const qId = questionIds[i];
      answers[qId] = allAnswers[qId];
      
      // Auto-save every 20 questions
      if ((i + 1) % 20 === 0) {
        const saveResponse = await fetch(`${API_BASE_URL}/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            currentQuestion: i + 1,
            answers
          })
        });
        
        const saveData = await saveResponse.json();
        console.log(`✓ Progress saved at question ${i + 1}: ${saveData.answerCount} answers`);
      }
    }
    console.log();
    
    // Step 3: Submit assessment
    console.log('Step 3: Submitting completed assessment...');
    const submitResponse = await fetch(`${API_BASE_URL}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        answers
      })
    });
    
    const submitData = await submitResponse.json();
    console.log('✓ Assessment submitted:', submitData.resultId);
    console.log('  Completed at:', submitData.completedAt);
    console.log();
    
    // Step 4: Get results
    console.log('Step 4: Retrieving results...');
    const resultsResponse = await fetch(`${API_BASE_URL}/results/${submitData.resultId}`);
    const resultsData = await resultsResponse.json();
    
    console.log('✓ Results retrieved');
    console.log('  Holland Code:', resultsData.result.hollandCode);
    console.log('  Big Five Scores:');
    console.log('    - Openness:', resultsData.result.bigFive.openness.label, 
                `(${resultsData.result.bigFive.openness.percentile}th percentile)`);
    console.log('    - Conscientiousness:', resultsData.result.bigFive.conscientiousness.label,
                `(${resultsData.result.bigFive.conscientiousness.percentile}th percentile)`);
    console.log('    - Extraversion:', resultsData.result.bigFive.extraversion.label,
                `(${resultsData.result.bigFive.extraversion.percentile}th percentile)`);
    console.log('  Top Career Match:', resultsData.result.careerMatches[0].title,
                `(Fit: ${resultsData.result.careerMatches[0].fit_score}%)`);
    console.log();
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

/**
 * Example 2: Resume Incomplete Assessment
 */
async function resumeAssessmentFlow() {
  console.log('=== Example 2: Resume Incomplete Assessment ===\n');
  
  try {
    // Start assessment
    console.log('Step 1: Starting assessment...');
    const startResponse = await fetch(`${API_BASE_URL}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: null,
        consent: { privacy: true, data: true, terms: true }
      })
    });
    
    const { sessionId } = await startResponse.json();
    console.log('✓ Session created:', sessionId);
    console.log();
    
    // Answer partial questions and save
    console.log('Step 2: Answering partial questions...');
    const partialAnswers = {};
    for (let i = 1; i <= 30; i++) {
      const qId = `O${Math.ceil(i / 4)}_${((i - 1) % 4) + 1}`;
      partialAnswers[qId] = Math.floor(Math.random() * 5) + 1;
    }
    
    await fetch(`${API_BASE_URL}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        currentQuestion: 30,
        answers: partialAnswers
      })
    });
    console.log('✓ Saved 30 answers');
    console.log();
    
    // Simulate user leaving and coming back
    console.log('Step 3: User leaves and returns later...');
    console.log('Step 4: Resuming assessment...');
    
    const resumeResponse = await fetch(`${API_BASE_URL}/resume/${sessionId}`);
    const resumeData = await resumeResponse.json();
    
    console.log('✓ Assessment resumed');
    console.log('  Current question:', resumeData.session.currentQuestion);
    console.log('  Saved answers:', Object.keys(resumeData.session.answers).length);
    console.log('  Can resume:', resumeData.session.canResume);
    console.log();
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

/**
 * Example 3: Error Handling
 */
async function errorHandlingExamples() {
  console.log('=== Example 3: Error Handling ===\n');
  
  try {
    // Try to resume non-existent session
    console.log('Test 1: Resume non-existent session');
    const response1 = await fetch(`${API_BASE_URL}/resume/invalid-session-id`);
    const data1 = await response1.json();
    console.log('✓ Expected error:', data1.error);
    console.log();
    
    // Try to get non-existent results
    console.log('Test 2: Get non-existent results');
    const response2 = await fetch(`${API_BASE_URL}/results/invalid-result-id`);
    const data2 = await response2.json();
    console.log('✓ Expected error:', data2.error);
    console.log();
    
    // Try to submit with missing consent
    console.log('Test 3: Start without consent');
    const response3 = await fetch(`${API_BASE_URL}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: null,
        consent: { privacy: true } // Missing data and terms
      })
    });
    const data3 = await response3.json();
    console.log('✓ Expected error:', data3.error);
    console.log();
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

/**
 * Run all examples
 */
async function runExamples() {
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║  Assessment API - Example Usage                      ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');
  
  await completeAssessmentFlow();
  console.log('\n' + '─'.repeat(56) + '\n');
  
  await resumeAssessmentFlow();
  console.log('\n' + '─'.repeat(56) + '\n');
  
  await errorHandlingExamples();
  
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║  Examples Complete                                   ║');
  console.log('╚══════════════════════════════════════════════════════╝');
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runExamples().catch(console.error);
}

export default {
  completeAssessmentFlow,
  resumeAssessmentFlow,
  errorHandlingExamples
};
