
export interface UserInputs {
  studentClass: string;
  subject: string;
  chapterName: string;
  examDate: string;
}

export interface StudyPlanOutput {
  microTopics: string[];
  dailyPlan: { day: number; date: string; task: string }[];
  revisionNotes: string[];
  vivaQuestions: { question: string; answer: string }[];
  commonMistakes: string[];
}
