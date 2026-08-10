import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono().use('*', cors())

// ─── Gemini API Helper ─────────────────────────────────
async function geminiGenerate(prompt: string, opts?: { temperature?: number; maxTokens?: number }) {
  const apiKey = process.env.GEMINI_API_KEY || ''
  if (!apiKey) throw new Error('GEMINI_API_KEY not set in Vercel environment variables')
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: opts?.temperature ?? 0.7, maxOutputTokens: opts?.maxTokens ?? 8192 },
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error?.message || 'Gemini API error')
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

// ─── Health Check ──────────────────────────────────────
app.get('/gemini/health', (c) => {
  return c.json({ status: 'ok', apiKey: process.env.GEMINI_API_KEY ? 'configured' : 'missing' })
})

// ─── AI Chat (Guru Chanakya) ───────────────────────────
app.post('/gemini/chat', async (c) => {
  try {
    const body = await c.req.json()
    const { messages, language } = body
    const lang = language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : 'English'
    const systemPrompt = `You are Acharya Chanakya, an expert UPSC CSE tutor. Respond in ${lang}. Be concise and exam-focused.`
    const conversationText = messages.map((m: { role: string; text: string }) => `${m.role === 'user' ? 'Student' : 'Acharya'}: ${m.text}`).join('\n')
    const prompt = `${systemPrompt}\n\n${conversationText}\n\nAcharya:`
    const text = await geminiGenerate(prompt, { temperature: 0.7, maxTokens: 2048 })
    return c.json({ reply: text })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return c.json({ error: msg }, 500)
  }
})

// ─── AI Explain (Guru Chanakya detailed) ───────────────
app.post('/gemini/explain', async (c) => {
  try {
    const body = await c.req.json()
    const { question, language } = body
    const lang = language === 'mr' ? 'Marathi' : language === 'hi' ? 'Hindi' : 'English'
    const prompt = `You are Acharya Chanakya, expert UPSC CSE tutor. Answer in ${lang}. Include: clear explanation, exam relevance, common mistakes, PYQ connection.\n\nQuestion: ${question}`
    const text = await geminiGenerate(prompt, { temperature: 0.7, maxTokens: 2048 })
    return c.json({ reply: text })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return c.json({ error: msg }, 500)
  }
})

// ─── Quiz Generator ────────────────────────────────────
app.post('/gemini/quiz', async (c) => {
  try {
    const body = await c.req.json()
    const { topic, difficulty, questionCount, language, completedTopics } = body
    const topicList = (completedTopics || []).slice(0, 15).join(', ')
    const prompt = `Generate ${questionCount || 5} UPSC Prelims MCQs on "${topic}" (Difficulty: ${difficulty}).
${topicList ? `Already studied: ${topicList}.` : ''}
IMPORTANT: Return questions in HINDI language only. Return ONLY valid JSON array like:
[{"question":"प्रश्न","options":["A","B","C","D"],"correct":"A","explanation":"व्याख्या","difficulty":"${difficulty}"}]`
    const text = await geminiGenerate(prompt, { temperature: 0.8 })
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) return c.json({ error: 'Could not parse quiz' }, 502)
    return c.json({ questions: JSON.parse(jsonMatch[0]) })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return c.json({ error: msg }, 500)
  }
})

// ─── Current Affairs ───────────────────────────────────
app.post('/gemini/current-affairs', async (c) => {
  try {
    const body = await c.req.json()
    const { syllabusTopics } = body
    const prompt = `Generate today's UPSC-relevant current affairs. Return ONLY valid JSON array.
Each item: {"title":"title","summary":"brief summary in Marathi","category":"Polity/Economy/...","gsLink":"GS Paper","relevance":"high/medium/low","date":"today's date","source":"source"}
Return 8 items. ALL text in Marathi language.`
    const text = await geminiGenerate(prompt, { temperature: 0.7 })
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) return c.json({ error: 'Could not parse CA' }, 502)
    return c.json({ items: JSON.parse(jsonMatch[0]) })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return c.json({ error: msg }, 500)
  }
})

// ─── Revision Notes ────────────────────────────────────
app.post('/gemini/revision-notes', async (c) => {
  try {
    const body = await c.req.json()
    const { topic } = body
    const prompt = `Generate comprehensive UPSC revision notes on "${topic}" in Marathi language. Return ONLY valid JSON:
{"title":"topic","oneLiners":["fact1","fact2"],"bullets":["point1"],"comparisonTable":"comparison","eliminationTraps":["trap1"],"pyqPattern":"PYQ info","currentAffairs":"link","mainsPoints":["point1"],"memoryTricks":["trick1"],"mindMapKeywords":["keyword1"]}`
    const text = await geminiGenerate(prompt, { temperature: 0.7 })
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return c.json({ error: 'Could not parse notes' }, 502)
    return c.json(JSON.parse(jsonMatch[0]))
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return c.json({ error: msg }, 500)
  }
})

// ─── Smart Daily Plan ──────────────────────────────────
app.post('/gemini/smart-daily-plan', async (c) => {
  try {
    const body = await c.req.json()
    const { completedTopics, weakTopics, preferredHours } = body
    const prompt = `Create a ${preferredHours || 8}-hour UPSC study plan for tomorrow in Marathi. Return ONLY valid JSON:
{"date":"tomorrow","totalHours":8,"schedule":[{"time":"06:00-08:00","subject":"subject","topic":"topic","type":"static/dynamic/csat","priority":"high/medium"}],"summary":"plan summary in Marathi"}`
    const text = await geminiGenerate(prompt, { temperature: 0.7 })
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return c.json({ error: 'Could not parse plan' }, 502)
    return c.json(JSON.parse(jsonMatch[0]))
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return c.json({ error: msg }, 500)
  }
})

// ─── Performance Analyzer ──────────────────────────────
app.post('/gemini/analyze-performance', async (c) => {
  try {
    const body = await c.req.json()
    const { completedTopics, accuracy, pyqAlignment } = body
    const prompt = `Analyze this UPSC preparation data in Marathi. Return ONLY valid JSON:
{"score":85,"grade":"A","readiness":"75%","strengths":["str1"],"weaknessAlerts":["weak1"],"actionItems":["action1"],"weeklyVelocity":"3 topics/week","riskAssessment":"medium risk - focus on Geography"}`
    const text = await geminiGenerate(prompt, { temperature: 0.7 })
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return c.json({ error: 'Could not parse analysis' }, 502)
    return c.json(JSON.parse(jsonMatch[0]))
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return c.json({ error: msg }, 500)
  }
})

// ─── AI Conversation Analyzer ──────────────────────────
app.post('/gemini/analyze-conversation', async (c) => {
  try {
    const body = await c.req.json()
    const { conversation } = body
    if (!conversation) return c.json({ error: 'No conversation provided' }, 400)
    const prompt = `You are an UPSC CSE 2027 AI assistant. Analyze this conversation and extract study intelligence. Respond ONLY in valid JSON (no markdown, no code fences).

Conversation:
${conversation.slice(0, 15000)}

Return this JSON:
{"summary":"summary in Marathi","topics":["topic1"],"weakAreas":["area"],"strongAreas":["area"],"revisionNotes":"notes in Marathi","dailyPlanUpdate":"what to study next in Marathi","currentAffairs":["ca1"],"actionItems":["step1"],"mood":"focused/struggling/confident/mixed"}`
    const text = await geminiGenerate(prompt, { temperature: 0.7, maxTokens: 4096 })
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return c.json({ error: 'Could not parse response' }, 502)
    return c.json(JSON.parse(jsonMatch[0]))
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return c.json({ error: msg }, 500)
  }
})

// ─── Google OAuth ──────────────────────────────────────
const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/documents.readonly',
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/tasks.readonly',
  'https://www.googleapis.com/auth/userinfo.email',
].join(' ')

// In-memory token store (per serverless instance)
let googleAccessToken = ''
let googleRefreshToken = ''
let googleUserEmail = ''

app.get('/google/auth', async (c) => {
  const action = c.req.query('action')
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ''

  if (action === 'status') {
    return c.json({ connected: !!googleAccessToken, email: googleUserEmail })
  }

  if (action === 'auth-url') {
    if (!GOOGLE_CLIENT_ID) return c.json({ error: 'Google OAuth not configured' }, 500)
    const origin = c.req.header('origin') || c.req.header('x-forwarded-for') || ''
    const proto = c.req.header('x-forwarded-proto') || 'https'
    const host = c.req.header('host') || ''
    const redirectUri = `${proto}://${host}/api/google/callback`
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(GOOGLE_SCOPES)}&access_type=offline&prompt=consent`
    return c.json({ url })
  }

  if (action === 'disconnect') {
    googleAccessToken = ''
    googleRefreshToken = ''
    googleUserEmail = ''
    return c.json({ ok: true })
  }

  return c.json({ error: 'Invalid action' }, 400)
})

app.get('/google/callback', async (c) => {
  const code = c.req.query('code')
  if (!code) return c.text('No authorization code')

  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ''
  const proto = c.req.header('x-forwarded-proto') || 'https'
  const host = c.req.header('host') || ''
  const redirectUri = `${proto}://${host}/api/google/callback`

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code, client_id: GOOGLE_CLIENT_ID, client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri, grant_type: 'authorization_code',
      }),
    })
    const tokenData = await tokenRes.json()
    if (tokenData.error) return c.text(`Token error: ${tokenData.error_description}`)
    googleAccessToken = tokenData.access_token
    googleRefreshToken = tokenData.refresh_token || ''
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${googleAccessToken}` },
    })
    const userData = await userRes.json()
    googleUserEmail = userData.email || ''

    return c.html(`<script>window.opener?.postMessage({type:'google-auth-success',email:'${googleUserEmail}'});window.close();document.body.innerHTML='<h2>Connected! You can close this window.</h2>'</script>`)
  } catch (err) {
    return c.text('Callback error')
  }
})

app.get('/google/data', async (c) => {
  if (!googleAccessToken) return c.json({ error: 'Not connected' }, 401)
  const type = c.req.query('type')
  const headers = { Authorization: `Bearer ${googleAccessToken}` }

  try {
    if (type === 'calendar') {
      const now = new Date().toISOString()
      const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now}&maxResults=20&singleEvents=true&orderBy=startTime`, { headers })
      const data = await res.json()
      return c.json(data)
    }
    if (type === 'docs') {
      const res = await fetch('https://docs.google.com/document/u/0/?usp=manage', { headers, redirect: 'follow' })
      const driveRes = await fetch('https://www.googleapis.com/drive/v3/files?q=mimeType%3D%27application%2Fvnd.google-apps.document%27&fields=files(id%2Cname%2CmodifiedTime)&pageSize=20', { headers })
      const data = await driveRes.json()
      return c.json(data)
    }
    if (type === 'sheets') {
      const res = await fetch('https://www.googleapis.com/drive/v3/files?q=mimeType%3D%27application%2Fvnd.google-apps.spreadsheet%27&fields=files(id%2Cname%2CcreatedTime)&pageSize=20', { headers })
      const data = await res.json()
      return c.json(data)
    }
    return c.json({ error: 'Invalid type' }, 400)
  } catch (err) {
    return c.json({ error: 'Failed to fetch data' }, 500)
  }
})

app.post('/google/data', async (c) => {
  if (!googleAccessToken) return c.json({ error: 'Not connected' }, 401)
  try {
    const body = await c.req.json()
    return c.json({ count: 0, type: body.type, items: [], timestamp: new Date().toISOString() })
  } catch (err) {
    return c.json({ error: 'Sync failed' }, 500)
  }
})

export default app
