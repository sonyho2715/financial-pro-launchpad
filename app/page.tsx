'use client';

import { useState } from 'react';
import { Calculator, ClipboardCheck, BookOpen, ArrowRight, CheckCircle, Play, ChevronDown } from 'lucide-react';
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

  const scrollToTools = () => {
    document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FP</span>
            </div>
            <span className="font-semibold text-gray-900">Financial Pro</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <button onClick={() => setActiveTool('calculator')} className="text-gray-600 hover:text-gray-900 transition">Calculator</button>
            <button onClick={() => setActiveTool('quiz')} className="text-gray-600 hover:text-gray-900 transition">Quiz</button>
            <a href="#book" className="text-gray-600 hover:text-gray-900 transition">Book</a>
          </div>
          <button
            onClick={scrollToTools}
            className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section - Full Screen */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=2400&q=80"
            alt="Professional business setting"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-white" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <BookOpen className="w-4 h-4" />
            From "The Hawaii Financial Professional's Blueprint"
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold text-gray-900 tracking-tight mb-6">
            Build Your
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Real Practice
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            Free professional tools to discover your earning potential and evaluate your organization.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setActiveTool('calculator')}
              className="group flex items-center justify-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-800 transition-all"
            >
              <Calculator className="w-5 h-5" />
              Income Calculator
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setActiveTool('quiz')}
              className="group flex items-center justify-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-medium border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              <ClipboardCheck className="w-5 h-5" />
              Take the Quiz
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToTools}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 hover:text-gray-600 transition animate-bounce"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {activeTool === 'none' ? (
            <>
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6">
                  Professional Tools
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Make informed decisions about your career with data-driven insights.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Calculator Card */}
                <div
                  onClick={() => setActiveTool('calculator')}
                  className="group relative bg-white rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80"
                      alt="Financial calculations"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm mb-3">
                        <Calculator className="w-4 h-4" />
                        Calculator
                      </div>
                      <h3 className="text-2xl md:text-3xl font-semibold text-white">
                        Income Calculator
                      </h3>
                    </div>
                  </div>
                  <div className="p-8">
                    <p className="text-gray-600 mb-6">
                      See realistic income projections based on your actual activity levels. Built with real commission rates and industry data.
                    </p>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center gap-3 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        Year 1, 3, and 5 projections
                      </li>
                      <li className="flex items-center gap-3 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        Multiple product types
                      </li>
                      <li className="flex items-center gap-3 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        Realistic commission rates
                      </li>
                    </ul>
                    <div className="flex items-center text-blue-600 font-medium group-hover:gap-3 gap-2 transition-all">
                      Calculate Now <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Quiz Card */}
                <div
                  onClick={() => setActiveTool('quiz')}
                  className="group relative bg-white rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80"
                      alt="Professional evaluation"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm mb-3">
                        <ClipboardCheck className="w-4 h-4" />
                        Assessment
                      </div>
                      <h3 className="text-2xl md:text-3xl font-semibold text-white">
                        Recruiting Mill Quiz
                      </h3>
                    </div>
                  </div>
                  <div className="p-8">
                    <p className="text-gray-600 mb-6">
                      Discover if your organization is helping or hurting your career. 10 honest questions with personalized recommendations.
                    </p>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center gap-3 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        10 targeted questions
                      </li>
                      <li className="flex items-center gap-3 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        Instant results
                      </li>
                      <li className="flex items-center gap-3 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        Personalized advice
                      </li>
                    </ul>
                    <div className="flex items-center text-indigo-600 font-medium group-hover:gap-3 gap-2 transition-all">
                      Take Quiz <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="max-w-4xl mx-auto">
              <button
                onClick={() => setActiveTool('none')}
                className="mb-8 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition font-medium"
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
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-5xl md:text-6xl font-semibold text-gray-900 mb-2">15+</div>
              <div className="text-gray-600">Years of Industry Experience</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-semibold text-gray-900 mb-2">19</div>
              <div className="text-gray-600">Comprehensive Chapters</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-semibold text-gray-900 mb-2">100%</div>
              <div className="text-gray-600">Hawaii-Focused Content</div>
            </div>
          </div>
        </div>
      </section>

      {/* Book Section */}
      <section id="book" className="py-32 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=2400&q=80"
            alt="Hawaii landscape"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/95 to-gray-900/80" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 px-4 py-2 rounded-full text-sm mb-8">
                <BookOpen className="w-4 h-4" />
                The Complete Guide
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 leading-tight">
                The Hawaii Financial Professional's Blueprint
              </h2>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                By <span className="text-white font-medium">Sony Ho</span>. 15 years of industry experience distilled into a complete guide for building a client-focused practice in Hawaii.
              </p>

              <ul className="space-y-4 mb-10">
                {[
                  'Escape the recruiting model trap',
                  'Build a real, sustainable practice',
                  'Hawaii-specific strategies and scripts',
                  'Cultural community playbooks'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-200">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  setModalSource('income_calculator');
                  setResultData({ bookInterest: true });
                  setShowModal(true);
                }}
                className="group inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-100 transition-all"
              >
                Get Free Chapters
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl blur-2xl opacity-30" />
                <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-12 text-center border border-gray-700">
                  <BookOpen className="w-32 h-32 mx-auto mb-6 text-gray-600" />
                  <div className="text-2xl font-semibold mb-2">Complete Edition</div>
                  <div className="text-gray-400">19 Chapters + Templates + Scripts</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial / Quote Section */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="relative">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-9xl text-gray-100 font-serif">"</div>
            <blockquote className="relative text-2xl md:text-3xl text-gray-900 font-light leading-relaxed mb-8">
              Stop chasing recruits. Start building relationships. Your practice should serve your clients, not your upline.
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                alt="Sony Ho"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="text-left">
                <div className="font-medium text-gray-900">Sony Ho</div>
                <div className="text-gray-500 text-sm">Author & Financial Professional</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6">
            Ready to take control of your career?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Use our free tools to make informed decisions about your future in financial services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setActiveTool('calculator');
                document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition"
            >
              <Calculator className="w-5 h-5" />
              Calculate Your Income
            </button>
            <button
              onClick={() => {
                setActiveTool('quiz');
                document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-medium border-2 border-gray-200 hover:border-gray-300 transition"
            >
              <ClipboardCheck className="w-5 h-5" />
              Evaluate Your Organization
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FP</span>
              </div>
              <span className="font-semibold text-gray-900">Financial Pro Launchpad</span>
            </div>
            <div className="text-gray-500 text-sm">
              By Sony Ho. Helping Hawaii financial professionals build real practices.
            </div>
          </div>
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
