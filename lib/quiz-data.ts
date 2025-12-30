// "Am I In a Recruiting Mill?" Quiz
// Based on warning signs from The Hawaii Financial Professional's Blueprint

export interface QuizAnswer {
  text: string;
  score: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  answers: QuizAnswer[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "What does your upline talk about most in meetings?",
    answers: [
      { text: "Client needs, product knowledge, and sales skills", score: 0 },
      { text: "A mix of selling and team building", score: 1 },
      { text: "Income potential and success stories", score: 2 },
      { text: "Recruiting new agents and building your downline", score: 3 },
    ]
  },
  {
    id: 2,
    question: "Were you encouraged to buy a policy on yourself when you joined?",
    answers: [
      { text: "No, it wasn't mentioned", score: 0 },
      { text: "It was suggested as an option", score: 1 },
      { text: "Yes, strongly encouraged as 'believing in the product'", score: 2 },
      { text: "Yes, it felt almost required to get started", score: 3 },
    ]
  },
  {
    id: 3,
    question: "How much of your training focuses on recruiting vs. selling?",
    answers: [
      { text: "Almost all selling, minimal recruiting discussion", score: 0 },
      { text: "Mostly selling, some recruiting tips", score: 1 },
      { text: "About 50/50 between selling and recruiting", score: 2 },
      { text: "Mostly recruiting, selling seems secondary", score: 3 },
    ]
  },
  {
    id: 4,
    question: "How are top performers recognized at your company events?",
    answers: [
      { text: "Based on client satisfaction and retention", score: 0 },
      { text: "Based on personal sales production", score: 1 },
      { text: "Mix of sales and team growth", score: 2 },
      { text: "Primarily for team size and recruiting numbers", score: 3 },
    ]
  },
  {
    id: 5,
    question: "What happens to your commission when you recruit someone?",
    answers: [
      { text: "Nothing - I earn from my own sales only", score: 0 },
      { text: "Small training bonus for mentoring", score: 1 },
      { text: "I earn overrides on their production", score: 2 },
      { text: "Multiple levels of overrides - the more I recruit, the more I earn", score: 3 },
    ]
  },
  {
    id: 6,
    question: "How quickly were you pushed to get your warm market list?",
    answers: [
      { text: "Not pushed - focused on learning first", score: 0 },
      { text: "Mentioned as one prospecting option", score: 1 },
      { text: "Asked to write 100+ names in first week", score: 2 },
      { text: "Required before I could even start training", score: 3 },
    ]
  },
  {
    id: 7,
    question: "What's the main way your organization generates leads?",
    answers: [
      { text: "Company-provided leads or marketing systems", score: 0 },
      { text: "Mix of company leads and personal prospecting", score: 1 },
      { text: "Mostly personal network and referrals", score: 2 },
      { text: "Almost entirely warm market - friends, family, everyone you know", score: 3 },
    ]
  },
  {
    id: 8,
    question: "How transparent is your organization about the failure rate of new agents?",
    answers: [
      { text: "Very transparent - they discuss realistic expectations", score: 0 },
      { text: "Somewhat transparent - mentioned it's not for everyone", score: 1 },
      { text: "Avoided the topic - focused on success stories only", score: 2 },
      { text: "Made it sound like everyone succeeds if they try hard enough", score: 3 },
    ]
  },
  {
    id: 9,
    question: "When you're struggling, what advice do you typically receive?",
    answers: [
      { text: "Specific skill coaching and sales training", score: 0 },
      { text: "Review of your process and pipeline", score: 1 },
      { text: "'Trust the process' and motivational talks", score: 2 },
      { text: "'You need to recruit more' or 'You're not coachable'", score: 3 },
    ]
  },
  {
    id: 10,
    question: "How would you describe your relationship with your upline?",
    answers: [
      { text: "Mentor focused on my professional development", score: 0 },
      { text: "Supportive manager who helps with sales", score: 1 },
      { text: "Mostly concerned about my production numbers", score: 2 },
      { text: "Feels like they benefit more from my work than I do", score: 3 },
    ]
  },
];

export interface QuizResult {
  score: number;
  maxScore: number;
  category: 'professional' | 'mixed' | 'warning' | 'recruiting_mill';
  title: string;
  description: string;
  recommendations: string[];
}

export function getQuizResult(score: number): QuizResult {
  const maxScore = QUIZ_QUESTIONS.length * 3; // 30 points max

  if (score <= 8) {
    return {
      score,
      maxScore,
      category: 'professional',
      title: "Professional Practice Environment",
      description: "Great news! Your organization appears to be focused on building professional advisors. The emphasis seems to be on client service, skill development, and sustainable business practices.",
      recommendations: [
        "Continue developing your sales skills and product knowledge",
        "Build deep client relationships for long-term success",
        "Focus on becoming a trusted advisor in your community",
        "Consider getting additional certifications to expand your services",
      ]
    };
  } else if (score <= 16) {
    return {
      score,
      maxScore,
      category: 'mixed',
      title: "Mixed Signals",
      description: "Your organization shows some positive signs but also some areas of concern. There may be recruiting pressure mixed with legitimate training. Evaluate carefully whether this environment supports YOUR success.",
      recommendations: [
        "Pay attention to whether your success is tied to recruiting or client service",
        "Ask direct questions about income sources at higher levels",
        "Track your actual income vs. what was projected",
        "Consider whether you're building YOUR practice or someone else's downline",
        "Read Chapter 2 of the book: 'The Two Paths'",
      ]
    };
  } else if (score <= 24) {
    return {
      score,
      maxScore,
      category: 'warning',
      title: "Warning Signs Present",
      description: "Your responses indicate significant characteristics of a recruiting-focused organization. The emphasis appears to be more on building teams than building client relationships. This model benefits those at the top more than new agents.",
      recommendations: [
        "Seriously evaluate whether this model serves YOUR interests",
        "Calculate your actual return on time and money invested",
        "Research independent options where you keep more of your commission",
        "Talk to agents who have left similar organizations",
        "Read the full book: 'The Hawaii Financial Professional's Blueprint'",
      ]
    };
  } else {
    return {
      score,
      maxScore,
      category: 'recruiting_mill',
      title: "Recruiting Mill Characteristics",
      description: "Your responses strongly indicate a recruiting-focused organization. These models typically have high turnover, with most income flowing to those who recruited early. Your success is likely tied more to recruiting than to serving clients.",
      recommendations: [
        "Your license is YOURS - it transfers with you",
        "Explore independent IMOs and broker-dealers",
        "Calculate how much you've spent vs. earned",
        "Don't let sunk cost fallacy keep you in a bad situation",
        "You can build a REAL practice - the book shows you how",
        "Consider: Are you building a career or funding someone else's?",
      ]
    };
  }
}
