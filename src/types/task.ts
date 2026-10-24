export type SafetyLevel = 'none' | 'health' | 'legal' | 'money'

export type FieldType =
  | 'singleChoice'
  | 'multiChoice'
  | 'shortText'
  | 'longText'
  | 'voiceText'
  | 'photo'

export type ResultAction = 'save' | 'share' | 'readAloud' | 'regenerate'

export interface TaskFieldOption {
  value: string
  label: string
}

export interface TaskField {
  id: string
  type: FieldType
  label: string
  helpText?: string
  placeholder?: string
  options?: TaskFieldOption[]
  required?: boolean
}

export interface TaskDefinition {
  id: string
  title: string
  shortDescription: string
  category: string
  icon: string
  safety: SafetyLevel
  featured?: boolean
  inputs: TaskField[]
  promptTemplate: string
  resultActions: ResultAction[]
}

export type TaskAnswers = Record<string, string | string[]>

export interface SavedResult {
  id: string
  taskId: string
  taskTitle: string
  result: string
  answers: TaskAnswers
  createdAt: string
}

export const CATEGORY_ORDER = [
  'Communicate',
  'Understand',
  'Daily life',
  'Health',
  'Family & stories',
  'Tech help',
  'Other',
] as const
