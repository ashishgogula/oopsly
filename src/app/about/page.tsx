/* eslint-disable react/no-unescaped-entities */
// app/about/page.tsx

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen w-full bg-white">
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900">
            Why Oopsly?
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            Because even error pages deserve to be delightful. Oopsly was built to turn one of the most frustrating user experiences—the 404 "Page Not Found" error—into a small moment of joy.
          </p>
        </motion.div>

        {/* ✨ New contact section */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <p className="text-slate-600">
            Have suggestions or improvements?{' '}
            <a
              href="https://x.com/ashishgogula"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold underline hover:text-blue-800"
            >
              DM me on X 
            </a>
             {' '}or visit my{' '}  <a
              href="https://ashishgogula.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold underline hover:text-blue-800"
            >
             Website
            </a>.
          </p>
        </motion.div>

        <motion.div 
          className="mt-16 text-left p-8 bg-slate-50/70 rounded-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-slate-800">The Mission</h2>
          <p className="mt-4 text-slate-700">
            In a world of complex web applications, the 404 page is often an afterthought. It's a dead end, a generic template that tells the user they've made a mistake.
          </p>
          <p className="mt-4 text-slate-700">
            I believe it can be more. A great 404 page can be a reflection of a brand's personality. It can be helpful, funny, or just beautiful. It's an opportunity to keep users engaged, even when they're lost. Oopsly is a simple tool to help developers and designers do just that, without the hassle.
          </p>
        </motion.div>

        

        <motion.div 
          className="mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="bg-blue-50/50 rounded-2xl p-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center text-left">
              <div className="text-4xl">👨‍💻</div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">A Note from the Creator</h3>
                <p className="mt-2 text-slate-700">
                  "I got tired of coding the same simple error pages over and over. So I built this to make it fast, easy, and fun. I hope it helps you add a little more personality to your corner of the internet."
                </p>
                <p className="text-slate-600 text-sm mt-2">— Ashish</p>
              </div>
            </div>
          </div>
        </motion.div>

        

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Link 
            href="/generate"
            className="inline-block mt-12 bg-slate-900 text-white px-8 py-4 rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-lg text-lg"
          >
            Start Creating →
          </Link>
        </motion.div>

      </div>
    </main>
  );
}
