export interface ISurvey {
  question: string;
  answer?: string;
  priority: 'required' | 'optional';
}
