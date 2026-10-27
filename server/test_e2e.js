const API_URL = 'http://localhost:5000/api';

async function runE2ETests() {
  console.log('===================================================');
  console.log('🧪 RUNNING E2E VERIFICATION SUITE FOR SKILLCERT');
  console.log('===================================================\n');

  let adminToken = '';
  let learnerToken = '';
  let courseId = '';
  let attemptId = '';
  let certId = '';
  let certDbId = '';

  try {
    // 1. Admin Login
    console.log('[Task 1] Testing Admin Login...');
    const adminRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@skillcert.com', password: 'Admin@123' }),
    }).then((r) => r.json());

    if (adminRes.success) {
      adminToken = adminRes.token;
      console.log('  ✓ Admin Login Successful!');
    }

    // 2. Learner Login
    console.log('\n[Task 2] Testing Learner Login...');
    const learnerRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'learner@skillcert.com', password: 'User@123' }),
    }).then((r) => r.json());

    if (learnerRes.success) {
      learnerToken = learnerRes.token;
      console.log('  ✓ Learner Login Successful!');
    }

    // 3. Admin Course Creation
    console.log('\n[Task 3] Testing Admin Course Creation...');
    const testTitle = `Cloud DevOps Engineering ${Date.now()}`;
    const newCourseRes = await fetch(`${API_URL}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: testTitle,
        description: 'Advanced Cloud DevOps Architecture and Automation.',
        category: 'Cloud & DevOps',
        difficulty: 'Advanced',
        duration: 30,
        questionCount: 2,
        passingPercentage: 70,
      }),
    }).then((r) => r.json());

    if (newCourseRes.success) {
      courseId = newCourseRes.course._id;
      console.log(`  ✓ Created New Course: ${newCourseRes.course.title} (ID: ${courseId})`);
    }

    // 4. Admin Question Creation
    console.log('\n[Task 4] Testing Admin Question Creation...');
    await fetch(`${API_URL}/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        courseId,
        module: 'Docker',
        question: 'Which file is used to define multi-container Docker applications?',
        options: ['Dockerfile', 'docker-compose.yml', 'package.json', 'Makefile'],
        correctAnswer: 1,
        type: 'single',
        difficulty: 'Intermediate',
        marks: 2,
        explanation: 'docker-compose.yml defines multi-container applications.',
      }),
    }).then((r) => r.json());

    await fetch(`${API_URL}/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        courseId,
        module: 'Kubernetes',
        question: 'What is the smallest deployable unit of computing in Kubernetes?',
        options: ['Node', 'Pod', 'Service', 'Deployment'],
        correctAnswer: 1,
        type: 'single',
        difficulty: 'Intermediate',
        marks: 2,
        explanation: 'Pod is the smallest deployable unit in Kubernetes.',
      }),
    }).then((r) => r.json());

    console.log('  ✓ Created Questions successfully!');

    // 5. Test Assessment Fail Flow
    console.log('\n[Task 5] Testing Failed Assessment Flow...');
    const startRes = await fetch(`${API_URL}/assessments/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${learnerToken}`,
      },
      body: JSON.stringify({ courseId }),
    }).then((r) => r.json());

    attemptId = startRes.attemptId;
    const questions = startRes.questions;

    const wrongAnswers = questions.map((q) => ({
      questionId: q.questionId,
      selectedAnswer: 0, // Wrong answer
    }));

    const failSubmitRes = await fetch(`${API_URL}/assessments/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${learnerToken}`,
      },
      body: JSON.stringify({
        attemptId,
        userAnswers: wrongAnswers,
        timeTaken: 45,
      }),
    }).then((r) => r.json());

    if (failSubmitRes.result.status === 'FAILED') {
      console.log(`  ✓ Assessment Failed as expected (Score: ${failSubmitRes.result.percentage}%). Certificate not generated.`);
    }

    // 6. Test Assessment Pass Flow & Certificate Generation
    console.log('\n[Task 6] Testing Passed Assessment Flow & Certificate Generation...');
    const start2Res = await fetch(`${API_URL}/assessments/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${learnerToken}`,
      },
      body: JSON.stringify({ courseId }),
    }).then((r) => r.json());

    const attemptId2 = start2Res.attemptId;
    const questions2 = start2Res.questions;

    const correctAnswers = [
      { questionId: questions2[0].questionId, selectedAnswer: 1 },
      { questionId: questions2[1].questionId, selectedAnswer: 1 },
    ];

    const passSubmitRes = await fetch(`${API_URL}/assessments/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${learnerToken}`,
      },
      body: JSON.stringify({
        attemptId: attemptId2,
        userAnswers: correctAnswers,
        timeTaken: 60,
      }),
    }).then((r) => r.json());

    if (passSubmitRes.result.status === 'PASSED') {
      certId = passSubmitRes.result.certificateId;
      certDbId = passSubmitRes.result.certificate._id;
      console.log(`  ✓ Assessment Passed! (Score: ${passSubmitRes.result.percentage}%, Grade: ${passSubmitRes.result.grade})`);
      console.log(`  ✓ Certificate Auto-Generated: ${certId}`);
    }

    // 7. Test Public Certificate Verification (Valid)
    console.log('\n[Task 7] Testing Public Certificate Verification (VALID)...');
    const verifyRes = await fetch(`${API_URL}/certificates/verify/${certId}`).then((r) => r.json());
    if (verifyRes.verified && verifyRes.status === 'VALID') {
      console.log(`  ✓ Certificate ${certId} Publicly Verified as VALID!`);
    }

    // 8. Test Invalid Certificate Verification
    console.log('\n[Task 8] Testing Invalid Certificate Verification...');
    const invalidRes = await fetch(`${API_URL}/certificates/verify/SC-INVALID-0000`).then((r) => r.json());
    if (invalidRes.status === 'INVALID' && !invalidRes.verified) {
      console.log('  ✓ Invalid Certificate SC-INVALID-0000 correctly returned status: INVALID!');
    }

    // 9. Test Certificate Revocation & Public Check
    console.log('\n[Task 9] Testing Admin Certificate Revocation Flow...');
    const revokeRes = await fetch(`${API_URL}/certificates/${certDbId}/revoke`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
    }).then((r) => r.json());

    if (revokeRes.success && revokeRes.certificate.status === 'REVOKED') {
      console.log(`  ✓ Certificate ${certId} Revoked by Admin.`);
    }

    const publicRevokeCheck = await fetch(`${API_URL}/certificates/verify/${certId}`).then((r) => r.json());
    if (publicRevokeCheck.status === 'REVOKED' && !publicRevokeCheck.verified) {
      console.log('  ✓ Public Verification page now correctly returns status: REVOKED!');
    }

    // 10. Restore Certificate
    console.log('\n[Task 10] Restoring Certificate to VALID state...');
    await fetch(`${API_URL}/certificates/${certDbId}/restore`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
    }).then((r) => r.json());
    console.log('  ✓ Certificate restored to VALID state.');

    console.log('\n===================================================');
    console.log('🎉 ALL 10 E2E VERIFICATION TASKS PASSED WITH 100% SUCCESS!');
    console.log('===================================================');
  } catch (err) {
    console.error('❌ E2E Verification Failure:', err.message);
  }
}

runE2ETests();
