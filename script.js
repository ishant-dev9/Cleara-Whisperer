/**
 * Cleara Exam Whisperer - Core Logic
 * Safe, Vanilla JS implementation to prevent white-page issues.
 */

(function() {
    "use strict";

    // Wait for DOM to be fully ready
    window.addEventListener('DOMContentLoaded', function() {
        try {
            initApp();
        } catch (err) {
            console.error("Critical app failure during initialization:", err);
            const container = document.getElementById('app-container');
            if (container) {
                container.innerHTML = `<div class="p-8 bg-red-50 text-red-700 rounded-xl border border-red-100">
                    <h2 class="font-bold text-lg">System Error</h2>
                    <p>Something went wrong initializing the app. Please refresh the page.</p>
                </div>`;
            }
        }
    });

    function initApp() {
        const form = document.getElementById('planner-form');
        const submitBtn = document.getElementById('submit-btn');
        const loadingState = document.getElementById('loading-state');
        const resultContainer = document.getElementById('result-container');
        const errorMsg = document.getElementById('error-msg');

        // Set min date for the picker
        const dateInput = document.getElementById('examDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            try {
                handleGeneration();
            } catch (err) {
                console.error("Generation error:", err);
                showError("An unexpected error occurred. Please check your inputs.");
            }
        });

        async function handleGeneration() {
            // Get inputs
            const inputs = {
                studentClass: document.getElementById('studentClass').value,
                subject: document.getElementById('subject').value,
                chapterName: document.getElementById('chapterName').value,
                examDate: document.getElementById('examDate').value
            };

            // Validation
            if (!inputs.subject || !inputs.chapterName || !inputs.examDate) {
                showError("Please fill in all required fields.");
                return;
            }

            // UI Transitions
            hideError();
            form.parentElement.classList.add('opacity-50', 'pointer-events-none');
            loadingState.classList.remove('hidden');
            resultContainer.classList.add('hidden');
            submitBtn.disabled = true;

            // Simulate "AI Thinking" (deterministic delay)
            await new Promise(resolve => setTimeout(resolve, 1500));

            try {
                const plan = generateStudyPlan(inputs);
                renderPlan(plan, inputs);
                
                // Finalize UI
                loadingState.classList.add('hidden');
                resultContainer.classList.remove('hidden');
                form.parentElement.classList.remove('opacity-50', 'pointer-events-none');
                submitBtn.disabled = false;
                
                // Scroll to results
                resultContainer.scrollIntoView({ behavior: 'smooth' });
            } catch (renderErr) {
                console.error("Rendering error:", renderErr);
                showError("Failed to render the study plan.");
            }
        }

        function generateStudyPlan(inputs) {
            // Deterministic Database
            const database = {
                'Physics': {
                    topics: ['Dimensional Analysis', 'Vector Addition', 'Kinematic Equations', 'Newton\'s Laws', 'Conservation of Momentum', 'Free Body Diagrams'],
                    notes: ['Focus on derivation of equations', 'Numerical practice is key', 'Always draw a clear diagram first'],
                    mistakes: ['Mixing up sine and cosine in vector components', 'Forgetting to convert units to SI', 'Ignoring sign conventions'],
                    viva: [
                        { q: 'Physical significance of V-T graph area?', a: 'Represents total displacement.' },
                        { q: 'State the Law of Inertia.', a: 'Object resists change in state of rest/motion.' }
                    ]
                },
                'Math': {
                    topics: ['Algebraic Identities', 'Quadratic Formulas', 'Trigonometric Ratios', 'Probability Theory', 'Set Theory', 'Calculus Fundamentals'],
                    notes: ['Step-by-step calculation is vital', 'Memorize standard formulas', 'Verify answers by back-substitution'],
                    mistakes: ['Sign errors (+/-) during transposition', 'Incorrect BODMAS application', 'Forgetting the constant C in integration'],
                    viva: [
                        { q: 'What is a null set?', a: 'A set with no elements.' },
                        { q: 'Pythagoras theorem?', a: 'a² + b² = c² for right triangles.' }
                    ]
                }
                // Fallback for others
            };

            const subjKey = Object.keys(database).find(k => inputs.subject.toLowerCase().includes(k.toLowerCase())) || 'Generic';
            const data = database[subjKey] || {
                topics: ['Conceptual Overview', 'Key Terminology', 'Process Analysis', 'Practical Applications', 'Summary & Revision'],
                notes: ['Summarize each section in your own words', 'Highlight keywords', 'Connect theories to practical examples'],
                mistakes: ['Skipping core definitions', 'Lack of diagram practice', 'Ignoring previous year questions'],
                viva: [
                    { q: 'Core objective of this chapter?', a: 'To understand fundamental principles and applications.' },
                    { q: 'Relationship to real world?', a: 'Provides logical framework for solving complex problems.' }
                ]
            };

            // Calculate Dates
            const today = new Date();
            const exam = new Date(inputs.examDate);
            const diffDays = Math.ceil(Math.abs(exam - today) / (1000 * 60 * 60 * 24));
            
            const dailyPlan = [];
            for (let i = 0; i < Math.min(diffDays, 14); i++) {
                const date = new Date();
                date.setDate(today.getDate() + i);
                const task = data.topics[i % data.topics.length];
                dailyPlan.push({
                    day: i + 1,
                    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    task: i === diffDays - 1 ? "Final Mock Test & Chill" : task
                });
            }

            return { data, dailyPlan };
        }

        function renderPlan(plan, inputs) {
            const { data, dailyPlan } = plan;
            
            resultContainer.innerHTML = `
                <div class="flex items-center justify-between no-print mb-8">
                    <h3 class="text-3xl font-extrabold text-gray-900">Your Master Plan</h3>
                    <button onclick="window.print()" class="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 font-semibold text-sm px-4 py-2 bg-indigo-50 rounded-lg transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                        <span>Save PDF / Print</span>
                    </button>
                </div>

                <div class="print-only hidden mb-8 text-center border-b pb-4">
                    <h1 class="text-2xl font-bold">Cleara Exam Whisperer - Study Plan</h1>
                    <p class="text-gray-600">Plan for ${inputs.subject}: ${inputs.chapterName} (Class ${inputs.studentClass})</p>
                    <p class="text-sm">Exam Date: ${new Date(inputs.examDate).toLocaleDateString()}</p>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div class="lg:col-span-2 space-y-8">
                        <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h4 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                <span class="w-2 h-6 bg-indigo-600 rounded-full mr-3"></span>
                                Daily Study Schedule
                            </h4>
                            <div class="space-y-4">
                                ${dailyPlan.map(p => `
                                    <div class="flex items-start p-4 bg-gray-50 rounded-xl hover:bg-white border border-transparent hover:border-indigo-100 transition-all">
                                        <div class="flex-shrink-0 w-16 text-center">
                                            <span class="block text-xs font-bold text-indigo-600 uppercase tracking-wider">Day ${p.day}</span>
                                            <span class="block text-sm font-medium text-gray-500">${p.date}</span>
                                        </div>
                                        <div class="ml-6 flex-grow">
                                            <p class="text-gray-900 font-semibold">${p.task}</p>
                                            <p class="text-sm text-gray-500 mt-1">Focus on conceptual clarity and problem solving.</p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <div class="bg-indigo-900 rounded-2xl p-8 text-white shadow-xl">
                            <h4 class="text-xl font-bold mb-4">Revision Power-Notes</h4>
                            <ul class="space-y-3">
                                ${data.notes.map(note => `<li class="flex items-start"><span class="text-indigo-400 mr-2">✦</span><span class="text-indigo-100">${note}</span></li>`).join('')}
                            </ul>
                        </div>
                    </div>

                    <div class="space-y-8">
                        <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h4 class="text-lg font-bold text-gray-800 mb-4">Topics Breakdown</h4>
                            <div class="flex flex-wrap gap-2">
                                ${data.topics.map(t => `<span class="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full border border-indigo-100">${t}</span>`).join('')}
                            </div>
                        </div>

                        <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h4 class="text-lg font-bold text-gray-800 mb-4 text-red-600">Common Pitfalls</h4>
                            <div class="space-y-4">
                                ${data.mistakes.map(m => `
                                    <div class="p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                                        <p class="text-sm text-red-700 font-medium">⚠️ ${m}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h4 class="text-lg font-bold text-gray-800 mb-4">Viva Q&A</h4>
                            <div class="space-y-5">
                                ${data.viva.map(v => `
                                    <div class="space-y-1">
                                        <p class="text-sm font-bold text-gray-900">Q: ${v.q}</p>
                                        <p class="text-sm text-gray-600 bg-gray-50 p-2 rounded italic">A: ${v.a}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        function showError(msg) {
            errorMsg.innerText = msg;
            errorMsg.classList.remove('hidden');
        }

        function hideError() {
            errorMsg.classList.add('hidden');
        }
    }
})();