import type { SavedResult, TaskAnswers } from '../types/task'

const SAVED_KEY = 'daywise.saved'
const RECENT_KEY = 'daywise.recent'
const WEEK_KEY = 'daywise.weekHelps'

export function loadSaved(): SavedResult[] {
  try {
    const raw = localStorage.getItem(SAVED_KEY)
    return raw ? (JSON.parse(raw) as SavedResult[]) : []
  } catch {
    return []
  }
}

export function saveResult(entry: Omit<SavedResult, 'id' | 'createdAt'>): SavedResult {
  const full: SavedResult = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  const next = [full, ...loadSaved()].slice(0, 50)
  localStorage.setItem(SAVED_KEY, JSON.stringify(next))
  bumpWeekHelp()
  return full
}

export function deleteSaved(id: string): void {
  const next = loadSaved().filter((s) => s.id !== id)
  localStorage.setItem(SAVED_KEY, JSON.stringify(next))
}

export function loadRecentTaskIds(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export function pushRecentTask(taskId: string): void {
  const next = [taskId, ...loadRecentTaskIds().filter((id) => id !== taskId)].slice(0, 6)
  localStorage.setItem(RECENT_KEY, JSON.stringify(next))
}

function weekKey(): string {
  const d = new Date()
  const onejan = new Date(d.getFullYear(), 0, 1)
  const week = Math.ceil(((d.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7)
  return `${d.getFullYear()}-W${week}`
}

export function bumpWeekHelp(): void {
  const key = weekKey()
  try {
    const raw = localStorage.getItem(WEEK_KEY)
    const data = raw ? (JSON.parse(raw) as { key: string; count: number }) : { key, count: 0 }
    const count = data.key === key ? data.count + 1 : 1
    localStorage.setItem(WEEK_KEY, JSON.stringify({ key, count }))
  } catch {
    localStorage.setItem(WEEK_KEY, JSON.stringify({ key, count: 1 }))
  }
}

export function getWeekHelpCount(): number {
  try {
    const raw = localStorage.getItem(WEEK_KEY)
    if (!raw) return 0
    const data = JSON.parse(raw) as { key: string; count: number }
    return data.key === weekKey() ? data.count : 0
  } catch {
    return 0
  }
}

export type SessionPayload = {
  taskId: string
  answers: TaskAnswers
  result: string
  usedDemo: boolean
}

const SESSION_KEY = 'daywise.session'

export function setSession(payload: SessionPayload): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload))
}

export function getSession(): SessionPayload | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as SessionPayload) : null
  } catch {
    return null
  }
}
