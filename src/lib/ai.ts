import type { TaskAnswers, TaskDefinition } from '../types/task'
import { fillPromptTemplate } from './prompt'

export type GenerateResult = {
  text: string
  usedDemo: boolean
}

export async function generateHelp(
  task: TaskDefinition,
  answers: TaskAnswers,
): Promise<GenerateResult> {
  const prompt = fillPromptTemplate(task, answers)
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined

  if (apiKey) {
    try {
      const text = await callOpenAI(apiKey, prompt, task.safety)
      return { text, usedDemo: false }
    } catch (err) {
      console.warn('OpenAI failed, falling back to demo:', err)
      return { text: demoGenerate(task, answers, prompt), usedDemo: true }
    }
  }

  // Simulate a short think time so the UI feels intentional
  await new Promise((r) => setTimeout(r, 700))
  return { text: demoGenerate(task, answers, prompt), usedDemo: true }
}

async function callOpenAI(apiKey: string, prompt: string, safety: TaskDefinition['safety']): Promise<string> {
  const system = [
    'You are Daywise, a careful everyday helper for older adults in the UK.',
    'Write in plain English, short sentences, warm and respectful.',
    'Never claim to be a doctor or lawyer.',
    safety === 'health' ? 'Include a brief reminder this is not medical advice.' : '',
    safety === 'money' ? 'Remind them to check figures and dates carefully.' : '',
    safety === 'legal' ? 'Remind them this is not legal advice.' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.5,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: prompt },
      ],
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`OpenAI error ${res.status}: ${body}`)
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[]
  }
  const text = data.choices?.[0]?.message?.content?.trim()
  if (!text) throw new Error('Empty response from OpenAI')
  return text
}

function demoGenerate(task: TaskDefinition, answers: TaskAnswers, _prompt: string): string {
  const str = (key: string) => {
    const v = answers[key]
    if (Array.isArray(v)) return v.join(', ')
    return (v as string) || ''
  }

  switch (task.id) {
    case 'write-message':
      return [
        `Dear ${str('who') || 'friend'},`,
        '',
        draftFromNotes(str('about'), str('tone')),
        '',
        'With kind regards,',
        '[Your name]',
        '',
        '—',
        'Demo mode: add VITE_OPENAI_API_KEY in a .env file for fuller AI drafts.',
      ].join('\n')

    case 'explain-letter':
      return [
        'In plain English',
        '',
        `This looks like a ${str('docType') || 'document'}. Here is a careful reading of what you shared:`,
        '',
        `• Main point: ${firstSentence(str('content')) || 'Please add more of the text so we can explain it better.'}`,
        '• What you may need to do: Check any date, amount, or reply-by line in the original.',
        '• Tip: Keep the original letter. If money is involved, confirm figures with the sender or a trusted person.',
        '',
        'Please double-check amounts, dates, and account details. A computer helper can make mistakes.',
        '',
        '—',
        'Demo mode: with an API key, Daywise will explain the full wording in more detail.',
      ].join('\n')

    case 'shopping-list':
      return [
        'Your shopping list',
        '',
        ...listFromBrainDump(str('needs')),
        str('extras') ? `\nNotes: ${str('extras')}` : '',
        '',
        '—',
        'Demo mode: with an API key, items are grouped by shop aisle automatically.',
      ]
        .filter(Boolean)
        .join('\n')

    case 'doctor-questions':
      return [
        'For your appointment',
        '',
        'Summary you can read out:',
        `"${firstSentence(str('reason')) || 'I would like to talk about my concern.'}${str('worries') ? ` I am especially worried about: ${firstSentence(str('worries'))}` : ''}"`,
        '',
        'Questions to ask:',
        '1. What do you think is going on?',
        '2. What tests or checks do I need, if any?',
        '3. What should I watch for at home?',
        '4. Is there anything I should stop or start doing?',
        '5. When should I come back if things do not improve?',
        '',
        'Take with you: glasses, medication list, appointment letter.',
        '',
        'This is not medical advice. Please check anything important with your doctor or pharmacist.',
      ].join('\n')

    case 'life-story':
      return [
        `A memory from ${str('when') || 'years ago'}`,
        '',
        str('people') ? `With ${str('people')}.` : '',
        '',
        polishMemory(str('memory')),
        '',
        '—',
        'Demo mode: with an API key, this becomes a fuller short story in your voice.',
      ]
        .filter(Boolean)
        .join('\n')

    case 'tech-howto':
      return [
        `Steps for your ${labelDevice(str('device'))}`,
        '',
        `You asked: ${str('goal') || '…'}`,
        '',
        '1. Unlock your device and open the Home screen.',
        '2. Open Settings (gear icon) — or the app you need for this task.',
        '3. Look for a search box at the top and type a key word from your goal (for example “text size” or “Zoom”).',
        '4. Tap the matching result and follow the on-screen switches.',
        '5. If you get stuck, note the screen name you are on and ask a relative, or try “Something else” in Daywise with that detail.',
        '',
        '—',
        'Demo mode: with an API key, steps are tailored more precisely to your device and goal.',
      ].join('\n')

    case 'rewrite-kinder':
      return [
        rewriteDemo(str('original'), str('goal')),
        '',
        '—',
        'Demo mode: with an API key, rewrites stay closer to your exact words.',
      ].join('\n')

    case 'something-else':
    default:
      return [
        'Here is a starting point for your request:',
        '',
        `"${str('request') || str('about') || '…'}"`,
        '',
        'Suggested next steps:',
        '1. Write down the outcome you want in one sentence.',
        '2. List any dates, names, or papers you already have.',
        '3. If this is about health, money, or legal matters, check the important bits with a trusted person.',
        '',
        'Try a ready-made task on the home screen if one fits — or ask again with a little more detail.',
        '',
        '—',
        'Demo mode is on. Add VITE_OPENAI_API_KEY to .env for richer answers.',
      ].join('\n')
  }
}

function firstSentence(text: string): string {
  const t = text.trim().replace(/\s+/g, ' ')
  if (!t) return ''
  const m = t.match(/^[^.!?]+[.!?]?/)
  return m ? m[0].trim() : t.slice(0, 160)
}

function draftFromNotes(notes: string, tone: string): string {
  const body = notes.trim() || 'I hope you are well. I wanted to get in touch about something important to me.'
  if (tone === 'firm') {
    return `I am writing to raise the following clearly and respectfully.\n\n${body}\n\nI would be grateful for a clear reply at your earliest convenience.`
  }
  if (tone === 'polite') {
    return `I hope you are well. I am writing regarding the following.\n\n${body}\n\nThank you for your time and help.`
  }
  return `I hope this finds you well. I wanted to share a few thoughts.\n\n${body}\n\nLooking forward to hearing from you.`
}

function listFromBrainDump(text: string): string[] {
  const parts = text
    .split(/[,;\n]| and /i)
    .map((p) => p.trim())
    .filter(Boolean)
  if (!parts.length) return ['• (Add items by speaking or typing)']
  return parts.map((p) => `• ${p.charAt(0).toUpperCase()}${p.slice(1)}`)
}

function polishMemory(text: string): string {
  const t = text.trim()
  if (!t) return 'Tell the memory in your own words, and we will shape it into a short story.'
  return t.endsWith('.') ? t : `${t}.`
}

function labelDevice(device: string): string {
  const map: Record<string, string> = {
    iphone: 'iPhone',
    ipad: 'iPad',
    android: 'Android phone',
    'android-tablet': 'Android tablet',
    unsure: 'phone or tablet',
  }
  return map[device] || 'device'
}

function rewriteDemo(original: string, goal: string): string {
  const t = original.trim() || 'Please add your original words.'
  if (goal === 'shorter') return t.split(/[.!?]/).filter(Boolean).slice(0, 2).join('. ').trim() + '.'
  if (goal === 'kinder') return `I hope you are well. ${t} Thank you for understanding.`
  if (goal === 'firmer') return `I need to be clear about this. ${t} I would appreciate a prompt response.`
  return t
}
