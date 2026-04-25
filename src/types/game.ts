export interface ResultMessage {
  text: string;
  sub: string;
}

export type Phase = 'active' | 'answered' | 'leaving' | 'gameover';
