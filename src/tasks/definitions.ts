import type { TaskDefinition } from '../types/task'

/**
 * Add a new task by appending an object here.
 * No new screens needed — the runner reads these definitions.
 */
export const taskDefinitions: TaskDefinition[] = [
  {
    id: 'write-message',
    title: 'Write a message',
    shortDescription: 'Draft a letter, email, or text in the tone you want.',
    category: 'Communicate',
    icon: '✉',
    safety: 'none',
    featured: true,
    inputs: [
      {
        id: 'channel',
        type: 'singleChoice',
        label: 'What kind of message?',
        required: true,
        options: [
          { value: 'letter', label: 'Letter' },
          { value: 'email', label: 'Email' },
          { value: 'text', label: 'Text message' },
        ],
      },
      {
        id: 'who',
        type: 'shortText',
        label: 'Who is it for?',
        placeholder: 'e.g. my granddaughter, Dr Patel, the council',
        required: true,
      },
      {
        id: 'tone',
        type: 'singleChoice',
        label: 'What tone should it have?',
        required: true,
        options: [
          { value: 'warm', label: 'Warm and friendly' },
          { value: 'polite', label: 'Polite and clear' },
          { value: 'firm', label: 'Firm but respectful' },
        ],
      },
      {
        id: 'about',
        type: 'longText',
        label: 'What do you want to say?',
        helpText: 'Speak or type the main points. We will draft the wording.',
        placeholder: 'Tell us the main points…',
        required: true,
      },
    ],
    promptTemplate: `You help an older adult draft a message. Write a {{channel}} to {{who}} in a {{tone}} tone.
Use their notes below. Keep language plain, kind, and clear. UK English. Do not add a subject line unless it is an email.
Notes from the user:
{{about}}`,
    resultActions: ['readAloud', 'save', 'share', 'regenerate'],
  },
  {
    id: 'explain-letter',
    title: 'Explain this letter',
    shortDescription: 'Turn a letter, bill, or leaflet into plain English.',
    category: 'Understand',
    icon: '📄',
    safety: 'money',
    featured: true,
    inputs: [
      {
        id: 'docType',
        type: 'singleChoice',
        label: 'What is it?',
        required: true,
        options: [
          { value: 'letter', label: 'Letter' },
          { value: 'bill', label: 'Bill or statement' },
          { value: 'leaflet', label: 'Leaflet or notice' },
          { value: 'other', label: 'Something else' },
        ],
      },
      {
        id: 'photo',
        type: 'photo',
        label: 'Take a photo of it (optional)',
        helpText: 'Or skip and type or speak the words on the next screen.',
        required: false,
      },
      {
        id: 'content',
        type: 'longText',
        label: 'What does it say?',
        helpText: 'Speak the important parts, or type them. If you took a photo, add any extra details here.',
        placeholder: 'Paste or speak the text…',
        required: true,
      },
    ],
    promptTemplate: `You help an older adult understand a {{docType}}.
Explain in plain UK English:
1) What this is about in one short sentence
2) What they are being asked to do (if anything)
3) Any dates or deadlines
4) Words or jargon in simpler words
Be calm and clear. If money or legal details appear, say they should check with a trusted person or the organisation if unsure.
Do not invent facts that are not in the text.
Text / notes:
{{content}}
Photo attached: {{photo}}`,
    resultActions: ['readAloud', 'save', 'share', 'regenerate'],
  },
  {
    id: 'shopping-list',
    title: 'Make a shopping list',
    shortDescription: 'Say what you need — get a clear list.',
    category: 'Daily life',
    icon: '🛒',
    safety: 'none',
    featured: true,
    inputs: [
      {
        id: 'needs',
        type: 'longText',
        label: 'What do you need?',
        helpText: 'Speak freely — milk, bread, things running out, meals you want to cook.',
        placeholder: 'Milk, bread, something for dinner…',
        required: true,
      },
      {
        id: 'extras',
        type: 'multiChoice',
        label: 'Any extras to remember?',
        required: false,
        options: [
          { value: 'fridge', label: 'Check the fridge first' },
          { value: 'pharmacy', label: 'Include pharmacy / toiletries' },
          { value: 'budget', label: 'Keep it simple and low-cost' },
        ],
      },
    ],
    promptTemplate: `Turn this into a clear shopping list for an older adult in the UK.
Group by shop area (e.g. Fruit & veg, Dairy, Cupboard, Other). Use short bullet points. No chatter.
User said they need:
{{needs}}
Extras: {{extras}}`,
    resultActions: ['readAloud', 'save', 'share', 'regenerate'],
  },
  {
    id: 'doctor-questions',
    title: 'Prepare for the doctor',
    shortDescription: 'Prepare clear questions before an appointment.',
    category: 'Health',
    icon: '🩺',
    safety: 'health',
    featured: true,
    inputs: [
      {
        id: 'reason',
        type: 'longText',
        label: 'What is the appointment about?',
        helpText: 'Symptoms, a follow-up, test results — speak in your own words.',
        required: true,
      },
      {
        id: 'worries',
        type: 'longText',
        label: 'What worries you most?',
        required: false,
        placeholder: 'Optional…',
      },
    ],
    promptTemplate: `Help an older adult prepare for a GP appointment in the UK.
From their notes, write:
1) A short plain summary they can read to the receptionist or doctor
2) 5–8 clear questions to ask
3) A short checklist of what to take (e.g. medication list, glasses)
Do NOT diagnose or suggest medicines. Remind them this is not medical advice.
Appointment about: {{reason}}
Worries: {{worries}}`,
    resultActions: ['readAloud', 'save', 'share', 'regenerate'],
  },
  {
    id: 'life-story',
    title: 'Tell a life story',
    shortDescription: 'Speak a memory — we turn it into a short story.',
    category: 'Family & stories',
    icon: '📖',
    safety: 'none',
    featured: true,
    inputs: [
      {
        id: 'when',
        type: 'shortText',
        label: 'When was this roughly?',
        placeholder: 'e.g. when I was 20, the 1960s, last Christmas',
        required: true,
      },
      {
        id: 'people',
        type: 'shortText',
        label: 'Who was there?',
        required: false,
        placeholder: 'Optional…',
      },
      {
        id: 'memory',
        type: 'longText',
        label: 'Tell the memory',
        helpText: 'Speak it as you remember. We will shape it into a short piece of writing.',
        required: true,
      },
    ],
    promptTemplate: `Turn this memory into a warm, readable short life-story snippet (150–250 words) for an older adult to share with family.
Keep their voice and facts. UK English. Do not invent major events.
When: {{when}}
People: {{people}}
Memory: {{memory}}`,
    resultActions: ['readAloud', 'save', 'share', 'regenerate'],
  },
  {
    id: 'tech-howto',
    title: 'Help with my phone',
    shortDescription: 'Plain step-by-step help for phones and tablets.',
    category: 'Tech help',
    icon: '📱',
    safety: 'none',
    featured: true,
    inputs: [
      {
        id: 'device',
        type: 'singleChoice',
        label: 'What device?',
        required: true,
        options: [
          { value: 'iphone', label: 'iPhone' },
          { value: 'ipad', label: 'iPad' },
          { value: 'android', label: 'Android phone' },
          { value: 'android-tablet', label: 'Android tablet' },
          { value: 'unsure', label: 'Not sure' },
        ],
      },
      {
        id: 'goal',
        type: 'longText',
        label: 'What do you want to do?',
        helpText: 'e.g. make the text bigger, join a Zoom call, find a photo',
        required: true,
      },
    ],
    promptTemplate: `Give numbered, plain-English steps for an older adult using a {{device}}.
One action per step. Avoid jargon; if you must use a word, explain it.
If you are unsure of exact menus, say so and give the usual path.
Goal: {{goal}}`,
    resultActions: ['readAloud', 'save', 'share', 'regenerate'],
  },
  {
    id: 'rewrite-kinder',
    title: 'Make my wording clearer',
    shortDescription: 'Shorten, soften, or clarify something you already wrote.',
    category: 'Communicate',
    icon: '✏️',
    safety: 'none',
    inputs: [
      {
        id: 'goal',
        type: 'singleChoice',
        label: 'What should we do?',
        required: true,
        options: [
          { value: 'shorter', label: 'Make it shorter' },
          { value: 'clearer', label: 'Make it clearer' },
          { value: 'kinder', label: 'Make it kinder' },
          { value: 'firmer', label: 'Make it firmer' },
        ],
      },
      {
        id: 'original',
        type: 'longText',
        label: 'Your original words',
        helpText: 'Paste, type, or speak what you have so far.',
        required: true,
      },
    ],
    promptTemplate: `Rewrite the user's text to make it {{goal}}. Keep their meaning. Plain UK English. Return only the rewritten text.
Original:
{{original}}`,
    resultActions: ['readAloud', 'save', 'share', 'regenerate'],
  },
  {
    id: 'something-else',
    title: 'Something else',
    shortDescription: 'Say what you need help with in your own words.',
    category: 'Other',
    icon: '💬',
    safety: 'none',
    featured: true,
    inputs: [
      {
        id: 'request',
        type: 'longText',
        label: 'What do you want help with?',
        helpText: 'Speak or type freely. There is no wrong way to ask.',
        placeholder: 'I need help with…',
        required: true,
      },
    ],
    promptTemplate: `You are a careful helper for an older adult in the UK. They asked for help with the request below.
Give a useful, plain-English response. Use short paragraphs or numbered steps when helpful.
If the topic is health, money, or legal, remind them to check important decisions with a trusted person or professional.
Do not claim to be a doctor or lawyer.
Request:
{{request}}`,
    resultActions: ['readAloud', 'save', 'share', 'regenerate'],
  },
]
