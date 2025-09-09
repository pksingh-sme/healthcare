'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "5 Ways AI is Transforming Healthcare Management",
      excerpt: "Discover how artificial intelligence is revolutionizing the way healthcare practices operate, from appointment scheduling to patient care.",
      date: "September 5, 2025",
      readTime: "5 min read",
      category: "AI Innovation"
    },
    {
      id: 2,
      title: "HIPAA Compliance in the Digital Age",
      excerpt: "Learn best practices for maintaining patient data security while leveraging modern healthcare technology solutions.",
      date: "August 28, 2025",
      readTime: "7 min read",
      category: "Compliance"
    },
    {
      id: 3,
      title: "Maximizing Revenue with Smart Billing Solutions",
      excerpt: "Explore how automated billing systems can reduce claim denials and accelerate payment collection for healthcare practices.",
      date: "August 20, 2025",
      readTime: "6 min read",
      category: "Billing"
    },
    {
      id: 4,
      title: "The Future of Telehealth Integration",
      excerpt: "How ClinicEase AI is bridging the gap between in-person and virtual healthcare experiences for better patient outcomes.",
      date: "August 15, 2025",
      readTime: "4 min read",
      category: "Telehealth"
    },
    {
      id: 5,
      title: "Streamlining Patient Onboarding Processes",
      excerpt: "Effective strategies for reducing administrative burden while improving patient satisfaction during the onboarding process.",
      date: "August 10, 2025",
      readTime: "5 min read",
      category: "Patient Experience"
    },
    {
      id: 6,
      title: "Data-Driven Decision Making in Healthcare",
      excerpt: "How analytics and reporting tools are empowering healthcare providers to make better clinical and operational decisions.",
      date: "August 5, 2025",
      readTime: "8 min read",
      category: "Analytics"
    }
  ]

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
            ClinicEase AI Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Insights, tips, and news about healthcare technology, practice management, and patient care innovation.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Button variant="outline" className="rounded-full border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30">
            All Topics
          </Button>
          <Button variant="outline" className="rounded-full border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30">
            AI Innovation
          </Button>
          <Button variant="outline" className="rounded-full border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30">
            Compliance
          </Button>
          <Button variant="outline" className="rounded-full border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/30">
            Billing
          </Button>
          <Button variant="outline" className="rounded-full border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/30">
            Telehealth
          </Button>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {blogPosts.map((post) => (
            <div 
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-purple-100 dark:border-purple-900 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {post.readTime}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {post.date}
                  </span>
                  <Button variant="outline" size="sm" className="border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30">
                    Read More
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="max-w-2xl mx-auto bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-2xl shadow-xl p-8 border border-purple-100 dark:border-purple-900 mb-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
            Stay Updated
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            Get the latest healthcare technology insights delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <Button className="clinic-gradient text-white shadow-lg hover:shadow-xl transition-all">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}