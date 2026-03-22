export type IntervalUnit = 'ms' | 's' | 'm' | 'cpm';
export type ClickType = 'left' | 'right' | 'double';

export interface ClickerConfig {
  id?: string;
  name?: string;
  interval: number;
  unit: IntervalUnit;
  clickType: ClickType;
  repeatCount: number;
  useLimit: boolean;
  useDuration: boolean;
  duration: number; // in seconds
  startDelay: number; // countdown before start
  randomize: boolean;
  minInterval: number;
  maxInterval: number;
  useCoordinates: boolean;
  x: number;
  y: number;
  jitterX: number;
  jitterY: number;
  soundEnabled: boolean;
  rippleEnabled: boolean;
}

export interface SessionLog {
  id: string;
  timestamp: number;
  clicks: number;
  duration: number;
  configName: string;
}
