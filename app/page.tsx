'use client';

import { useState } from 'react';
import { Calculator, ClipboardCheck, BookOpen, ArrowRight, CheckCircle } from 'lucide-react';
import IncomeCalculator from '@/components/IncomeCalculator';
import RecruitingMillQuiz from '@/components/RecruitingMillQuiz';
import LeadCaptureModal from '@/components/LeadCaptureModal';
import type { IncomeResults, IncomeInputs } from '@/lib/calculations';
import type { QuizResult } from '@/lib/quiz-data';

type ActiveTool = 'none' | 'calculator' | 'quiz';

export default function Home() {
  const [activeTool, setActiveTool] = useState<ActiveTool>('none');
  const [showModal, setShowModal] = useState(false);
  const [modalSource, setModalSource] = useState<'income_calculator' | 'recruiting_mill_quiz'>('income_calculator');
  const [resultData, setResultData] = useState<Record<string, unknown>>({});

  const handleCalculatorComplete = (results: IncomeResults, inputs: IncomeInputs) => {
    setModalSource('income_calculator');
    setResultData({ results, inputs });
    setShowModal(true);
  };

  const handleQuizComplete = (result: QuizResult) => {
    setModalSource('recruiting_mill_quiz');
    setResultData({ result });
    setShowModal(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        <div className="relative max-w-6xl mx-auto px-4 py-20 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
            <BookOpen className="w-4 h-4" />
            <span>From "The Hawaii Financial Professional's Blueprint"</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Free Tools for<br />
            <span className="text-amber-400">Insurance Professionals</span>
          </h1>

          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Discover your true earning potential and find out if your organization is helping or hurting your career.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setActiveTool('calculator')}
              className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              <Calculator className="w-5 h-5" />
              Income Calculator
            </button>
            <button
              onClick={() => setActiveTool('quiz')}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold py-4 px-8 rounded-lg transition-all border border-white/30"
            >
              <ClipboardCheck className="w-5 h-5" />
              Take the Quiz
            </button>
          </div>
        </div>
      </section>

      {/* Tool Selection Cards (when no tool is active) */}
      {activeTool === 'none' && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Choose Your Tool
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            These free tools help you make informed decisions about your career in financial services.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Calculator Card */}
            <div
              onClick={() => setActiveTool('calculator')}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
            >
              <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6 text-white">
                <Calculator className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Income Calculator</h3>
                <p className="text-blue-100">See realistic income projections based on your activity</p>
              </div>
              <div className="p-6">
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Based on real commission rates
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Projects years 1, 3, and 5
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Multiple product types
                  </li>
                </ul>
                <div className="flex items-center text-blue-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                  Calculate Now <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Quiz Card */}
            <div
              onClick={() => setActiveTool('quiz')}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
            >
              <div className="bg-gradient-to-r from-purple-500 to-indigo-700 p-6 text-white">
                <ClipboardCheck className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Recruiting Mill Quiz</h3>
                <p className="text-purple-100">Find out if your organization is helping or hurting you</p>
              </div>
              <div className="p-6">
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    10 honest questions
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Instant results
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Personalized recommendations
                  </li>
                </ul>
                <div className="flex items-center text-purple-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                  Take Quiz <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Active Tool Display */}
      {activeTool !== 'none' && (
        <section className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => setActiveTool('none')}
            className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2 transition"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Tools
          </button>

          {activeTool === 'calculator' && (
            <IncomeCalculator onComplete={handleCalculatorComplete} />
          )}

          {activeTool === 'quiz' && (
            <RecruitingMillQuiz onComplete={handleQuizComplete} />
          )}
        </section>
      )}

      {/* Book Promo Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                The Hawaii Financial Professional's Blueprint
              </h2>
              <p className="text-gray-300 mb-6">
                By <strong>Sony Ho</strong> - 15 years of industry experience distilled into a complete guide for building a client-focused practice.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-400" />
                  <span>Escape the recruiting model trap</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-400" />
                  <span>Build a real, sustainable practice</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-400" />
                  <span>Hawaii-specific strategies and scripts</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-400" />
                  <span>Cultural community playbooks</span>
                </li>
              </ul>
              <button
                onClick={() => {
                  setModalSource('income_calculator');
                  setResultData({ bookInterest: true });
                  setShowModal(true);
                }}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105"
              >
                Get Free Chapters
              </button>
            </div>
            <div className="hidden md:block">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-center">
                <BookOpen className="w-24 h-24 mx-auto mb-4 text-white/80" />
                <p className="text-xl font-bold mb-2">Complete Edition</p>
                <p className="text-blue-200">19 Chapters + Templates</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
          <p className="mb-2">
            Financial Pro Launchpad by <strong>Sony Ho</strong>
          </p>
          <p className="text-sm">
            Helping Hawaii financial professionals build real practices.
          </p>
        </div>
      </footer>

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        source={modalSource}
        resultData={resultData}
      />
    </main>
  );
}
