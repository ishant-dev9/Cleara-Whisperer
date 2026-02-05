
# Cleara Exam Whisperer – Personal Exam Mentor

**Cleara Exam Whisperer** is a high-performance, production-ready web application designed to help students organize their exam preparation. It generates personalized study plans, micro-topic breakdowns, revision notes, and viva-style questions using deterministic logic tailored to the user's specific subject and timeline.

## Features

- **Class-Specific Planning:** Supports students in Class 10, 11, and 12.
- **Micro-Topic Breakdown:** Deconstructs complex chapters into manageable study units.
- **Daily Schedules:** Automatically calculates a day-by-day plan from "today" until the exam date.
- **Revision Power-Notes:** Provides concise, exam-oriented notes to focus on what matters most.
- **Viva Prep:** 5 essential viva questions with detailed answers to boost confidence.
- **Mistake Mitigation:** Identifies 3 common mistakes students make in specific subjects.
- **Mobile-First Design:** Fully responsive UI that works perfectly on phones, tablets, and desktops.
- **Print Friendly:** Integrated "Save as PDF" feature for physical study copies.

## Technical Details

- **Framework:** React 18+ with TypeScript
- **Styling:** Tailwind CSS (Modern, mobile-first, and utility-driven)
- **Logic:** Client-side deterministic engine (No external API keys required)
- **State Management:** React Hooks (`useState`, `useCallback`)
- **Performance:** Optimized rendering with zero external dependencies (no spinners or heavy libraries)

## How to Deploy on Vercel

This app is designed for zero-configuration deployment on Vercel:

1. **Clone the Repository:** Push this code to a new GitHub repository.
2. **Connect to Vercel:** 
   - Go to [vercel.com](https://vercel.com).
   - Click **"Add New"** > **"Project"**.
   - Select your GitHub repository.
3. **Configure Settings:**
   - Framework Preset: `Vite` or `Other` (if using standard build tools).
   - Build Command: `npm run build` (or leave default if deploying as static files).
   - Output Directory: `dist` or `.` (depending on your setup).
4. **Deploy:** Click **"Deploy"**.

**Note:** Since this app uses ONLY client-side logic, it works perfectly on the Vercel Free Plan and requires NO environment variables.

## Credits
Built by Cleara – empowering students through intelligent design.
