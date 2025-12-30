'use client';

import { useState } from 'react';
import { ClipboardCheck, AlertTriangle, CheckCircle, XCircle, ArrowRight, RotateCcw, Shield, AlertOctagon } from 'lucide-react';
import { QUIZ_QUESTIONS, getQuizResult, type QuizResult } from '@/lib/quiz-data';

interface RecruitingMillQuizProps {
  onComplete?: (result: QuizResult) => void;
}

export default function RecruitingMillQuiz({ onComplete }: RecruitingMillQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100;
  const question = QUIZ_QUESTIONS[currentQuestion];

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const totalScore = newAnswers.reduce((sum, s) => sum + s, 0);
      const quizResult = getQuizResult(totalScore);
      setResult(quizResult);
      setShowResults(true);
      if (onComplete) {
        onComplete(quizResult);
      }
    }
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setResult(null);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'professional':
        return <Shield className="w-20 h-20 text-emerald-500" />;
      case 'mixed':
        return <AlertTriangle className="w-20 h-20 text-amber-500" />;
      case 'warning':
        return <AlertOctagon className="w-20 h-20 text-orange-500" />;
      case 'recruiting_mill':
        return <XCircle className="w-20 h-20 text-red-500" />;
      default:
        return null;
    }
  };

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'professional':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-900',
          accent: 'text-emerald-600',
          badge: 'bg-emerald-100 text-emerald-700'
        };
      case 'mixed':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-900',
          accent: 'text-amber-600',
          badge: 'bg-amber-100 text-amber-700'
        };
      case 'warning':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          text: 'text-orange-900',
          accent: 'text-orange-600',
          badge: 'bg-orange-100 text-orange-700'
        };
      case 'recruiting_mill':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-900',
          accent: 'text-red-600',
          badge: 'bg-red-100 text-red-700'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-900',
          accent: 'text-gray-600',
          badge: 'bg-gray-100 text-gray-700'
        };
    }
  };

  if (showResults && result) {
    const styles = getCategoryStyles(result.category);

    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Results Header */}
        <div className={`${styles.bg} px-8 py-12 text-center border-b ${styles.border}`}>
          <div className="flex justify-center mb-6">
            {getCategoryIcon(result.category)}
          </div>
          <div className={`inline-flex items-center gap-2 ${styles.badge} px-4 py-2 rounded-full text-sm font-medium mb-4`}>
            Score: {result.score} / {result.maxScore}
          </div>
          <h2 className={`text-3xl md:text-4xl font-semibold ${styles.text}`}>{result.title}</h2>
        </div>

        {/* Results Content */}
        <div className="p-8">
          {/* Score Visualization */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-3">
              <span>Professional Practice</span>
              <span>Recruiting Mill</span>
            </div>
            <div className="relative h-3 bg-gradient-to-r from-emerald-200 via-amber-200 via-orange-200 to-red-200 rounded-full overflow-hidden">
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-900 rounded-full shadow-lg transition-all duration-500"
                style={{
                  left: `calc(${(result.score / result.maxScore) * 100}% - 8px)`
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <p className="text-gray-700 text-lg leading-relaxed">{result.description}</p>
          </div>

          {/* Recommendations */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What You Should Do</h3>
            <div className="space-y-3">
              {result.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">
                    {index + 1}
                  </div>
                  <span className="text-gray-700 pt-1">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Book Promo */}
          <div className="bg-gray-900 text-white rounded-2xl p-6 mb-8">
            <p className="font-medium mb-2 text-lg">
              Want the complete roadmap?
            </p>
            <p className="text-gray-400">
              "The Hawaii Financial Professional's Blueprint" by Sony Ho shows you exactly how to build a client-focused practice that works for YOU, not your upline.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleRetake}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-4 px-6 rounded-full transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              Retake Quiz
            </button>
            <button
              onClick={() => onComplete?.(result)}
              className="flex-1 bg-gray-900 text-white font-medium py-4 px-6 rounded-full hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-gray-900/20"
            >
              Get Free Resources
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/25">
            <ClipboardCheck className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Recruiting Mill Quiz</h2>
            <p className="text-gray-500">Honest assessment of your organization</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-600">
            Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
          </span>
          <span className="text-sm font-medium text-gray-900">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gray-900 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="p-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-8 leading-tight">
          {question.question}
        </h3>

        {/* Answer Options */}
        <div className="space-y-3">
          {question.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(answer.score)}
              className="w-full flex items-center gap-4 p-5 bg-gray-50 rounded-2xl hover:bg-gray-100 hover:shadow-md transition-all duration-200 text-left group"
            >
              <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white group-hover:bg-gray-900 group-hover:text-white rounded-xl font-semibold text-gray-600 transition-all duration-200 shadow-sm">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-gray-700 group-hover:text-gray-900 font-medium">
                {answer.text}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-5 bg-gray-50/50 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          Your answers are anonymous and not stored until you choose to get your results.
        </p>
      </div>
    </div>
  );
}
