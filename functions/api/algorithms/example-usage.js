/**
 * Example Usage of Career Matching Algorithm
 * Demonstrates how to use the CareerMatchingService
 */

import CareerMatchingService from '../services/CareerMatchingService.js';

/**
 * Example: Get career recommendations for a user
 * This would typically be called from the /assessment/submit endpoint
 */
async function exampleUsage(env) {
  console.log('=== Career Matching Algorithm Example ===\n');

  // Sample assessment results from a completed personality test
  const assessmentResults = {
    bigFive: {
      openness: {
        raw: 4.2,
        percentile: 85,
        label: 'Very High'
      },
      conscientiousness: {
        raw: 3.8,
        percentile: 70,
        label: 'High'
      },
      extraversion: {
        raw: 2.9,
        percentile: 45,
        label: 'Moderate'
      },
      agreeableness: {
        raw: 3.5,
        percentile: 60,
        label: 'High'
      },
      neuroticism: {
        raw: 2.2,
        percentile: 30,
        label: 'Low'
      }
    },
    hollandCode: 'IAE' // Investigative, Artistic, Enterprising
  };

  try {
    // Initialize the service with database connection
    const service = new CareerMatchingService(env.DB);

    // Get top 10 career recommendations
    const startTime = Date.now();
    const recommendations = await service.getRecommendations(assessmentResults, 10);
    const duration = Date.now() - startTime;

    // Display results
    console.log(`✓ Generated ${recommendations.length} recommendations in ${duration}ms\n`);

    recommendations.forEach((rec) => {
      console.log(`${rec.rank}. ${rec.title}`);
      console.log(`   Fit Score: ${rec.fit_score}/100`);
      console.log(`   Rationale: ${rec.rationale}`);
      if (rec.salary?.median) {
        console.log(`   Salary: $${rec.salary.median.toLocaleString()}/year`);
      }
      if (rec.growth_outlook) {
        console.log(`   Outlook: ${rec.growth_outlook}`);
      }
      console.log(`   Holland Code: ${rec.holland_codes}`);
      console.log('');
    });

    // Show service health
    const health = await service.getHealthStatus();
    console.log('Service Health:', health.status);
    console.log('Cache Size:', health.cache.size, 'entries');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

/**
 * Example: Integration with Assessment API
 */
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json();

    // Validate input
    if (!data.bigFive || !data.hollandCode) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required assessment data'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get career recommendations
    const service = new CareerMatchingService(env.DB);
    const recommendations = await service.getRecommendations(data, 10);

    // Return formatted response
    return new Response(JSON.stringify({
      success: true,
      data: {
        recommendations,
        count: recommendations.length,
        generated_at: new Date().toISOString()
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[Career Matching API] Error:', error);

    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Export example function
export { exampleUsage };
