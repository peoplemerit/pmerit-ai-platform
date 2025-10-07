const fs = require('fs');
const path = require('path');

module.exports = async ({github, context}) => {
  console.log('🚀 Starting Copilot Frontend Audit...');
  
  // Get changed files
  let files = [];
  if (context.payload.pull_request) {
    const result = await github.rest.pulls.listFiles({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: context.payload.pull_request.number
    });
    files = result.data;
  } else {
    // For push events, get commit files
    const result = await github.rest.repos.getCommit({
      owner: context.repo.owner,
      repo: context.repo.repo,
      ref: context.sha
    });
    files = result.data.files || [];
  }

  const auditResults = [];
  
  for (const file of files) {
    if (file.filename.match(/\.(html|css|js)$/) && file.filename.includes('src/')) {
      console.log(`🔍 Auditing file: ${file.filename}`);
      const audit = await auditFile(file);
      auditResults.push(audit);
    }
  }
  
  // Create summary comment
  await createAuditSummary(github, context, auditResults);
};

async function auditFile(file) {
  const filePath = file.filename;
  let content = '';
  
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return {
      filename: file.filename,
      status: 'error',
      message: 'Could not read file content'
    };
  }

  const tasks = [
    {
      label: "🎨 BRAND_COMPLIANCE_CHECK",
      status: await checkBrandCompliance(content),
      details: "Pmerit brand colors and typography"
    },
    {
      label: "📱 RESPONSIVE_DESIGN_AUDIT",
      status: await checkResponsiveDesign(content, file.filename),
      details: "Mobile-first and responsive requirements"
    },
    {
      label: "⚡ PERFORMANCE_REVIEW",
      status: await checkPerformance(content),
      details: "Loading and rendering performance"
    },
    {
      label: "♿ ACCESSIBILITY_CHECK",
      status: await checkAccessibility(content),
      details: "WCAG compliance and accessibility"
    },
    {
      label: "🔄 ORIENTATION_HANDLING",
      status: await checkOrientationHandling(content, file.filename),
      details: "Mobile orientation support"
    },
    {
      label: "🧩 COMPONENT_STRUCTURE",
      status: await checkComponentStructure(content, file.filename),
      details: "Modular component architecture"
    }
  ];

  return {
    filename: file.filename,
    tasks: tasks
  };
}

async function checkBrandCompliance(content) {
  const brandChecks = [
    content.includes('--pmerit-primary') || content.includes('pmerit'),
    content.includes('@font-face') || content.includes('font-family'),
    !content.includes('#000000') && !content.includes('#FFFFFF') // Should use variables, not hardcoded
  ];
  
  return brandChecks.filter(Boolean).length >= 2 ? '✅' : '⚠️';
}

async function checkResponsiveDesign(content, filename) {
  const responsiveChecks = [
    content.includes('@media'),
    content.includes('mobile') || content.includes('desktop'),
    filename.includes('mobile') ? content.includes('orientation') : true
  ];
  
  return responsiveChecks.every(check => check) ? '✅' : '⚠️';
}

async function checkPerformance(content) {
  const performanceChecks = [
    !content.includes('document.write'),
    !content.includes('@import'),
    content.length < 10000 // Reasonable file size
  ];
  
  return performanceChecks.every(check => check) ? '✅' : '⚠️';
}

async function checkAccessibility(content) {
  const accessibilityChecks = [
    content.includes('alt=') || content.includes('aria-') || !content.includes('<img'),
    content.includes('tabindex') || content.includes('button') || !filename.includes('.html')
  ];
  
  return accessibilityChecks.every(check => check) ? '✅' : '⚠️';
}

async function checkOrientationHandling(content, filename) {
  if (filename.includes('mobile')) {
    return content.includes('orientation') ? '✅' : '⚠️';
  }
  return '✅';
}

async function checkComponentStructure(content, filename) {
  const structureChecks = [
    !content.includes('<!DOCTYPE html>') || filename.includes('pages/'), // No doctype in components
    content.length > 0,
    filename.match(/\.(html|css|js)$/) // Valid extension
  ];
  
  return structureChecks.every(check => check) ? '✅' : '⚠️';
}

async function createAuditSummary(github, context, auditResults) {
  if (auditResults.length === 0) {
    console.log('No frontend files to audit.');
    return;
  }

  let commentBody = `## 🤖 COPILOT FRONTEND AUDIT REPORT\n\n`;
  commentBody += `**Audit performed for:** ${new Date().toISOString()}\n\n`;
  
  let totalTasks = 0;
  let passedTasks = 0;

  for (const result of auditResults) {
    commentBody += `### 📄 ${result.filename}\n`;
    
    for (const task of result.tasks) {
      totalTasks++;
      if (task.status === '✅') passedTasks++;
      
      commentBody += `${task.status} **${task.label}** - ${task.details}\n`;
    }
    commentBody += '\n';
  }

  const successRate = Math.round((passedTasks / totalTasks) * 100);
  commentBody += `### 📊 SUMMARY\n`;
  commentBody += `**Success Rate:** ${successRate}% (${passedTasks}/${totalTasks} tasks passed)\n\n`;
  
  if (successRate < 80) {
    commentBody += `🚨 **ACTION REQUIRED:** Significant issues detected. Please review failed tasks.\n`;
  } else if (successRate < 95) {
    commentBody += `⚠️ **REVIEW RECOMMENDED:** Some issues need attention.\n`;
  } else {
    commentBody += `🎉 **EXCELLENT:** Most checks passed successfully!\n`;
  }

  // Post comment to PR or commit
  if (context.payload.pull_request) {
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.payload.pull_request.number,
      body: commentBody
    });
  } else {
    // For push events, create a commit comment
    await github.rest.repos.createCommitComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      commit_sha: context.sha,
      body: commentBody
    });
  }

  console.log(`📊 Audit complete: ${passedTasks}/${totalTasks} tasks passed (${successRate}%)`);
}
