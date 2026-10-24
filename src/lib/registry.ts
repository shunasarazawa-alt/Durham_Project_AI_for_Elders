import { taskDefinitions } from '../tasks/definitions'
import { CATEGORY_ORDER, type TaskDefinition } from '../types/task'

export function getAllTasks(): TaskDefinition[] {
  return taskDefinitions
}

export function getTaskById(id: string): TaskDefinition | undefined {
  return taskDefinitions.find((t) => t.id === id)
}

export function getFeaturedTasks(): TaskDefinition[] {
  return taskDefinitions.filter((t) => t.featured)
}

export function getTasksByCategory(): { category: string; tasks: TaskDefinition[] }[] {
  const map = new Map<string, TaskDefinition[]>()
  for (const task of taskDefinitions) {
    const list = map.get(task.category) ?? []
    list.push(task)
    map.set(task.category, list)
  }

  const ordered: { category: string; tasks: TaskDefinition[] }[] = CATEGORY_ORDER.filter(
    (c) => map.has(c),
  ).map((category) => ({
    category,
    tasks: map.get(category)!,
  }))

  const known = new Set<string>(CATEGORY_ORDER)
  for (const [category, tasks] of map) {
    if (!known.has(category)) {
      ordered.push({ category, tasks })
    }
  }

  return ordered
}
