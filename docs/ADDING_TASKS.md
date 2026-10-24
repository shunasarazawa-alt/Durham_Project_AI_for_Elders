# Adding a task

Tasks are plain objects in `src/tasks/definitions.ts`. The app has **one generic runner** — you do not create new React pages per task.

## Schema

```ts
{
  id: 'unique-kebab-id',
  title: 'Write a message',          // shown on home + steps
  shortDescription: '…',             // one line under the title
  category: 'Communicate',           // groups on home
  icon: '✉',                         // short emoji or symbol
  safety: 'none' | 'health' | 'legal' | 'money',
  featured?: true,                   // also listed under Common tasks
  inputs: [ /* ordered steps */ ],
  promptTemplate: 'Use {{fieldId}} placeholders…',
  resultActions: ['readAloud', 'save', 'share', 'regenerate'],
}
```

### Input field types

| type           | UI                                      |
|----------------|-----------------------------------------|
| `singleChoice` | Big tap buttons (one answer)            |
| `multiChoice`  | Big tap buttons (many answers)          |
| `shortText`    | Text box + Speak                        |
| `longText`     | Larger text box + Speak                 |
| `voiceText`    | Same as longText (alias)                |
| `photo`        | Camera / file picker (optional usually) |

Each input:

```ts
{
  id: 'about',
  type: 'longText',
  label: 'What do you want to say?',
  helpText?: 'Shown under the question',
  placeholder?: '…',
  required?: true,
  options?: [{ value: 'warm', label: 'Warm and friendly' }], // for choices
}
```

### Prompt template

Use `{{fieldId}}` for each input. At run time those are replaced with the user’s answers. Photo fields become `(a photo was attached)` in the text prompt (vision can be added later).

## Checklist for a good elder task

1. Title is a **life job**, not an AI jargon phrase  
2. Prefer **choices** before open typing  
3. Every text step gets a mic automatically  
4. Set `safety` if health / money / legal  
5. Keep the prompt asking for **plain UK English** and short structure  

## Catalogue roadmap

Ready-made ideas still to encode (copy any into `definitions.ts`):

- Reply ideas for a message I received  
- Birthday / thank-you / sympathy message  
- Write to GP / council (formal)  
- Phone-call script  
- “What do they want me to do?” from a document  
- Explain medical / council jargon  
- Summarise a long article  
- Medicine list from a brain-dump (no dosing advice)  
- Meal ideas from ingredients  
- Packing list  
- Explain a bill  
- Plan a day out  
- Gift ideas  
- Explain a news story simply  
