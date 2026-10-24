import type { TaskAnswers, TaskDefinition } from '../types/task'

export function fillPromptTemplate(task: TaskDefinition, answers: TaskAnswers): string {
  return task.promptTemplate.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = answers[key]
    if (value == null || value === '') return '(not provided)'
    if (Array.isArray(value)) {
      return value.length ? value.join(', ') : '(none)'
    }
    if (typeof value === 'string' && value.startsWith('data:image')) {
      return '(a photo was attached)'
    }
    return String(value)
  })
}

export function safetyMessage(safety: TaskDefinition['safety']): string | null {
  switch (safety) {
    case 'health':
      return 'This is not medical advice. Please check anything important with your doctor or pharmacist.'
    case 'legal':
      return 'This is not legal advice. Please check important decisions with a trusted person or adviser.'
    case 'money':
      return 'Please double-check amounts, dates, and account details. A computer helper can make mistakes.'
    default:
      return null
  }
}
