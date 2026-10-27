// Helper to generate 25 questions per skill spanning 4 difficulty levels
export const generateQuestionBankForSkill = (skill, courseDoc) => {
  const questions = [];
  const cId = courseDoc?._id;
  const sName = skill.name || courseDoc?.title || 'Skill Assessment';
  const sSlug = skill.slug || courseDoc?.slug || 'skill';
  const dTitle = skill.degreeTitle || courseDoc?.category || 'Degree Track';
  const fName = skill.fieldName || courseDoc?.category || 'Specialization';

  // 1. Easy Questions (5)
  for (let i = 1; i <= 5; i++) {
    questions.push({
      courseId: cId,
      course: dTitle,
      field: fName,
      specialization: fName,
      skill: sName,
      slug: sSlug,
      module: `${sName} Fundamentals`,
      question: `[Easy Q${i}] What is the primary foundational concept of ${sName} in ${fName}?`,
      options: [
        `Core principles and standard conventions of ${sName}`,
        `Unrelated legacy hardware protocols`,
        `Outdated manual calculation procedures`,
        `Non-standard experimental techniques`
      ],
      correctAnswer: 0,
      type: 'single',
      difficulty: 'easy',
      marks: 2,
      explanation: `${sName} is built upon core principles and standard conventions within ${fName}.`
    });
  }

  // 2. Medium Questions (8)
  for (let i = 1; i <= 8; i++) {
    questions.push({
      courseId: cId,
      course: dTitle,
      field: fName,
      specialization: fName,
      skill: sName,
      slug: sSlug,
      module: `${sName} Applications`,
      question: `[Medium Q${i}] In practical ${sName} workflows, how is key requirement #${i} typically managed?`,
      options: [
        `By applying systematic modular design and verified industry patterns`,
        `By completely disabling security protocols and error handling`,
        `By ignoring standard validation and documentation`,
        `By forcing single-threaded synchronous blocking calls`
      ],
      correctAnswer: 0,
      type: 'single',
      difficulty: 'medium',
      marks: 2,
      explanation: `Systematic modular design ensures scalability, robustness, and maintainability in ${sName}.`
    });
  }

  // 3. Hard Questions (7)
  for (let i = 1; i <= 7; i++) {
    questions.push({
      courseId: cId,
      course: dTitle,
      field: fName,
      specialization: fName,
      skill: sName,
      slug: sSlug,
      module: `${sName} Advanced Systems`,
      question: `[Hard Q${i}] When optimizing ${sName} performance under heavy workload scenario #${i}, which strategy yields maximum throughput?`,
      options: [
        `Optimizing resource allocation, caching, and algorithmic complexity`,
        `Increasing arbitrary timeouts without measuring execution metrics`,
        `Bypassing memory safety and data validation layers`,
        `Executing unindexed linear scans over large datasets`
      ],
      correctAnswer: 0,
      type: 'single',
      difficulty: 'hard',
      marks: 2,
      explanation: `Optimizing resource allocation and algorithmic efficiency is essential for high performance in ${sName}.`
    });
  }

  // 4. Very Hard Questions (5)
  for (let i = 1; i <= 5; i++) {
    questions.push({
      courseId: cId,
      course: dTitle,
      field: fName,
      specialization: fName,
      skill: sName,
      slug: sSlug,
      module: `${sName} Architecture & Edge Cases`,
      question: `[Very Hard Q${i}] Consider a complex distributed/enterprise edge-case in ${sName}. What is the root cause of subtle failure pattern #${i}?`,
      options: [
        `Race conditions, subtle state mutations, or non-atomic concurrency bottlenecks`,
        `Standard default configuration settings`,
        `Excessive automated test coverage`,
        `Using static typing instead of dynamic typing`
      ],
      correctAnswer: 0,
      type: 'single',
      difficulty: 'very-hard',
      marks: 2,
      explanation: `Deep diagnostic issues in ${sName} stem from subtle concurrency bottlenecks, state mutations, or race conditions.`
    });
  }

  return questions;
};
