/* eslint-disable react/no-unescaped-entities */
'use client';

import { motion, useInView, Variants, TargetAndTransition } from 'framer-motion';
import Link from 'next/link';
import { CarouselDemo } from './components/carouselPics';
import { useRef } from 'react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100,
      duration: 0.6
    }
  }
};

const floatingAnimation: TargetAndTransition = {
  y: [-10, 10, -10],
  rotate: [-2, 2, -2],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const emojiVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0,
    rotate: -180
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 200,
      duration: 0.8
    }
  }
};

export default function Home() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const examplesRef = useRef(null);
  const personalRef = useRef(null);

  const carouselInView = useInView(carouselRef, {
    once: true,
    amount: 0.3,
    margin: "-100px 0px -100px 0px"
  });

  const examplesInView = useInView(examplesRef, {
    once: true,
    amount: 0.5
  });

  const personalInView = useInView(personalRef, {
    once: true,
    amount: 0.3
  });

  const handleScrollToCarousel = () => {
    carouselRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 overflow-hidden">

      {/* Enhanced Header */}
      <motion.header
        className="p-6 flex justify-between items-center relative z-10"
        initial={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 120,
          duration: 0.8
        }}
      >
        <motion.h1
          className="text-xl font-medium"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          Oopsly
        </motion.h1>
        <nav className="hidden sm:flex gap-8 text-sm">
          <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400 }}>
            <Link href="/examples" className="text-slate-600 hover:text-slate-900 transition-colors duration-300">Examples</Link>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400 }}>
            <Link href="/about" className="text-slate-600 hover:text-slate-900 transition-colors duration-300">About</Link>
          </motion.div>
        </nav>
      </motion.header>

      <motion.div
        className="px-6 py-20 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        <motion.div
          animate={floatingAnimation}
        >
          <motion.p
            className="text-7xl mb-6 select-none"
            variants={itemVariants}
          >
            {['🦄', '🧙', '💔', '⚠️', '🚨'].map((emoji, i) => (
              <motion.span
                key={i}
                variants={emojiVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: i * 0.1 }}
                whileHover={{
                  scale: 1.3,
                  rotate: 15,
                  y: -8,
                  transition: {
                    type: "spring",
                    damping: 10,
                    stiffness: 400,
                    duration: 0.3
                  }
                }}
                className="inline-block cursor-pointer mx-1"
                style={{
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                }}
              >
                {emoji}
              </motion.span>
            ))}
          </motion.p>
        </motion.div>

        <motion.h2
          className="text-5xl md:text-6xl font-bold leading-tight mb-8 text-slate-900"
          variants={itemVariants}
        >
          Build 404s that<br />
          <motion.span
            className="bg-yellow-200 px-3 py-1 -rotate-1 inline-block transform cursor-pointer"
            whileHover={{
              rotate: 1,
              scale: 1.05,
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            don't suck
          </motion.span>
        </motion.h2>

        <motion.p
          className="text-xl text-slate-600 mb-12 max-w-xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          Craft a better 404 page in <b className='text-slate-800'>seconds</b>. Customize the vibe with emojis and colors, and export developer-ready code. Give your users a better dead end 🚧.
        </motion.p>

         <motion.div 
          variants={itemVariants}
          className="mb-4 flex justify-center items-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link 
              href="/generate"
              className="inline-block bg-slate-900 text-white px-8 py-4 rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-lg text-lg"
            >
              Try it free →
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <button
              onClick={handleScrollToCarousel}
              className="inline-block bg-white text-slate-700 px-8 py-4 rounded-lg font-medium border border-slate-900 hover:bg-slate-100 transition-colors shadow-lg text-lg"
            >
              Explore
            </button>
          </motion.div>
        </motion.div>

        <motion.p
          className="text-sm text-slate-500 "
          variants={itemVariants}
        >
          no signup needed
        </motion.p>

        <motion.div
          ref={carouselRef}

          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={carouselInView ? {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              type: "spring",
              damping: 20,
              stiffness: 80,
              duration: 1.2
            }
          } : {}}
        >
          <CarouselDemo />
        </motion.div>

        <motion.div
          ref={examplesRef}
          className="mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={examplesInView ? {
            opacity: 1,
            y: 0,
            transition: {
              type: "spring",
              damping: 20,
              stiffness: 100,
              staggerChildren: 0.1
            }
          } : {}}
        >
          <motion.p
            className="text-slate-600 mb-6"
            initial={{ opacity: 0 }}
            animate={examplesInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            What people are making:
          </motion.p>

          <div className="flex justify-center gap-4 text-5xl mb-6">
            {['🚀', '🎯', '🎪', '🎮'].map((emoji, i) => (
              <motion.span
                key={i}
                className="cursor-pointer select-none"
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={examplesInView ? {
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                  transition: {
                    type: "spring",
                    damping: 15,
                    stiffness: 200,
                    delay: 0.4 + (i * 0.1)
                  }
                } : {}}
                whileHover={{
                  scale: 1.4,
                  rotate: i % 2 === 0 ? 15 : -15,
                  y: -10,
                  transition: {
                    type: "spring",
                    damping: 10,
                    stiffness: 400
                  }
                }}
                style={{
                  filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))'
                }}
              >
                {emoji}
              </motion.span>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={examplesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8 }}
          >
            <Link
              href="/examples"
              className="text-slate-600 hover:text-slate-900 underline underline-offset-4 transition-all duration-300 hover:underline-offset-8"
            >
              See the gallery →
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          ref={personalRef}
          className="p-6 bg-blue-50 rounded-lg border border-blue-100 text-left max-w-lg mx-auto"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={personalInView ? {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              type: "spring",
              damping: 20,
              stiffness: 100,
              duration: 0.8
            }
          } : {}}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 10px 30px rgba(59, 130, 246, 0.15)",
            transition: { duration: 0.3 }
          }}
        >
          <div className="flex gap-3">
            <motion.div
              className="text-2xl"
              initial={{ rotate: 0 }}
              animate={personalInView ? {
                rotate: [0, 10, -10, 0],
                transition: {
                  delay: 0.5,
                  duration: 1,
                  ease: "easeInOut"
                }
              } : {}}
            >
              👨‍💻
            </motion.div>
            <div>
              <motion.p
                className="text-slate-700 text-sm leading-relaxed"
                initial={{ opacity: 0, x: -20 }}
                animate={personalInView ? {
                  opacity: 1,
                  x: 0,
                  transition: { delay: 0.3 }
                } : {}}
              >
                "I got tired of coding the same simple error pages over and over. So I built this to make it fast, easy, and fun"
              </motion.p>
              <motion.p
                className="text-slate-600 text-xs mt-2"
                initial={{ opacity: 0, x: -20 }}
                animate={personalInView ? {
                  opacity: 1,
                  x: 0,
                  transition: { delay: 0.5 }
                } : {}}
              >
                — Ashish
              </motion.p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.footer
        className="border-t border-slate-200 py-8 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 2.5,
          duration: 0.8,
          type: "spring",
          damping: 20
        }}
      >
        <p className="text-sm text-slate-500">
          Built with ❤️ using Next.js, Framer Motion, and Tailwind CSS.
        </p>
      </motion.footer>
    </div>
  );
}