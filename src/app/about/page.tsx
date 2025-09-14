'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <Link href="/" className="inline-block mb-8">
            <Button variant="outline" className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            About ClinicEase AI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Revolutionizing healthcare management with intelligent automation and AI-powered solutions
          </p>
        </div>

        {/* Mission Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-purple-100 dark:border-purple-900">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              At ClinicEase AI, we're on a mission to transform the healthcare landscape by providing intelligent, 
              user-friendly solutions that streamline clinic operations, reduce administrative burden, and 
              ultimately improve patient care.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Our platform combines cutting-edge artificial intelligence with deep healthcare expertise to 
              create tools that adapt to your workflow, not the other way around. We believe that technology 
              should enhance the human connection between healthcare providers and patients, not replace it.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-blue-100 dark:border-blue-900 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Patient Privacy</h3>
              <p className="text-gray-600 dark:text-gray-400">
                HIPAA-compliant security measures to protect sensitive patient information at all times.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-purple-100 dark:border-purple-900 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Innovation</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Continuously developing AI-powered features to solve real healthcare challenges.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-pink-100 dark:border-pink-900 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">User-Centric Design</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Intuitive interfaces designed with input from healthcare professionals.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-green-100 dark:border-green-900 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Reliability</h3>
              <p className="text-gray-600 dark:text-gray-400">
                99.9% uptime with robust infrastructure to support your critical operations.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-yellow-100 dark:border-yellow-900 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Efficiency</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Streamlined workflows that save time and reduce operational costs.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-teal-100 dark:border-teal-900 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Compassion</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Supporting healthcare providers in delivering better patient care.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-2xl shadow-xl p-8 border border-purple-100 dark:border-purple-900">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Our Leadership Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  <img 
                    src="https://placehold.co/96x96/4F46E5/FFFFFF?text=SS" 
                    alt="Shivakar Singh" 
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Shivakar Singh</h3>
                <p className="text-purple-600 dark:text-purple-400 mb-2">Founder & CEO</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  15+ years in healthcare technology and AI development
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  <img 
                    src="./uploads/profiles/pramod.jpg?text=PS" 
                    alt="Pramod Singh" 
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Pramod Singh</h3>
                <p className="text-purple-600 dark:text-purple-400 mb-2">CTO</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Expert in scalable cloud architectures and data security
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-400 to-red-500 mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  <img 
                    src="https://placehold.co/96x96/EC4899/FFFFFF?text=AS" 
                    alt="Aanchal Suri" 
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Aanchal Suri</h3>
                <p className="text-purple-600 dark:text-purple-400 mb-2">Head of Growth</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Experienced in healthcare sales and client relationship management
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Ready to Transform Your Practice?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of healthcare providers who trust ClinicEase AI to streamline their operations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" className="px-8 py-6 text-lg clinic-gradient text-white shadow-lg hover:shadow-xl transition-all">
                Schedule a Demo
              </Button>
            </Link>
            <Link href="/login?role=staff">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 shadow-lg hover:shadow-xl transition-all">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}