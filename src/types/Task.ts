export type Priority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  priority: Priority
  tags: string[]
  status: 'todo' | 'in-progress' | 'done'
  userId: string
}
