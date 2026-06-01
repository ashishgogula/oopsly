/* eslint-disable react/no-unescaped-entities */
// app/examples/page.tsx

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ExamplesPage() {
  const placeholderExamples = [
    { emoji: '🚀', bgColor: 'bg-blue-100' },
    { emoji: '🤖', bgColor: 'bg-purple-100' },
    { emoji: '🎨', bgColor: 'bg-pink-100' },
    { emoji: '🎮', bgColor: 'bg-yellow-100' },
    { emoji: '🔍', bgColor: 'bg-green-100' },
    { emoji: '🚧', bgColor: 'bg-orange-100' },
  ];

  return (
    <main className="min-h-screen w-full bg-white">
      <div className="px-6 py-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900"
        >
          Community Showcase
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto"
        >
          Coming soon! We're busy building a beautiful gallery of creations from the community.
        </motion.p>
      </div>
      
      {/* ✨ Moved Call to Action Section to the top */}
      <motion.div 
        className="max-w-2xl mx-auto text-center pb-24 px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <div className="bg-blue-50/50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-slate-800">Got a cool 404 page?</h2>
          {/* ✨ Personalized the call to action text */}
          <p className="mt-3 text-slate-600 text-lg">
            I’d love to feature it here. DM me on{' '}
            <a
              href="https://x.com/ashishgogula"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold underline hover:text-blue-800"
            >
              X (Twitter)
            </a>{' '}
            to get your creation featured!
          </p>
          <Link 
              href="/generate"
              className="inline-block mt-8 bg-slate-900 text-white px-8 py-4 rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-lg text-lg"
            >
              Start Building →
            </Link>
        </div>
      </motion.div>

      {/* Placeholder Grid */}
      <motion.div 
        className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 pb-24"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } }
        }}
      >
        {placeholderExamples.map((item, index) => (
          <motion.div
            key={index}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center justify-center h-48 rounded-2xl ${item.bgColor}`}
          >
            <span className="text-6xl">{item.emoji}</span>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}
