export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  listId: string;
  createdAt: Date;
}

export interface TaskList {
  id: string;
  name: string;
  color: string;
  icon: string;
  taskCount: number;
}

export const mockLists: TaskList[] = [
  {
    id: '1',
    name: 'Inbox',
    color: '#007AFF',
    icon: 'inbox',
    taskCount: 5,
  },
  {
    id: '2',
    name: 'Work',
    color: '#FF3B30',
    icon: 'briefcase',
    taskCount: 8,
  },
  {
    id: '3',
    name: 'Personal',
    color: '#34C759',
    icon: 'person',
    taskCount: 3,
  },
  {
    id: '4',
    name: 'Shopping',
    color: '#FF9500',
    icon: 'bag',
    taskCount: 6,
  },
  {
    id: '5',
    name: 'Health',
    color: '#AF52DE',
    icon: 'heart',
    taskCount: 2,
  },
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Review project proposal',
    description: 'Go through the new project proposal and provide feedback',
    completed: false,
    priority: 'high',
    dueDate: new Date('2024-01-15'),
    listId: '2',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '2',
    title: 'Buy groceries',
    description: 'Milk, bread, eggs, fruits',
    completed: false,
    priority: 'medium',
    dueDate: new Date('2024-01-12'),
    listId: '4',
    createdAt: new Date('2024-01-11'),
  },
  {
    id: '3',
    title: 'Schedule dentist appointment',
    completed: true,
    priority: 'low',
    listId: '5',
    createdAt: new Date('2024-01-08'),
  },
  {
    id: '4',
    title: 'Finish weekly report',
    description: 'Complete and submit the weekly progress report',
    completed: false,
    priority: 'high',
    dueDate: new Date('2024-01-14'),
    listId: '2',
    createdAt: new Date('2024-01-09'),
  },
  {
    id: '5',
    title: 'Call mom',
    completed: false,
    priority: 'medium',
    listId: '3',
    createdAt: new Date('2024-01-11'),
  },
  {
    id: '6',
    title: 'Read new book chapter',
    completed: false,
    priority: 'low',
    listId: '3',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '7',
    title: 'Organize desk',
    completed: true,
    priority: 'low',
    listId: '1',
    createdAt: new Date('2024-01-07'),
  },
  {
    id: '8',
    title: 'Plan weekend trip',
    description: 'Research destinations and book accommodation',
    completed: false,
    priority: 'medium',
    dueDate: new Date('2024-01-20'),
    listId: '3',
    createdAt: new Date('2024-01-12'),
  },
];

export const focusTasks = mockTasks.filter(task => 
  !task.completed && 
  (task.priority === 'high' || 
   (task.dueDate && new Date(task.dueDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000)))
);