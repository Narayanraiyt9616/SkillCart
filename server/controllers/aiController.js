import { GoogleGenerativeAI } from '@google/generative-ai';

// System prompt tailored for SkillCert platform
const SKILLCERT_SYSTEM_INSTRUCTION = `You are SkillCert AI, an intelligent educational mentor, exam coach, and technical guide for the SkillCert platform.

About SkillCert Platform:
- SkillCert is a premier online skill certification platform offering industry-aligned certifications for students and professionals across Engineering (B.Tech), BCA, B.Sc, B.Com, BBA, Data Science, and Design.
- Key skills covered: Web Development (Full Stack, React, Node.js), Data Structures & Algorithms, AI & Machine Learning, Cloud Computing, Cyber Security, Database Systems, DevOps, UI/UX Design, and Financial Analytics.
- Assessments: Timed multiple-choice certification exams with difficulty levels (Easy, Medium, Hard, Expert). Passing threshold is 70%.
- Verified Credentials: Every passing learner receives a tamper-proof digital certificate featuring a unique Certificate ID, secure QR code verification at /verify, and LinkedIn shareable links.

Your Mission & Tone:
- Provide clear, friendly, structured, and technically accurate explanations.
- When explaining code or technical concepts, use clean Markdown formatting with syntax highlighting (e.g., \`\`\`javascript).
- When asked for practice questions or test preparation, provide realistic questions with detailed reasoning and correct answers.
- Offer study roadmaps, revision notes, cheat sheets, and interview tips.
- You can communicate in English, Hindi, or Hinglish depending on how the user addresses you.
- Always be encouraging, insightful, and concise.`;

/**
 * Get active API key from request headers, body, or environment variables
 */
const getApiKey = (req) => {
  const customKey = req.headers['x-gemini-api-key'] || req.body?.apiKey;
  if (customKey && typeof customKey === 'string' && customKey.trim().length > 10) {
    return customKey.trim();
  }
  return process.env.GEMINI_API_KEY || null;
};

/**
 * Helper to call Gemini via official SDK or REST fallback
 */
async function callGeminiChat({ apiKey, modelName = 'gemini-3.8-flash', messages, systemInstruction }) {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemInstruction || SKILLCERT_SYSTEM_INSTRUCTION,
    });

    if (Array.isArray(messages) && messages.length > 1) {
      // Multi-turn chat
      const history = [];
      // All but last message form history
      for (let i = 0; i < messages.length - 1; i++) {
        const msg = messages[i];
        const role = msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user';
        history.push({
          role,
          parts: [{ text: msg.content || msg.text || '' }],
        });
      }

      const lastMessage = messages[messages.length - 1];
      const chat = model.startChat({ history });
      const result = await chat.sendMessage(lastMessage.content || lastMessage.text || '');
      const response = await result.response;
      return response.text();
    } else {
      // Single prompt or initial message
      const promptText = Array.isArray(messages) && messages.length > 0
        ? (messages[0].content || messages[0].text)
        : (messages || 'Hello');

      const result = await model.generateContent(promptText);
      const response = await result.response;
      return response.text();
    }
  } catch (sdkError) {
    console.warn('[Gemini SDK Warning] Falling back to direct REST fetch:', sdkError.message);
    
    // Direct REST API Fallback
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    
    const contents = (Array.isArray(messages) && messages.length > 0 ? messages : [{ role: 'user', content: String(messages) }]).map(m => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content || m.text || '' }]
    }));

    const restResponse = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemInstruction || SKILLCERT_SYSTEM_INSTRUCTION }]
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        }
      })
    });

    const data = await restResponse.json();
    if (!restResponse.ok) {
      throw new Error(data.error?.message || `Gemini REST API error: ${restResponse.statusText}`);
    }

    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('Gemini returned an empty response.');
    }
    return candidateText;
  }
}

// @desc Chat with Gemini AI Assistant
// @route POST /api/ai/chat
export const chatWithAssistant = async (req, res) => {
  try {
    const apiKey = getApiKey(req);
    const { messages, message, model = 'gemini-3.8-flash', systemPrompt } = req.body;

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: 'NO_API_KEY',
        message: 'Google Gemini API key is missing. Please set GEMINI_API_KEY in your server/.env file or enter your API key in the AI Assistant settings.',
      });
    }

    // Format input messages
    let conversationMessages = [];
    if (Array.isArray(messages) && messages.length > 0) {
      conversationMessages = messages;
    } else if (message) {
      conversationMessages = [{ role: 'user', content: message }];
    } else {
      return res.status(400).json({ success: false, message: 'Message or conversation history is required.' });
    }

    const reply = await callGeminiChat({
      apiKey,
      modelName: model,
      messages: conversationMessages,
      systemInstruction: systemPrompt || SKILLCERT_SYSTEM_INSTRUCTION,
    });

    return res.json({
      success: true,
      reply,
      model,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Gemini AI Chat Error]:', error);
    const status = error.message?.includes('API_KEY_INVALID') || error.message?.includes('key not valid') ? 401 : 500;
    return res.status(status).json({
      success: false,
      message: error.message || 'Failed to communicate with Gemini API.',
      details: error.toString(),
    });
  }
};

// @desc Generate practice quiz questions using Gemini
// @route POST /api/ai/generate-quiz
export const generatePracticeQuiz = async (req, res) => {
  try {
    const apiKey = getApiKey(req);
    const { skillName = 'JavaScript', difficulty = 'medium', count = 3 } = req.body;

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: 'NO_API_KEY',
        message: 'Google Gemini API key is required.',
      });
    }

    const prompt = `Generate exactly ${count} multiple choice questions for the skill/topic "${skillName}" at "${difficulty}" difficulty level.
Return ONLY valid raw JSON with NO markdown wrappers or codeblocks (no \`\`\`json). The JSON must be an array of objects matching this schema:
[
  {
    "id": 1,
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Clear explanation of why this answer is correct."
  }
]`;

    const rawResponse = await callGeminiChat({
      apiKey,
      modelName: req.body.model || 'gemini-3.8-flash',
      messages: [{ role: 'user', content: prompt }],
      systemInstruction: 'You are a technical assessment question generator. Return strictly valid JSON array only.',
    });

    // Clean JSON response if wrapped in markdown
    const cleaned = rawResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
    let questions;
    try {
      questions = JSON.parse(cleaned);
    } catch {
      // Fallback regex extract JSON array
      const match = cleaned.match(/\[[\s\S]*\]/);
      if (match) {
        questions = JSON.parse(match[0]);
      } else {
        throw new Error('Could not parse generated quiz questions.');
      }
    }

    return res.json({
      success: true,
      skillName,
      difficulty,
      questions,
    });
  } catch (error) {
    console.error('[Gemini Generate Quiz Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate practice quiz.',
    });
  }
};

// @desc Check Gemini API status & configuration
// @route GET /api/ai/status
export const getAIStatus = async (req, res) => {
  try {
    const hasServerKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 10);
    return res.json({
      success: true,
      hasServerKey,
      defaultModel: 'gemini-3.8-flash',
      availableModels: [
        { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash (Latest & Fast)', recommended: true },
        { id: 'gemini-flash-latest', name: 'Gemini Flash Latest (Auto-Updated)' },
        { id: 'gemini-3.7-flash', name: 'Gemini 3.7 Flash (Hybrid Reasoning)' },
      ],
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Validate a Gemini API key
// @route POST /api/ai/validate-key
export const validateApiKey = async (req, res) => {
  try {
    const { apiKey } = req.body;
    if (!apiKey || apiKey.trim().length < 10) {
      return res.status(400).json({ success: false, valid: false, message: 'Please provide a valid API key string.' });
    }

    const genAI = new GoogleGenerativeAI(apiKey.trim());
    const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });
    const result = await model.generateContent('Say "OK" in 1 word.');
    const response = await result.response;
    const text = response.text();

    return res.json({
      success: true,
      valid: true,
      message: 'Gemini API key is active and verified!',
      pingReply: text.trim(),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      valid: false,
      message: error.message || 'Invalid or unauthorized Gemini API key.',
    });
  }
};

// @desc Analyze Resume for ATS Compatibility & Keyword Optimization using Gemini
// @route POST /api/ai/analyze-resume
export const analyzeResumeForATS = async (req, res) => {
  try {
    const apiKey = getApiKey(req);
    const { resumeData, targetRole = 'Software Engineer', jobDescription = '' } = req.body;

    if (!resumeData) {
      return res.status(400).json({ success: false, message: 'Resume data is required.' });
    }

    // If Gemini API key is available, run full AI analysis
    if (apiKey) {
      const prompt = `You are a Senior Technical Recruiter and ATS (Applicant Tracking System) Evaluation Expert.
Evaluate the candidate's resume against the Target Role: "${targetRole}" and Job Description: "${jobDescription || 'Standard industry expectations for ' + targetRole}".

Candidate Resume JSON:
${JSON.stringify(resumeData, null, 2)}

Return strictly valid JSON only (no markdown, no \`\`\`json block) matching this exact format:
{
  "atsScore": 84,
  "scoreBreakdown": {
    "keywordsMatch": 80,
    "formatting": 92,
    "experienceImpact": 82,
    "skillsRelevance": 85
  },
  "summaryAssessment": "Brief 1-2 sentence feedback on current summary",
  "suggestedSummary": "AI-optimized, keyword-rich 2-3 sentence professional summary",
  "matchingKeywords": ["Keyword 1", "Keyword 2"],
  "missingKeywords": ["Missing Keyword 1", "Missing Keyword 2", "Missing Keyword 3"],
  "strengths": ["Clear technical stack", "Verified SkillCert credentials boost trust"],
  "criticalImprovements": ["Add measurable business metrics to bullet points", "Include missing keywords"],
  "bulletPointSuggestions": [
    {
      "role": "Role Title",
      "original": "Original or weaker bullet",
      "improved": "High-impact bullet with action verbs and quantifiable results"
    }
  ]
}`;

      try {
        const rawResponse = await callGeminiChat({
          apiKey,
          modelName: req.body.model || 'gemini-3.8-flash',
          messages: [{ role: 'user', content: prompt }],
          systemInstruction: 'You are an expert ATS resume evaluator. Output strictly pure JSON.',
        });

        const cleaned = rawResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
        let parsed;
        try {
          parsed = JSON.parse(cleaned);
        } catch {
          const match = cleaned.match(/\{[\s\S]*\}/);
          if (match) parsed = JSON.parse(match[0]);
        }

        if (parsed) {
          return res.json({
            success: true,
            source: 'gemini',
            analysis: parsed,
          });
        }
      } catch (geminiErr) {
        console.warn('[Gemini ATS Error, using fallback engine]:', geminiErr.message);
      }
    }

    // Fallback Rule-Based ATS Analyzer (Guaranteed 100% uptime even without API key)
    const skills = Array.isArray(resumeData.skills) ? resumeData.skills : [];
    const experience = Array.isArray(resumeData.experience) ? resumeData.experience : [];
    const projects = Array.isArray(resumeData.projects) ? resumeData.projects : [];
    const certs = Array.isArray(resumeData.certificates) ? resumeData.certificates : [];

    let score = 55;
    if (resumeData.personalInfo?.email && resumeData.personalInfo?.phone) score += 10;
    if (resumeData.personalInfo?.linkedin || resumeData.personalInfo?.github) score += 5;
    if (resumeData.summary && resumeData.summary.length > 80) score += 10;
    if (skills.length >= 6) score += 10;
    if (experience.length > 0) score += 5;
    if (certs.length > 0) score += 5;

    const actionVerbs = ['developed', 'engineered', 'architected', 'led', 'designed', 'optimized', 'implemented', 'reduced', 'increased', 'managed'];
    let hasActionVerbs = false;
    experience.forEach((exp) => {
      const desc = (exp.description || '').toLowerCase();
      if (actionVerbs.some((v) => desc.includes(v))) hasActionVerbs = true;
    });
    if (hasActionVerbs) score += 5;
    if (score > 100) score = 100;

    return res.json({
      success: true,
      source: 'rule-based',
      analysis: {
        atsScore: score,
        scoreBreakdown: {
          keywordsMatch: Math.min(85, score),
          formatting: 95,
          experienceImpact: hasActionVerbs ? 85 : 65,
          skillsRelevance: skills.length >= 5 ? 90 : 70,
        },
        summaryAssessment: resumeData.summary
          ? 'Good foundation, can be tailored further with quantitative metrics.'
          : 'Summary is currently missing or too brief for ATS parsing.',
        suggestedSummary: `Results-driven ${targetRole} with hands-on expertise in ${skills.slice(0, 4).join(', ') || 'modern software development'}. Proven ability to design scalable solutions, solve complex algorithmic challenges, and deliver high-performance applications with certified credentials.`,
        matchingKeywords: skills.slice(0, 5),
        missingKeywords: ['TypeScript', 'Docker', 'System Design', 'Agile/Scrum', 'CI/CD Pipelines'].filter(k => !skills.map(s => s.toLowerCase()).includes(k.toLowerCase())),
        strengths: [
          'Well-structured contact and education sections',
          certs.length > 0 ? 'Verified SkillCert certification credentials included' : 'Clear technical skill breakdown',
        ],
        criticalImprovements: [
          'Quantify accomplishments with numbers (e.g. reduced load time by 30%, served 10k+ users)',
          'Align technical keywords directly with job descriptions',
        ],
        bulletPointSuggestions: [
          {
            role: experience[0]?.role || targetRole,
            original: 'Worked on front-end and back-end tasks.',
            improved: 'Architected and deployed responsive full-stack features, enhancing user retention by 22% and reducing response latency.',
          },
        ],
      },
    });
  } catch (error) {
    console.error('[Analyze Resume ATS Error]:', error);
    return res.status(500).json({ success: false, message: error.message || 'ATS analysis failed.' });
  }
};

