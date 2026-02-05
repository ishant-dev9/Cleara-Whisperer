
import { UserInputs, StudyPlanOutput } from '../types';

const SUBJECT_DATABASE: Record<string, {
  topics: string[];
  viva: { question: string; answer: string }[];
  mistakes: string[];
  notes: string[];
}> = {
  'Physics': {
    topics: ['Dimensional Analysis', 'Vector Addition', 'Kinematic Equations', 'Newton\'s Second Law', 'Conservation of Momentum', 'Free Body Diagrams'],
    viva: [
      { question: 'What is the physical significance of the area under a velocity-time graph?', answer: 'The area represents the total displacement of the object.' },
      { question: 'State the law of inertia.', answer: 'Every object persists in its state of rest or uniform motion unless acted upon by a net external force.' },
      { question: 'Why do we need a reference frame in mechanics?', answer: 'To describe motion relative to an observer; without it, speed and position have no absolute meaning.' }
    ],
    mistakes: ['Mixing up sine and cosine in vector components', 'Forgetting to convert units to SI (e.g., cm to m)', 'Ignoring the sign conventions in 1D motion'],
    notes: ['Focus on derivation of equations', 'Numerical practice is key', 'Always draw a clear diagram first']
  },
  'Chemistry': {
    topics: ['Mole Concept', 'Stoichiometry', 'Electronic Configuration', 'Periodic Trends', 'Chemical Bonding', 'Valence Electrons'],
    viva: [
      { question: 'Define one mole.', answer: 'The amount of substance containing exactly 6.022 x 10^23 elementary entities.' },
      { question: 'What is Electronegativity?', answer: 'The tendency of an atom to attract a shared pair of electrons in a covalent bond.' },
      { question: 'Why are Noble gases stable?', answer: 'They have a complete octet in their outermost shell.' }
    ],
    mistakes: ['Incorrect balancing of chemical equations', 'Confusing isotopes with isobars', 'Wrong orbital filling sequence (Aufbau Principle)'],
    notes: ['Learn the first 20 elements', 'Practice balanced equations', 'Understand the periodic table logic']
  },
  'Biology': {
    topics: ['Cell Structure', 'Enzymatic Reactions', 'Mitosis vs Meiosis', 'Photosynthetic Pathways', 'Genetic Inheritance', 'DNA Replication'],
    viva: [
      { question: 'Why is the mitochondria called the powerhouse of the cell?', answer: 'It is the site of ATP production through aerobic respiration.' },
      { question: 'What is the function of Ribosomes?', answer: 'They are responsible for protein synthesis.' },
      { question: 'Define Osmosis.', answer: 'The movement of water from a region of higher concentration to lower concentration through a semi-permeable membrane.' }
    ],
    mistakes: ['Drawing non-proportional diagrams', 'Confusion between xylem and phloem functions', 'Incorrect spelling of biological terms'],
    notes: ['Diagrams must be neatly labeled', 'Focus on terminology', 'Flowcharts help in understanding processes']
  },
  'Math': {
    topics: ['Algebraic Identities', 'Quadratic Formulas', 'Trigonometric Ratios', 'Probability Theory', 'Set Theory', 'Calculus Fundamentals'],
    viva: [
      { question: 'What is a null set?', answer: 'A set that contains no elements.' },
      { question: 'Define the Pythagoras theorem.', answer: 'In a right-angled triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides.' },
      { question: 'What is the probability of a certain event?', answer: 'The probability is exactly 1.' }
    ],
    mistakes: ['Sign errors (+/-) during transposition', 'Incorrect application of BODMAS/PEMDAS', 'Forgetting the constant "C" in integration'],
    notes: ['Step-by-step calculation is vital', 'Memorize standard formulas', 'Verify answers by back-substitution']
  }
};

const GENERIC_FALLBACK = {
  topics: ['Conceptual Overview', 'Key Terminology', 'Process Analysis', 'Practical Applications', 'Summary & Revision'],
  viva: [
    { question: 'Explain the core objective of this chapter.', answer: 'To understand the fundamental principles and their applications in the real world.' },
    { question: 'How does this topic relate to previous chapters?', answer: 'It builds on foundational concepts to explain more complex system behaviors.' }
  ],
  mistakes: ['Skipping core definitions', 'Lack of practical examples', 'Not revising previous year questions'],
  notes: ['Summarize each section', 'Highlight keywords', 'Connect theories to examples']
};

export const generatePlan = (inputs: UserInputs): Promise<StudyPlanOutput> => {
  return new Promise((resolve) => {
    // Simulate thinking/loading time
    setTimeout(() => {
      const subjectKey = Object.keys(SUBJECT_DATABASE).find(k => 
        inputs.subject.toLowerCase().includes(k.toLowerCase())
      ) || 'Generic';

      const data = SUBJECT_DATABASE[subjectKey] || GENERIC_FALLBACK;
      
      // Calculate daily plan
      const today = new Date();
      const exam = new Date(inputs.examDate);
      const diffTime = Math.abs(exam.getTime() - today.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const dailyPlan = [];
      const topicsPerDay = Math.max(1, Math.ceil(data.topics.length / (diffDays || 1)));

      for (let i = 0; i < diffDays; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
        const taskIdx = Math.min(i * topicsPerDay, data.topics.length - 1);
        const task = data.topics[taskIdx] || "Comprehensive Revision";
        
        dailyPlan.push({
          day: i + 1,
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          task: i === diffDays - 1 ? "Final Mock Test & Chill" : task
        });
      }

      // Add personalized touch to viva
      const enhancedViva = [...data.viva];
      if (enhancedViva.length < 5) {
        enhancedViva.push(
          { question: `What is the most challenging part of ${inputs.chapterName}?`, answer: "Depends on the learner, but usually application-based questions." },
          { question: `How can we apply ${inputs.subject} in everyday life?`, answer: "By observing patterns and using scientific/logical reasoning." }
        );
      }

      // Fix: Resolve with property names that match the StudyPlanOutput interface ('question' and 'answer')
      resolve({
        microTopics: data.topics.slice(0, 6),
        dailyPlan: dailyPlan.slice(0, 14), // Limit to 2 weeks for display
        revisionNotes: data.notes,
        vivaQuestions: enhancedViva.slice(0, 5),
        commonMistakes: data.mistakes
      });
    }, 1200);
  });
};
