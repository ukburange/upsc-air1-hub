import { Hono } from 'hono'

const app = new Hono()

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest'

async function callGemini(prompt: string, systemInstruction?: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`
  const body: Record<string, unknown> = {
    contents: [{ parts: [{ text: prompt }] }],
  }
  if (systemInstruction) {
    body.systemInstruction = { parts: [{ text: systemInstruction }] }
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-goog-api-key': GEMINI_API_KEY },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as Record<string, unknown>
    const errorMsg = (err?.error as Record<string, unknown>)?.message || `Gemini API error: ${res.status}`
    throw new Error(String(errorMsg))
  }

  const data = await res.json() as Record<string, unknown>
  const candidates = data.candidates as Array<Record<string, unknown>> | undefined
  if (!candidates?.length) throw new Error('No response from Gemini')
  const content = candidates[0].content as Record<string, unknown> | undefined
  const parts = content?.parts as Array<Record<string, unknown>> | undefined
  return String(parts?.[0]?.text || '')
}

// ─── AI Tutor Chat ───────────────────────────────────────
app.post('/gemini/chat', async (c) => {
  try {
    const body = await c.req.json<{ message: string; history?: Array<{ role: string; text: string }> }>()
    const { message, history = [] } = body

    if (!message?.trim()) return c.json({ error: 'Message is required' }, 400)

    const systemPrompt = `You are Acharya Chanakya — the legendary strategist and mentor — now serving as the personal UPSC CSE preparation coach for Vivekanand Kishorkumar Burange, who is targeting All India Rank 1 in UPSC CSE 2027.

Key facts about the student:
- Prelims language: Hindi
- Mains language: Marathi  
- Interview language: Marathi
- Daily study commitment: 8 hours
- Target: AIR 1 in UPSC CSE 2027

Your role:
1. Answer ALL UPSC-related questions with authority and depth
2. When asked about Polity, Economy, History, Geography, Environment, Science — give exam-ready answers with key facts, articles, amendments
3. Always highlight ELIMINATION TRAPS for MCQs
4. Provide answers in Marathi when asked (मराठीत उत्तर द्या)
5. Provide answers in Hindi when asked (हिंदी में उत्तर दें)
6. Be motivational but strict — like a true guru
7. Use the "3-Read Method" and "Deep Active Recall" principles in your teaching
8. Always link static syllabus topics with current affairs when relevant

Never say "I don't know" — always guide toward the right resource or approach.`

    const conversationHistory = history
      .map((m) => `${m.role === 'user' ? 'Student' : 'Acharya Chanakya'}: ${m.text}`)
      .join('\n')

    const fullPrompt = conversationHistory
      ? `${conversationHistory}\n\nStudent: ${message}`
      : message

    const reply = await callGemini(fullPrompt, systemPrompt)
    return c.json({ reply })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return c.json({ error: msg }, 500)
  }
})

// ─── Live Current Affairs Generator ──────────────────────
app.post('/gemini/current-affairs', async (c) => {
  try {
    const body = await c.req.json<{ date?: string }>()
    const date = body.date || new Date().toISOString().split('T')[0]

    const prompt = `Generate TODAY'S UPSC CSE 2027 Current Affairs Bulletin for date: ${date}

For each news item, provide:
1. Title (crisp, exam-relevant)
2. Source (The Hindu / PIB / SC Judgment / Gazette / RBI Bulletin / etc.)
3. Static GS Link (exact topic it connects to in UPSC syllabus)
4. Timeline / Key Dates (when the event happened, when it was implemented)
5. Elimination Trap / Core Insight (the tricky fact UPSC loves to test)
6. Category (Polity / Economy / Environment / Geography / Science & IR)
7. UPSC Relevance: HIGH / MEDIUM / LOW

Generate 8-10 current affairs items. Focus on:
- Government policies and schemes
- Supreme Court judgments
- Economic developments (RBI, SEBI, GST Council)
- International relations and agreements
- Environment and ecology
- Science & Technology developments
- Important appointments and bills

Output as valid JSON array. Each item should be exam-ready — no fluff, pure UPSC material.`

    const systemPrompt = 'You are a UPSC current affairs expert. Output ONLY valid JSON arrays. No markdown, no explanation before or after the JSON.'
    const reply = await callGemini(prompt, systemPrompt)

    // Try to extract JSON from the response
    let affairs
    try {
      const jsonMatch = reply.match(/\[[\s\S]*\]/)
      affairs = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(reply)
    } catch {
      affairs = [{ raw_response: reply, date }]
    }

    return c.json({ date, affairs })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return c.json({ error: msg }, 500)
  }
})

// ─── AI Quiz Engine ──────────────────────────────────────
app.post('/gemini/quiz', async (c) => {
  try {
    const body = await c.req.json<{ topic?: string; count?: number; difficulty?: string }>()
    const topic = body.topic || 'Indian Polity'
    const count = body.count || 10
    const difficulty = body.difficulty || 'UPSC Prelims level'

    const prompt = `Generate ${count} UPSC CSE Prelims-style MCQs on: ${topic}
Difficulty: ${difficulty}

For each question, provide:
1. question: The full question text
2. options: Array of exactly 4 options (A, B, C, D)
3. correct: The correct option letter (A/B/C/D)
4. explanation: Detailed explanation with the static GS topic link
5. eliminationTip: How to eliminate 2 wrong options quickly
6. source: Where this topic appears in UPSC syllabus (e.g., "GS-2 Polity", "GS-3 Economy")
7. difficulty: "Easy" / "Medium" / "Hard"

Output as valid JSON array. Questions must be UPSC-standard — tricky options, close distractors, current-affairs linked.`

    const systemPrompt = 'You are a UPSC MCQ question paper setter with 20 years of experience. Output ONLY valid JSON arrays. No markdown, no explanation before or after the JSON.'
    const reply = await callGemini(prompt, systemPrompt)

    let quiz
    try {
      const jsonMatch = reply.match(/\[[\s\S]*\]/)
      quiz = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(reply)
    } catch {
      quiz = [{ raw_response: reply }]
    }

    return c.json({ topic, count, quiz })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return c.json({ error: msg }, 500)
  }
})

// ─── Daily Briefing Generator ────────────────────────────
app.get('/gemini/daily-briefing', async (c) => {
  try {
    const date = new Date().toISOString().split('T')[0]
    const prompt = `Generate a daily UPSC study briefing for ${date} for a student targeting AIR 1.

Include:
1. **Today's Top 5 Current Affairs** — exam-relevant headlines with 1-line explanation
2. **Study Focus** — which GS topic to prioritize today and why
3. **PYQ Connection** — a past year question (2020-2024) related to today's focus topic
4. **Elimination Trap of the Day** — one tricky MCQ trap students commonly fall for
5. **Quote of the Day** — motivational quote from Chanakya's Arthashastra or Chanakya Neeti
6. **Progress Reminder** — encouraging note about consistency

Output as a clean JSON object with these keys: date, topAffairs, studyFocus, pyqConnection, eliminationTrap, quote, motivation.`

    const systemPrompt = 'You are Acharya Chanakya, the UPSC mentor. Output ONLY valid JSON. No markdown wrapping.'
    const reply = await callGemini(prompt, systemPrompt)

    let briefing
    try {
      const jsonMatch = reply.match(/\{[\s\S]*\}/)
      briefing = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(reply)
    } catch {
      briefing = { date, raw: reply }
    }

    return c.json(briefing)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return c.json({ error: msg }, 500)
  }
})

// ─── Topic Explainer ─────────────────────────────────────
app.post('/gemini/explain', async (c) => {
  try {
    const body = await c.req.json<{ topic: string; language?: string }>()
    const { topic, language = 'english' } = body

    if (!topic?.trim()) return c.json({ error: 'Topic is required' }, 400)

    const langMap: Record<string, string> = {
      english: 'Answer in English',
      hindi: 'हिंदी में उत्तर दें',
      marathi: 'मराठीत उत्तर द्या',
    }

    const prompt = `Explain "${topic}" for UPSC CSE 2027 preparation. ${langMap[language] || langMap.english}

Include:
1. **Definition** — Clear, exam-ready definition
2. **Key Facts** — Articles, Sections, Amendments, Dates, Committees
3. **Static Syllabus Link** — Where it appears in UPSC syllabus
4. **Current Affairs Link** — Recent developments related to this topic
5. **PYQ Analysis** — How UPSC has asked about this in past exams
6. **Elimination Traps** — 3 common MCQ traps
7. **Mains Answer Pointers** — 5 key points for a 150-word answer
8. **Memory Aids** — Mnemonics or tricks to remember key facts`

    const systemPrompt = 'You are Acharya Chanakya, the UPSC CSE mentor. Give comprehensive, exam-ready explanations. Be structured and precise.'
    const reply = await callGemini(prompt, systemPrompt)
    return c.json({ topic, explanation: reply })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return c.json({ error: msg }, 500)
  }
})

// ─── Study Plan Generator ────────────────────────────────
app.post('/gemini/study-plan', async (c) => {
  try {
    const body = await c.req.json<{ weakTopics?: string[]; daysUntilExam?: number }>()
    const weakTopics = body.weakTopics || ['Geography', 'Environment']
    const daysUntilExam = body.daysUntilExam || 630

    const prompt = `Generate a personalized study plan for UPSC CSE 2027 aspirant.

Days until Prelims: ${daysUntilExam}
Weak topics: ${weakTopics.join(', ')}
Daily study hours: 8 hours
Mains language: Marathi

Create a week-by-week plan covering:
1. **Weekly Focus Areas** — which GS papers to cover
2. **Daily 8-hour Split** — hour-by-hour schedule
3. **Revision Cycles** — spaced repetition schedule
4. **Mock Test Schedule** — weekly test plan
5. **Weak Area Intensive** — extra focus on weak topics
6. **Current Affairs Integration** — daily 30-min slot for CA
7. **Mains Answer Writing** — 2 answers per day practice
8. **CSAT Preparation** — 1 hour daily minimum

Output as clean JSON with keys: weeklyPlan (array of objects with week, focus, tasks, revisionTopics, mockTest).`

    const systemPrompt = 'You are a UPSC AIR-1 study strategist. Output ONLY valid JSON. Be specific, actionable, and time-bound.'
    const reply = await callGemini(prompt, systemPrompt)

    let plan
    try {
      const jsonMatch = reply.match(/\{[\s\S]*\}/)
      plan = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(reply)
    } catch {
      plan = { raw: reply }
    }

    return c.json(plan)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return c.json({ error: msg }, 500)
  }
})

// ─── Smart Revision Notes Generator ──────────────────────
app.post('/gemini/revision-notes', async (c) => {
  try {
    const body = await c.req.json<{ topic: string; paperId?: string }>()
    const { topic, paperId } = body

    if (!topic?.trim()) return c.json({ error: 'Topic is required' }, 400)

    const prompt = `Generate comprehensive UPSC exam-ready REVISION NOTES for: "${topic}"

Include ALL of these sections:
1. **One-Liner Facts** — 10 key facts that can appear as MCQ options (with exact articles, sections, dates, numbers)
2. **Bullet Point Summary** — Maximum 15 bullet points covering the ENTIRE topic for quick revision
3. **Comparison Table** — Key comparisons in table format (if applicable)
4. **Elimination Traps** — 5 most common UPSC tricks on this topic
5. **PYQ Pattern** — How UPSC has tested this topic (year-wise pattern)
6. **Current Affairs Link** — Latest developments connected to this static topic
7. **Mains Ready Points** — 7 points for GS Mains answer writing (250 words)
8. **Memory Tricks** — Mnemonics, acronyms, or stories to remember key facts
9. **Mind Map Keywords** — 20 keywords that map the entire topic for quick recall

Output as clean JSON with keys: topic, oneLiners (array), bulletPoints (array), comparisonTable (object with headers and rows), eliminationTraps (array), pyqPattern (string), currentAffairs (string), mainsPoints (array), memoryTricks (array), mindMapKeywords (array).`

    const systemPrompt = 'You are the best UPSC revision notes maker in India. Output ONLY valid JSON. Be ultra-precise with facts, articles, dates, and numbers. Every fact must be exam-verified.'
    const reply = await callGemini(prompt, systemPrompt)

    let notes
    try {
      const jsonMatch = reply.match(/\{[\s\S]*\}/)
      notes = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(reply)
    } catch {
      notes = { topic, raw: reply }
    }

    return c.json(notes)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return c.json({ error: msg }, 500)
  }
})

// ─── Daily MCQ from Covered Syllabus ────────────────────
app.post('/gemini/daily-mcq', async (c) => {
  try {
    const body = await c.req.json<{ completedTopics: string[]; weakTopics?: string[]; count?: number }>()
    const { completedTopics = [], weakTopics = [], count = 15 } = body

    if (completedTopics.length === 0) {
      return c.json({ error: 'Complete at least one topic first to generate daily MCQs' }, 400)
    }

    const prompt = `Generate ${count} DAILY PRACTICE MCQs for UPSC CSE 2027.

Topics covered by student (generate questions ONLY from these):
${completedTopics.slice(0, 15).map((t, i) => `${i + 1}. ${t}`).join('\n')}

${weakTopics.length > 0 ? `Weak areas (give EXTRA weightage to these):\n${weakTopics.map((t, i) => `${i + 1}. ${t}`).join('\n')}` : ''}

Rules:
- Questions must be UPSC Prelims standard (trap-based, application-based)
- Mix difficulty: 40% Easy, 40% Medium, 20% Hard
- At least 3 questions must link current affairs with static topics
- Each question must have an elimination tip
- Include questions from DIFFERENT covered topics (not all from one)

For each question provide:
1. question: Full question text
2. options: Array of exactly 4 options
3. correct: Correct option letter (A/B/C/D)
4. explanation: Why correct and why wrong options are wrong
5. eliminationTip: How to eliminate 2 wrong options in 10 seconds
6. topic: Which specific topic this tests
7. difficulty: "Easy" / "Medium" / "Hard"
8. pyqLink: If related to any past year question

Output as valid JSON array.`

    const systemPrompt = 'You are India\'s top UPSC MCQ setter. Output ONLY valid JSON. Questions must be tricky, exam-standard, with close distractors.'
    const reply = await callGemini(prompt, systemPrompt)

    let mcqs
    try {
      const jsonMatch = reply.match(/\[[\s\S]*\]/)
      mcqs = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(reply)
    } catch {
      mcqs = [{ raw_response: reply }]
    }

    return c.json({ date: new Date().toISOString().split('T')[0], count: mcqs.length, mcqs })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return c.json({ error: msg }, 500)
  }
})

// ─── Weekly Performance Analyzer ─────────────────────────
app.post('/gemini/analyze-performance', async (c) => {
  try {
    const body = await c.req.json<{
      completedTopics?: string[]
      totalTopics?: number
      errorLog?: Array<{ category: string; subject: string }>
      accuracy?: number
      studyDays?: number
    }>()

    const prompt = `Analyze this UPSC CSE 2027 aspirant's weekly performance and generate a STRATEGIC REPORT.

Data:
- Completed topics: ${body.completedTopics?.length || 0}/${body.totalTopics || 131}
- Test accuracy: ${body.accuracy || 0}%
- Study days this week: ${body.studyDays || 0}/7
- Error categories: ${body.errorLog?.length || 0} total errors
${body.errorLog ? `- Errors by subject: ${JSON.stringify(body.errorLog.reduce((acc, e) => { acc[e.subject] = (acc[e.subject] || 0) + 1; return acc }, {} as Record<string, number>))}` : ''}

Generate a JARVIS-style strategic analysis:
1. **Overall Score** — out of 100 with grade (A+/A/B+/B/C)
2. **Strength Analysis** — top 3 strongest areas
3. **Weakness Alert** — top 3 areas needing immediate attention
4. **Weekly Velocity** — topics/week pace vs required pace for AIR 1
5. **Risk Assessment** — which subjects are falling behind
6. **Action Items** — 5 specific tasks for next week with priority
7. **Motivation** — personalized encouraging message
8. **AIR 1 Readiness** — percentage readiness score

Output as clean JSON.`

    const systemPrompt = 'You are a JARVIS-level AI strategic analyst for UPSC preparation. Be brutally honest, data-driven, and precise. Output ONLY valid JSON.'
    const reply = await callGemini(prompt, systemPrompt)

    let analysis
    try {
      const jsonMatch = reply.match(/\{[\s\S]*\}/)
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(reply)
    } catch {
      analysis = { raw: reply }
    }

    return c.json(analysis)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return c.json({ error: msg }, 500)
  }
})

// ─── Smart Daily Plan ────────────────────────────────────
app.post('/gemini/smart-daily-plan', async (c) => {
  try {
    const body = await c.req.json<{
      completedTopics?: string[]
      pendingTopics?: string[]
      weakTopics?: string[]
      errorsToday?: number
      accuracy?: number
    }>()

    const prompt = `Generate a SMART DAILY STUDY PLAN for tomorrow for this UPSC CSE 2027 aspirant.

Current Status:
- Completed: ${body.completedTopics?.length || 0} topics
- Pending: ${body.pendingTopics?.length || 0} topics
- Weak areas: ${body.weakTopics?.join(', ') || 'Not assessed'}
- Today's accuracy: ${body.accuracy || 'N/A'}%
- Today's errors: ${body.errorsToday || 0}
- Study hours: 8 hours (non-negotiable)
- Mains language: Marathi
- Interview language: Marathi

Generate an HOUR-BY-HOUR plan for tomorrow:
1. **Morning Block (6:00-9:00)** — Static GS deep study
2. **Mid-Morning (9:00-10:00)** — Current affairs + static linking
3. **Late Morning (10:00-11:00)** — MCQ practice from covered topics
4. **Break (11:00-12:00)** — Rest
5. **Afternoon Block (12:00-14:00)** — Weak area intensive
6. **Late Afternoon (14:00-15:00)** — Revision of yesterday's topics
7. **Evening (15:00-16:00)** — CSAT practice
8. **Night (16:00-17:00)** — Error analysis + notes compilation

For each block specify:
- exactTopic: What to study
- gsLink: Which GS paper it belongs to
- method: How to study (3-Read / MCQ / Mapping / Revision)
- target: Measurable goal for that block

Output as clean JSON with keys: date, blocks (array), dailyQuote, totalHours, priorityFocus.`

    const systemPrompt = 'You are JARVIS — the world\'s most intelligent study planner. Create the optimal schedule maximizing retention and exam performance. Output ONLY valid JSON.'
    const reply = await callGemini(prompt, systemPrompt)

    let plan
    try {
      const jsonMatch = reply.match(/\{[\s\S]*\}/)
      plan = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(reply)
    } catch {
      plan = { raw: reply }
    }

    return c.json(plan)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return c.json({ error: msg }, 500)
  }
})

// ─── AI Conversation Analyzer ─────────────────────────────
app.post('/gemini/analyze-conversation', async (c) => {
  try {
    const body = await c.req.json<{ conversation: string }>()
    const { conversation } = body
    if (!conversation) return c.json({ error: 'No conversation provided' }, 400)

    const apiKey = process.env.GEMINI_API_KEY || ''
    if (!apiKey) return c.json({ error: 'Gemini API not configured' }, 500)

    const prompt = `You are an UPSC CSE 2027 exam preparation AI assistant. Analyze this conversation and extract study intelligence. Respond ONLY in valid JSON (no markdown, no code fences).

Conversation:
${conversation.slice(0, 15000)}

Return this JSON structure:
{
  "summary": "One paragraph summary in Marathi of what was discussed",
  "topics": ["topic1", "topic2"],
  "weakAreas": ["area where student struggled"],
  "strongAreas": ["area where student showed confidence"],
  "revisionNotes": "Key revision notes in Marathi with mnemonics and common mistakes",
  "dailyPlanUpdate": "What to study next based on this conversation in Marathi",
  "currentAffairs": ["any current affairs mentioned"],
  "actionItems": ["specific next steps for the student"],
  "mood": "focused/struggling/confident/mixed"
}`

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
      }),
    })
    const data = await res.json()
    if (!res.ok) return c.json({ error: data?.error?.message || 'Gemini API error' }, 502)

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return c.json({ error: 'Could not parse AI response' }, 502)
    return c.json(JSON.parse(jsonMatch[0]))
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return c.json({ error: msg }, 500)
  }
})

// ─── Google Workspace OAuth ──────────────────────────────
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ''
const GOOGLE_REDIRECT_URI = '' // Set dynamically per request
const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/documents.readonly',
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/tasks.readonly',
  'https://www.googleapis.com/auth/userinfo.email',
].join(' ')

// In-memory token store (per-session)
let googleAccessToken = ''
let googleRefreshToken = ''
let googleUserEmail = ''
let lastRedirectUri = ''

app.get('/google/auth-url', (c) => {
  if (!GOOGLE_CLIENT_ID) return c.json({ error: 'Google OAuth not configured' }, 500)
  const clientOrigin = c.req.query('origin') || ''
  const origin = clientOrigin || c.req.header('origin') || c.req.header('x-forwarded-origin') || `http://localhost:${process.env.PORT || 3001}`
  const redirectUri = `${origin}/api/google/callback`
  lastRedirectUri = redirectUri
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(GOOGLE_SCOPES)}&access_type=offline&prompt=consent`
  return c.json({ url, redirectUri })
})

app.get('/google/callback', async (c) => {
  const code = c.req.query('code')
  if (!code) return c.json({ error: 'No authorization code' }, 400)

  const redirectUri = lastRedirectUri || `http://localhost:${process.env.PORT || 3001}/api/google/callback`

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })
    const tokens = await tokenRes.json() as Record<string, string>
    googleAccessToken = tokens.access_token || ''
    googleRefreshToken = tokens.refresh_token || googleRefreshToken

    if (googleAccessToken) {
      const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${googleAccessToken}` },
      })
      const user = await userRes.json() as Record<string, string>
      googleUserEmail = user.email || ''
    }

    return c.html(`<script>window.opener?.postMessage({google:'connected',email:'${googleUserEmail}'},'*');window.close();</script><p>Connected! You may close this window.</p>`)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Token exchange failed'
    return c.json({ error: msg }, 500)
  }
})

app.get('/google/status', (c) => {
  return c.json({
    connected: !!googleAccessToken,
    email: googleUserEmail || null,
  })
})

async function googleFetch(url: string): Promise<unknown> {
  if (!googleAccessToken) throw new Error('Google not connected')
  const res = await fetch(url, { headers: { Authorization: `Bearer ${googleAccessToken}` } })
  if (!res.ok) throw new Error(`Google API error: ${res.status}`)
  return res.json()
}

app.get('/google/docs', async (c) => {
  try {
    const data = await googleFetch('https://www.googleapis.com/drive/v3/files?q=mimeType%3D%27application%2Fvnd.google-apps.document%27&fields=files(id,name,modifiedTime)&orderBy=modifiedTime%20desc&pageSize=20') as Record<string, unknown>
    const files = (data.files || []) as Array<Record<string, string>>
    return c.json({ docs: files.map(f => ({ id: f.id, name: f.name, modified: f.modifiedTime })) })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed'
    return c.json({ error: msg }, 500)
  }
})

app.get('/google/sheets', async (c) => {
  try {
    const data = await googleFetch('https://www.googleapis.com/drive/v3/files?q=mimeType%3D%27application%2Fvnd.google-apps.spreadsheet%27&fields=files(id,name,modifiedTime)&orderBy=modifiedTime%20desc&pageSize=20') as Record<string, unknown>
    const files = (data.files || []) as Array<Record<string, string>>
    return c.json({ sheets: files.map(f => ({ id: f.id, name: f.name, modified: f.modifiedTime })) })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed'
    return c.json({ error: msg }, 500)
  }
})

app.get('/google/calendar', async (c) => {
  try {
    const now = new Date().toISOString()
    const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    const data = await googleFetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now}&timeMax=${future}&singleEvents=true&orderBy=startTime&maxResults=20`) as Record<string, unknown>
    const items = (data.items || []) as Array<Record<string, unknown>>
    return c.json({
      events: items.map(e => ({
        id: e.id,
        summary: e.summary,
        start: (e.start as Record<string, string>)?.dateTime || (e.start as Record<string, string>)?.date,
        end: (e.end as Record<string, string>)?.dateTime || (e.end as Record<string, string>)?.date,
      })),
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed'
    return c.json({ error: msg }, 500)
  }
})

app.get('/google/tasks', async (c) => {
  try {
    const data = await googleFetch('https://www.googleapis.com/tasks/v1/lists/@default/tasks?maxResults=20') as Record<string, unknown>
    const items = (data.items || []) as Array<Record<string, string>>
    return c.json({
      tasks: items.map(t => ({
        id: t.id,
        title: t.title,
        status: t.status,
        due: t.due || null,
        updated: t.updated,
      })),
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed'
    return c.json({ error: msg }, 500)
  }
})

// ─── Auto-Track: Mark topic complete after quiz success ───
app.post('/gemini/auto-track', async (c) => {
  try {
    const body = await c.req.json<{ topicName: string; score: number; total: number }>()
    const { topicName, score, total } = body
    const percentage = Math.round((score / total) * 100)

    let status = 'needs_revision'
    if (percentage >= 90) status = 'mastered'
    else if (percentage >= 70) status = 'good_progress'
    else if (percentage >= 50) status = 'needs_practice'

    return c.json({
      topic: topicName,
      score: percentage,
      status,
      recommendation: percentage >= 80
        ? `✅ "${topicName}" is strong. Move to next topic. Revisit in 7 days.`
        : percentage >= 50
          ? `⚠️ "${topicName}" needs work. Practice 10 more MCQs tomorrow.`
          : `🚨 "${topicName}" is weak. Schedule intensive revision session today.`,
      nextAction: percentage < 70
        ? await callGemini(
            `Generate 3 quick revision points for "${topicName}" that will help improve UPSC MCQ accuracy. Output as JSON array of strings.`,
            'Output ONLY valid JSON array.'
          ).catch(() => '[]')
        : '[]',
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return c.json({ error: msg }, 500)
  }
})

// ─── Health Check ────────────────────────────────────────
app.get('/gemini/health', (c) => {
  return c.json({
    status: GEMINI_API_KEY ? 'configured' : 'missing_key',
    model: GEMINI_MODEL,
    timestamp: new Date().toISOString(),
  })
})

export default app
