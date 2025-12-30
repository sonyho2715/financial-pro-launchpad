'use client';

import { useState } from 'react';
import { ClipboardCheck, AlertTriangle, CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
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
      // Calculate final result
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
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'mixed':
        return <AlertTriangle className="w-16 h-16 text-yellow-500" />;
      case 'warning':
        return <AlertTriangle className="w-16 h-16 text-orange-500" />;
      case 'recruiting_mill':
        return <XCircle className="w-16 h-16 text-red-500" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'professional':
        return 'from-green-500 to-emerald-600';
      case 'mixed':
        return 'from-yellow-500 to-amber-600';
      case 'warning':
        return 'from-orange-500 to-red-500';
      case 'recruiting_mill':
        return 'from-red-600 to-red-800';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (showResults && result) {
    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Results Header */}
        <div className={`bg-gradient-to-r ${getCategoryColor(result.category)} px-6 py-8 text-white text-center`}>
          <div className="flex justify-center mb-4">
            {getCategoryIcon(result.category)}
          </div>
          <h2 className="text-2xl font-bold mb-2">{result.title}</h2>
          <p className="text-white/90">
            Score: {result.score} / {result.maxScore}
          </p>
        </div>

        {/* Results Content */}
        <div className="p-6">
          {/* Score Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Professional</span>
              <span>Recruiting Mill</span>
            </div>
            <div className="h-4 bg-gradient-to-r from-green-200 via-yellow-200 via-orange-200 to-red-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-800 rounded-full transition-all duration-500"
                style={{
                  width: '8px',
                  marginLeft: `calc(${(result.score / result.maxScore) * 100}% - 4px)`
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-gray-700">{result.description}</p>
          </div>

          {/* Recommendations */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">What You Should Do:</h3>
            <ul className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Book Promo */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 font-medium mb-2">
              Want the complete roadmap?
            </p>
            <p className="text-blue-700 text-sm">
              "The Hawaii Financial Professional's Blueprint" by Sony Ho shows you exactly how to build a client-focused practice that works for YOU, not your upline.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleRetake}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition"
            >
              <RotateCcw className="w-5 h-5" />
              Retake Quiz
            </button>
            <button
              onClick={() => onComplete?.(result)}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105"
            >
              Get Free Resources
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-6 py-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <ClipboardCheck className="w-7 h-7" />
          <h2 className="text-xl font-bold">Am I In a Recruiting Mill?</h2>
        </div>
        <p className="text-purple-100 text-sm">Honest assessment of your current organization</p>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
          </span>
          <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          {question.question}
        </h3>

        {/* Answer Options */}
        <div className="space-y-3">
          {question.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(answer.score)}
              className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all text-left group"
            >
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 group-hover:bg-purple-200 rounded-full font-semibold text-gray-600 group-hover:text-purple-700 transition">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-gray-700 group-hover:text-gray-900">
                {answer.text}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          Your answers are anonymous and not stored until you choose to get your results.
        </p>
      </div>
    </div>
  );
}
