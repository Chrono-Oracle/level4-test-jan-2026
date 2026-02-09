'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto grid gap-5"
      >
        <h1 className="text-5xl md:text-7xl font-black leading-tight">
          LOGO
        </h1>
        
        <div className='text-center leading-11'>
          <h3 className='font-semibold text-4xl'>Welcome to Seven Contacts</h3>
          <h5 className=''>By Seven Advanced Academy Students</h5>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link href="/dashboard">
            <Button className="group bg-green-400 shadow-lg text-white py-3 px-4 hover:brightness-105 cursor-pointer">
              <span className="flex items-center gap-1">
                View Dashboard 
                <ArrowRight className="group-hover:translate-x-1 transition-transform h-6 w-6" />
              </span>
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </main>
  )
}
