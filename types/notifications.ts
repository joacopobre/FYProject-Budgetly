export type NotificationType = 'WARNING' | 'INFO' | 'SUCCESS'

export type Notification = {
  id: string
  message: string
  type: NotificationType
  read: boolean
  createdAt: string
}
