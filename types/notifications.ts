export interface Student_Notification {
  id: number;
  name: string;
  level: 'red' | 'yellow' | 'green';
  message: string;
  timestamp: string;
  read: boolean;
}