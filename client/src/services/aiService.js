import API from './api';

const STORAGE_KEY_API_KEY = 'skillcert_gemini_api_key';
const STORAGE_KEY_MODEL = 'skillcert_gemini_model';
const DEFAULT_MODEL = 'gemini-3.8-flash';
const DEFAULT_API_KEY = '';

export const getStoredApiKey = () => {
  return localStorage.getItem(STORAGE_KEY_API_KEY) || import.meta.env.VITE_GEMINI_API_KEY || DEFAULT_API_KEY;
};

export const setStoredApiKey = (key) => {
  if (key && key.trim()) {
    localStorage.setItem(STORAGE_KEY_API_KEY, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY_API_KEY);
  }
};

export const clearStoredApiKey = () => {
  localStorage.removeItem(STORAGE_KEY_API_KEY);
};

export const getStoredModel = () => {
  return localStorage.getItem(STORAGE_KEY_MODEL) || DEFAULT_MODEL;
};

export const setStoredModel = (model) => {
  localStorage.setItem(STORAGE_KEY_MODEL, model || DEFAULT_MODEL);
};

/**
 * Fetch AI service status (whether server key is configured, available models)
 */
export const getAIStatus = async () => {
  try {
    const res = await API.get('/ai/status');
    return res.data;
  } catch (error) {
    console.error('Failed to get AI status:', error);
    return {
      success: false,
      hasServerKey: true,
      defaultModel: DEFAULT_MODEL,
      availableModels: [
        { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash (Latest & Fast)', recommended: true },
        { id: 'gemini-flash-latest', name: 'Gemini Flash Latest' },
        { id: 'gemini-3.7-flash', name: 'Gemini 3.7 Flash' },
      ],
    };
  }
};

/**
 * Validate a user provided Gemini API Key
 */
export const validateApiKey = async (apiKey) => {
  try {
    const res = await API.post('/ai/validate-key', { apiKey });
    return res.data;
  } catch (error) {
    // If backend is down or fails, try direct browser call to Gemini
    try {
      const directRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'ping' }] }]
        })
      });
      const data = await directRes.json();
      if (directRes.ok && data.candidates) {
        return { success: true, valid: true, message: 'Gemini API key is active!' };
      }
      return { success: false, valid: false, message: data.error?.message || 'Invalid Gemini API key.' };
    } catch (e) {
      return {
        success: false,
        valid: false,
        message: error.response?.data?.message || e.message || 'Key validation failed.',
      };
    }
  }
};

/**
 * Send chat message to Gemini (via backend API or direct Gemini REST fallback)
 */
export const sendChatMessage = async ({ messages, model, systemPrompt }) => {
  const customKey = getStoredApiKey();
  const selectedModel = model || getStoredModel() || DEFAULT_MODEL;

  const headers = {};
  if (customKey) {
    headers['x-gemini-api-key'] = customKey;
  }

  try {
    const res = await API.post(
      '/ai/chat',
      {
        messages,
        model: selectedModel,
        systemPrompt,
        apiKey: customKey || undefined,
      },
      { headers }
    );
    return res.data;
  } catch (backendError) {
    // If backend failed because of missing server key and user has custom key, or backend unreachable, fallback to direct browser call
    if (customKey) {
      console.warn('Backend chat failed, trying direct browser Gemini API integration...', backendError.message);
      try {
        const directReply = await directGeminiChat({
          apiKey: customKey,
          model: selectedModel,
          messages,
        });
        return {
          success: true,
          reply: directReply,
          model: selectedModel,
          direct: true,
        };
      } catch (directError) {
        throw new Error(directError.message || 'Failed to call Gemini API directly.');
      }
    }

    const errData = backendError.response?.data;
    if (errData && errData.error === 'NO_API_KEY') {
      const err = new Error(errData.message);
      err.code = 'NO_API_KEY';
      throw err;
    }

    throw new Error(errData?.message || backendError.message || 'Chat request failed.');
  }
};

/**
 * Direct browser-to-Gemini REST API call (useful if running standalone or backend has no key)
 */
export const directGeminiChat = async ({ apiKey, model = 'gemini-3.8-flash', messages }) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const contents = messages.map((m) => ({
    role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
    parts: [{ text: m.content || '' }],
  }));

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || `Gemini API Error: ${res.statusText}`);
  }

  const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!replyText) {
    throw new Error('Gemini API returned an empty response.');
  }

  return replyText;
};

/**
 * Generate practice quiz via Gemini
 */
export const generateQuizQuestions = async ({ skillName, difficulty = 'medium', count = 3, model }) => {
  const customKey = getStoredApiKey();
  const selectedModel = model || getStoredModel() || DEFAULT_MODEL;

  const headers = {};
  if (customKey) {
    headers['x-gemini-api-key'] = customKey;
  }

  try {
    const res = await API.post(
      '/ai/generate-quiz',
      {
        skillName,
        difficulty,
        count,
        model: selectedModel,
        apiKey: customKey || undefined,
      },
      { headers }
    );
    return res.data;
  } catch (error) {
    const errData = error.response?.data;
    if (errData?.error === 'NO_API_KEY') {
      const err = new Error(errData.message);
      err.code = 'NO_API_KEY';
      throw err;
    }
    throw new Error(errData?.message || error.message || 'Failed to generate quiz.');
  }
};

/**
 * Analyze Resume for ATS Score & Optimization with Gemini
 */
export const analyzeResumeATS = async ({ resumeData, targetRole = 'Software Engineer', jobDescription = '', model }) => {
  const customKey = getStoredApiKey();
  const selectedModel = model || getStoredModel() || DEFAULT_MODEL;

  const headers = {};
  if (customKey) {
    headers['x-gemini-api-key'] = customKey;
  }

  try {
    const res = await API.post(
      '/ai/analyze-resume',
      {
        resumeData,
        targetRole,
        jobDescription,
        model: selectedModel,
        apiKey: customKey || undefined,
      },
      { headers }
    );
    return res.data;
  } catch (error) {
    console.error('ATS API Error:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to analyze resume for ATS.');
  }
};

