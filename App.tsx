
import React, { useState, useCallback } from 'react';
import { UserInputs, StudyPlanOutput } from './types';
import { generatePlan } from './services/plannerService';

// Component defined outside parent to avoid re-renders
const Header: React.FC = () => (
  <header className="bg-white border-b sticky top-0 z-10 no-print">
    <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="bg-indigo-600 text-white p-2 rounded-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Cleara <span className="text-indigo-600">Whisperer</span></h1>
      </div>
      <div className="text-sm font-medium text-gray-500 hidden sm:block">Personal Exam Mentor</div>
    </div>
  </header>
);

const Footer: React.FC = () => (
  <footer className="bg-gray-50 border-t py-8 mt-12 no-print">
    <div className="max-w-5xl mx-auto px-4 text-center">
      <p className="text-gray-500 text-sm">© 2024 Cleara Exam Whisperer. Built for student excellence.</p>
    </div>
  </footer>
);

export default function App() {
  const [inputs, setInputs] = useState<UserInputs>({
    studentClass: '10',
    subject: '',
    chapterName: '',
    examDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StudyPlanOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputs.subject || !inputs.chapterName || !inputs.examDate) {
      setError("Please fill in all fields correctly.");
      return;
    }
    
    setError(null);
    setLoading(true);
    try {
      const plan = await generatePlan(inputs);
      setResult(plan);
      setLoading(false);
      // Scroll to result
      setTimeout(() => {
        document.getElementById('study-plan-output')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while generating your plan.");
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-8">
        {/* Form Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 no-print">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Plan Your Success</h2>
            <p className="text-gray-600 mt-1">Enter your exam details to get a customized study strategy.</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Select Class</label>
              <select 
                name="studentClass"
                value={inputs.studentClass}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-gray-50"
              >
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Subject</label>
              <input 
                type="text" 
                name="subject"
                placeholder="e.g. Physics, Biology..."
                value={inputs.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Chapter Name</label>
              <input 
                type="text" 
                name="chapterName"
                placeholder="e.g. Thermodynamics..."
                value={inputs.chapterName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Exam Date</label>
              <input 
                type="date" 
                name="examDate"
                value={inputs.examDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-gray-50"
              />
            </div>

            <div className="md:col-span-2 pt-4">
              <button 
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transition-all transform active:scale-[0.98] ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200'}`}
              >
                {loading ? 'Consulting the Whispers...' : 'Generate Personalized Study Plan'}
              </button>
              {error && <p className="text-red-500 text-sm mt-3 text-center font-medium">{error}</p>}
            </div>
          </form>
        </section>

        {/* Output Section */}
        {result && (
          <div id="study-plan-output" className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between no-print">
              <h3 className="text-3xl font-extrabold text-gray-900">Your Master Plan</h3>
              <button 
                onClick={handlePrint}
                className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 font-semibold text-sm px-4 py-2 bg-indigo-50 rounded-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                <span>Save PDF / Print</span>
              </button>
            </div>

            {/* Print Only Header */}
            <div className="print-only mb-8 text-center border-b pb-4">
              <h1 className="text-2xl font-bold">Cleara Exam Whisperer - Study Plan</h1>
              <p className="text-gray-600">Plan for {inputs.subject}: {inputs.chapterName} (Class {inputs.studentClass})</p>
              <p className="text-sm">Exam Date: {new Date(inputs.examDate).toLocaleDateString()}</p>
            </div>

            {/* Grid Layout for Result */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Column: Daily Plan */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <span className="w-2 h-6 bg-indigo-600 rounded-full mr-3"></span>
                    Daily Study Schedule
                  </h4>
                  <div className="space-y-4">
                    {result.dailyPlan.length > 0 ? result.dailyPlan.map((p, idx) => (
                      <div key={idx} className="flex items-start p-4 bg-gray-50 rounded-xl hover:bg-white border border-transparent hover:border-indigo-100 transition-all">
                        <div className="flex-shrink-0 w-16 text-center">
                          <span className="block text-xs font-bold text-indigo-600 uppercase tracking-wider">Day {p.day}</span>
                          <span className="block text-sm font-medium text-gray-500">{p.date}</span>
                        </div>
                        <div className="ml-6 flex-grow">
                          <p className="text-gray-900 font-semibold">{p.task}</p>
                          <p className="text-sm text-gray-500 mt-1">Practice 3 numericals & 1 short answer.</p>
                        </div>
                        <div className="flex-shrink-0">
                          <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 no-print" />
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 italic">No days remaining before the exam. Focus on rapid revision!</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-indigo-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                    <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2 .712V17a1 1 0 001 1z"></path></svg>
                  </div>
                  <h4 className="text-xl font-bold mb-4">Revision Power-Notes</h4>
                  <ul className="space-y-3 relative z-10">
                    {result.revisionNotes.map((note, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-indigo-400 mr-2">✦</span>
                        <span className="text-indigo-100">{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sidebar: Topics, Viva, Mistakes */}
              <div className="space-y-8">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Micro-Topic Breakdown</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.microTopics.map((topic, idx) => (
                      <span key={idx} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full border border-indigo-100">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Common Pitfalls</h4>
                  <div className="space-y-4">
                    {result.commonMistakes.map((mistake, idx) => (
                      <div key={idx} className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                        <p className="text-sm text-red-700 font-medium">⚠️ {mistake}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Viva Preparation (Q&A)</h4>
                  <div className="space-y-5">
                    {result.vivaQuestions.map((v, idx) => (
                      <div key={idx} className="space-y-2">
                        <p className="text-sm font-bold text-gray-900">Q: {v.question}</p>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">A: {v.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
