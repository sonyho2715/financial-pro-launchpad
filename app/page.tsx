'use client';

import { useState } from 'react';
import {
  Calculator, ClipboardCheck, BookOpen, ArrowRight, CheckCircle, ChevronDown,
  Users, TrendingUp, Shield, Target, Zap, Award, MessageCircle, HelpCircle,
  ChevronRight, AlertTriangle, Star, Clock, DollarSign, Heart, MapPin
} from 'lucide-react';
import IncomeCalculator from '@/components/IncomeCalculator';
import RecruitingMillQuiz from '@/components/RecruitingMillQuiz';
import LeadCaptureModal from '@/components/LeadCaptureModal';
import type { IncomeResults, IncomeInputs } from '@/lib/calculations';
import type { QuizResult } from '@/lib/quiz-data';

type ActiveTool = 'none' | 'calculator' | 'quiz';

const TESTIMONIALS = [
  {
    quote: "After 3 years of struggling with the recruiting model, I finally understood why I wasn't building wealth. This book changed everything.",
    name: "Michael K.",
    role: "Life Insurance Agent",
    location: "Honolulu, HI",
    rating: 5
  },
  {
    quote: "The income calculator opened my eyes. I was leaving so much money on the table by focusing on recruiting instead of clients.",
    name: "Sarah T.",
    role: "Financial Advisor",
    location: "Maui, HI",
    rating: 5
  },
  {
    quote: "Finally, someone who understands Hawaii's unique market. The cultural community playbooks alone are worth 10x the price.",
    name: "David L.",
    role: "Insurance Professional",
    location: "Kailua, HI",
    rating: 5
  }
];

const FAQ_ITEMS = [
  {
    question: "Who is this book for?",
    answer: "This book is for insurance agents and financial professionals in Hawaii who want to build a sustainable, client-focused practice instead of chasing recruits. Whether you're new to the industry or a veteran looking to transition, you'll find actionable strategies."
  },
  {
    question: "How is the Income Calculator different from others?",
    answer: "Our calculator uses real commission rates from major carriers and factors in renewal income, which most calculators ignore. It shows you the true earning potential of a client-focused practice versus the recruiting model."
  },
  {
    question: "What makes the Recruiting Mill Quiz accurate?",
    answer: "The quiz is based on 15 years of industry experience and identifies the 10 key warning signs of organizations that prioritize recruiting over client service. It's been validated by hundreds of agents."
  },
  {
    question: "Are these tools really free?",
    answer: "Yes, completely free. We believe every financial professional deserves access to honest information about their career. The tools are designed to help you make informed decisions, regardless of whether you purchase the book."
  },
  {
    question: "What's included in the free chapters?",
    answer: "You'll receive the first 3 chapters covering: The Recruiting Model Problem, Understanding Your True Worth, and The Client-Focused Alternative. Plus, you get exclusive templates and scripts."
  }
];

const BOOK_CHAPTERS = [
  { number: 1, title: "The Recruiting Model Problem", description: "Why most agents fail in the first 2 years" },
  { number: 2, title: "Understanding Commission Structures", description: "How money really flows in insurance" },
  { number: 3, title: "The Client-Focused Alternative", description: "Building wealth through service" },
  { number: 4, title: "Hawaii's Unique Market", description: "Cultural considerations for local success" },
  { number: 5, title: "Prospecting That Works", description: "Referral-based growth strategies" },
  { number: 6, title: "The Filipino Community", description: "Cultural playbook and scripts" },
  { number: 7, title: "The Japanese Community", description: "Building trust across generations" },
  { number: 8, title: "The Chinese Community", description: "Wealth preservation conversations" },
  { number: 9, title: "Multi-Cultural Families", description: "Navigating mixed households" },
];

export default function Home() {
  const [activeTool, setActiveTool] = useState<ActiveTool>('none');
  const [showModal, setShowModal] = useState(false);
  const [modalSource, setModalSource] = useState<'income_calculator' | 'recruiting_mill_quiz'>('income_calculator');
  const [resultData, setResultData] = useState<Record<string, unknown>>({});
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
            <a href="#tools" className="text-gray-600 hover:text-gray-900 transition">Tools</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition">How It Works</a>
            <a href="#book" className="text-gray-600 hover:text-gray-900 transition">Book</a>
            <a href="#about" className="text-gray-600 hover:text-gray-900 transition">About</a>
            <a href="#faq" className="text-gray-600 hover:text-gray-900 transition">FAQ</a>
          </div>
          <button
            onClick={scrollToTools}
            className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
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

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
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

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>5 Min to Complete</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" />
              <span>15+ Years Experience</span>
            </div>
          </div>
        </div>

        <button
          onClick={scrollToTools}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 hover:text-gray-600 transition animate-bounce"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <AlertTriangle className="w-4 h-4" />
                The Industry Problem
              </div>
              <h2 className="text-4xl md:text-5xl font-semibold mb-6 leading-tight">
                87% of insurance agents fail within 5 years
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                The recruiting model prioritizes hiring new agents over serving clients.
                You're taught to recruit your friends and family, buy your own policies,
                and chase warm market leads until they run dry.
              </p>
              <div className="space-y-4">
                {[
                  "Constant pressure to recruit instead of sell",
                  "Commission splits that favor your upline",
                  "No real training on client acquisition",
                  "Burned bridges with friends and family"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-3 h-3 text-red-400" />
                    </div>
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80"
                alt="Frustrated professional"
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 rounded-2xl p-6 shadow-xl max-w-xs">
                <div className="text-4xl font-bold text-red-600 mb-2">73%</div>
                <p className="text-sm text-gray-600">of agents leave because they can't make enough money with the recruiting model</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <CheckCircle className="w-4 h-4" />
              The Solution
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6">
              There's a better way
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A client-focused practice builds real wealth through relationships, referrals, and renewals.
              No recruiting pressure. No burned bridges. Just professional service.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Client-First Approach",
                description: "Focus on solving client problems, not recruiting quotas. Build trust that generates referrals for years.",
                color: "text-red-600",
                bg: "bg-red-50"
              },
              {
                icon: TrendingUp,
                title: "Compounding Renewals",
                description: "Each policy you sell pays you year after year. By year 5, renewals can exceed your first-year commissions.",
                color: "text-green-600",
                bg: "bg-green-50"
              },
              {
                icon: Users,
                title: "Referral Engine",
                description: "Happy clients refer their friends and family. One good relationship can generate 10+ referrals over time.",
                color: "text-blue-600",
                bg: "bg-blue-50"
              }
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-3xl p-8 hover:shadow-xl transition-all duration-300">
                <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-6`}>
                  <item.icon className={`w-7 h-7 ${item.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {activeTool === 'none' ? (
            <>
              <div className="text-center mb-20">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Zap className="w-4 h-4" />
                  Free Professional Tools
                </div>
                <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6">
                  Make informed decisions
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Use these data-driven tools to understand your true earning potential
                  and evaluate whether your organization is setting you up for success.
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
                      See realistic income projections based on your actual activity levels.
                      Built with real commission rates from major carriers.
                    </p>
                    <ul className="space-y-3 mb-8">
                      {[
                        "Year 1, 3, and 5 projections",
                        "Multiple product types (Life, Annuity, Medicare)",
                        "Realistic commission rates",
                        "Renewal income calculations"
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-700">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
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
                      src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=1200&q=80"
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
                      Discover if your organization is helping or hurting your career.
                      10 honest questions based on 15 years of industry experience.
                    </p>
                    <ul className="space-y-3 mb-8">
                      {[
                        "10 targeted diagnostic questions",
                        "Instant results with scoring",
                        "Personalized recommendations",
                        "Comparison to industry standards"
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-700">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
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

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to take control of your financial services career.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Use the Free Tools",
                description: "Calculate your true earning potential and evaluate your current organization with our professional tools.",
                icon: Calculator
              },
              {
                step: "02",
                title: "Get Your Report",
                description: "Receive a personalized analysis with specific recommendations based on your situation and goals.",
                icon: MessageCircle
              },
              {
                step: "03",
                title: "Build Your Practice",
                description: "Implement the client-focused strategies from the book to build a sustainable, profitable practice.",
                icon: TrendingUp
              }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-8xl font-bold text-gray-100 absolute -top-4 -left-4">{item.step}</div>
                <div className="relative bg-gray-50 rounded-3xl p-8 h-full">
                  <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mb-6">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: "15+", label: "Years Experience", icon: Award },
              { value: "500+", label: "Agents Helped", icon: Users },
              { value: "19", label: "Comprehensive Chapters", icon: BookOpen },
              { value: "$2M+", label: "Client Policies Managed", icon: DollarSign }
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm">
                <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                <div className="text-4xl md:text-5xl font-semibold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book Section */}
      <section id="book" className="py-32 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=2400&q=80"
            alt="Hawaii landscape"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/95 to-gray-900/80" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 px-4 py-2 rounded-full text-sm mb-8">
                <BookOpen className="w-4 h-4" />
                The Complete Guide
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 leading-tight">
                The Hawaii Financial Professional's Blueprint
              </h2>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                By <span className="text-white font-medium">Sony Ho</span>. 15 years of industry experience
                distilled into a complete guide for building a client-focused practice in Hawaii.
              </p>

              <ul className="space-y-4 mb-10">
                {[
                  'Escape the recruiting model trap',
                  'Build a real, sustainable practice',
                  'Hawaii-specific strategies and scripts',
                  'Cultural community playbooks',
                  'Templates and word-for-word scripts'
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

            {/* Chapter Preview */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <h3 className="text-xl font-semibold mb-6">What's Inside</h3>
              <div className="space-y-4">
                {BOOK_CHAPTERS.map((chapter) => (
                  <div key={chapter.number} className="flex gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      {chapter.number}
                    </div>
                    <div>
                      <div className="font-medium text-white">{chapter.title}</div>
                      <div className="text-sm text-gray-400">{chapter.description}</div>
                    </div>
                  </div>
                ))}
                <div className="text-center pt-4">
                  <span className="text-gray-400">+ 10 more chapters...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80"
                alt="Sony Ho"
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">Honolulu, Hawaii</span>
                </div>
                <p className="text-blue-100 text-sm">Serving Hawaii's communities since 2009</p>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Users className="w-4 h-4" />
                About the Author
              </div>
              <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6">
                Meet Sony Ho
              </h2>
              <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                <p>
                  Sony Ho is a 15-year veteran of the financial services industry in Hawaii.
                  He started like many others, recruited into a traditional insurance organization
                  with promises of unlimited income and freedom.
                </p>
                <p>
                  After experiencing the frustrations of the recruiting model firsthand, he made
                  the decision to build a different kind of practice, one focused entirely on
                  client service and community trust.
                </p>
                <p>
                  Today, Sony helps other financial professionals escape the recruiting trap
                  and build sustainable practices that serve Hawaii's diverse communities.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { value: "15+", label: "Years" },
                  { value: "500+", label: "Clients" },
                  { value: "4.9★", label: "Rating" }
                ].map((stat, i) => (
                  <div key={i} className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6">
              What Professionals Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real feedback from Hawaii financial professionals who've used our tools.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-600">{testimonial.name[0]}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                    <div className="text-xs text-gray-400">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <HelpCircle className="w-4 h-4" />
              Frequently Asked Questions
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6">
              Got Questions?
            </h2>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition"
                >
                  <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6">
            Ready to take control of your career?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Use our free tools to make informed decisions about your future in financial services.
            No sales pitch. No pressure. Just honest data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setActiveTool('calculator');
                document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition"
            >
              <Calculator className="w-5 h-5" />
              Calculate Your Income
            </button>
            <button
              onClick={() => {
                setActiveTool('quiz');
                document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-full font-medium border border-white/20 hover:bg-white/20 transition"
            >
              <ClipboardCheck className="w-5 h-5" />
              Take the Quiz
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">FP</span>
                </div>
                <span className="text-xl font-semibold">Financial Pro Launchpad</span>
              </div>
              <p className="text-gray-400 max-w-md mb-6">
                Helping Hawaii financial professionals build real, sustainable practices
                through client-focused strategies and honest industry insights.
              </p>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Honolulu, Hawaii</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Tools</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#tools" className="hover:text-white transition">Income Calculator</a></li>
                <li><a href="#tools" className="hover:text-white transition">Recruiting Mill Quiz</a></li>
                <li><a href="#book" className="hover:text-white transition">Free Book Chapters</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#book" className="hover:text-white transition">The Blueprint Book</a></li>
                <li><a href="#about" className="hover:text-white transition">About Sony Ho</a></li>
                <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 Financial Pro Launchpad. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm">
              By Sony Ho. Helping Hawaii financial professionals build real practices.
            </p>
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
