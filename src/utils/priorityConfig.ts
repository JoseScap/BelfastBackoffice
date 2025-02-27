export type PriorityKey = 'high' | 'medium' | 'low';

export interface PriorityConfig {
  label: string;
  title: string;
  order: number;
  background: string;
  text: string;
}

export const PRIORITY_CONFIG: Record<PriorityKey, PriorityConfig> = {
  high: {
    label: 'Alta',
    title: 'Prioridad Alta',
    order: 1,
    background: 'bg-red-500',
    text: 'text-white'
  },
  medium: {
    label: 'Media',
    title: 'Prioridad Media',
    order: 2,
    background: 'bg-orange-500',
    text: 'text-white'
  },
  low: {
    label: 'Baja',
    title: 'Prioridad Baja',
    order: 3,
    background: 'bg-success-500',
    text: 'text-white'
  }
} as const;

export const getPriorityConfig = (priority: PriorityKey): PriorityConfig => {
  return PRIORITY_CONFIG[priority];
};

export const getPriorityColors = (priority: PriorityKey): string => {
  const { background, text } = PRIORITY_CONFIG[priority];
  return `${background} ${text}`;
}; 