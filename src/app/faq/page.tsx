'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function FAQPage() {
  const faqCategories = [
    {
      id: 'general',
      title: 'General Questions',
      faqs: [
        {
          question: "What is ClinicEase AI?",
          answer: "ClinicEase AI is an intelligent healthcare management platform that streamlines appointment scheduling, patient management, billing, and clinical support for small to mid-size healthcare clinics. Our AI-powered system helps reduce administrative burden while improving patient care."
        },
        {
          question: "How does the AI scheduling system work?",
          answer: "Our AI scheduling system uses machine learning algorithms to predict no-shows, optimize appointment slots, and automatically adjust overbooking ratios. It considers factors like historical data, provider availability, and patient demographics to create the most efficient schedule possible."
        },
        {
          question: "Is ClinicEase AI HIPAA compliant?",
          answer: "Yes, ClinicEase AI is fully HIPAA compliant. We implement administrative, physical, and technical safeguards to protect electronic protected health information (ePHI). All data is encrypted both in transit and at rest, and we maintain detailed audit logs of all access to patient data."
        },
        {
          question: "Can I try ClinicEase AI before purchasing?",
          answer: "Absolutely! We offer a 14-day free trial for our Professional plan with no credit card required. During the trial, you'll have access to all features, and our support team will help you get set up and answer any questions you may have."
        }
      ]
    },
    {
      id: 'technical',
      title: 'Technical Questions',
      faqs: [
        {
          question: "What are the system requirements?",
          answer: "ClinicEase AI is a web-based platform that works on any modern browser (Chrome, Firefox, Safari, Edge). For the best experience, we recommend using the latest version of your preferred browser. No additional software installation is required."
        },
        {
          question: "Do you have a mobile app?",
          answer: "Yes, we offer mobile apps for both iOS and Android devices. Our mobile apps provide access to key features including appointment scheduling, patient messaging, and real-time notifications. You can download them from the App Store or Google Play Store."
        },
        {
          question: "How secure is my data?",
          answer: "We take data security very seriously. All data is encrypted using industry-standard AES-256 encryption both in transit and at rest. We perform regular security audits, maintain SOC 2 compliance, and follow strict access control policies. Additionally, we offer two-factor authentication for all user accounts."
        },
        {
          question: "What kind of integrations do you offer?",
          answer: "ClinicEase AI integrates with popular EHR systems, lab services, imaging centers, and insurance providers. We also offer API access for custom integrations. Common integrations include Epic, Cerner, AthenaHealth, and various laboratory information systems."
        }
      ]
    },
    {
      id: 'billing',
      title: 'Billing & Payments',
      faqs: [
        {
          question: "How does the AI-powered billing coding work?",
          answer: "Our AI billing system analyzes appointment notes and clinical documentation to suggest appropriate ICD-10 and CPT codes. It learns from your coding patterns and industry best practices to improve accuracy over time. The system also checks for common coding errors and ensures compliance with payer requirements."
        },
        {
          question: "Do you process payments?",
          answer: "Yes, ClinicEase AI integrates with Stripe to process credit card payments securely. We support various payment methods including credit cards, debit cards, and ACH transfers. All payment processing is fully PCI compliant, and funds are typically deposited into your account within 2-3 business days."
        },
        {
          question: "What happens if a claim is denied?",
          answer: "Our system automatically tracks denied claims and provides detailed reasons for the denial. We offer tools to help you appeal denials, including pre-populated appeal forms and guidance on common denial reasons. Our analytics also help identify patterns in denials to prevent future issues."
        },
        {
          question: "Are there any setup fees?",
          answer: "No, there are no setup fees for any of our plans. You only pay the monthly subscription fee. Implementation services are available for an additional fee if you need extra help with setup and training."
        }
      ]
    },
    {
      id: 'support',
      title: 'Support & Training',
      faqs: [
        {
          question: "What kind of support do you provide?",
          answer: "We offer comprehensive support including 24/7 email support, business hour phone support, and live chat during business hours. Our Professional and Enterprise plans include priority support with faster response times. We also provide extensive documentation, video tutorials, and webinars."
        },
        {
          question: "Do you offer training?",
          answer: "Yes, we provide onboarding training for all new customers at no additional cost. This includes personalized setup assistance, user training sessions, and ongoing educational resources. Our Enterprise plan includes dedicated training sessions and custom training materials."
        },
        {
          question: "How often do you release updates?",
          answer: "We release minor updates weekly and major feature updates monthly. All updates are included in your subscription at no additional cost. We notify users of significant changes in advance and provide release notes detailing new features and improvements."
        },
        {
          question: "Can I request new features?",
          answer: "Absolutely! We have a public feature request portal where users can submit and vote on new features. Our product team regularly reviews these requests and incorporates popular suggestions into our development roadmap. Enterprise customers can also request custom features through their account manager."
        }
      ]
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
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Find answers to common questions about ClinicEase AI and healthcare management
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <input
              type="text"
              placeholder="Search FAQs..."
              className="w-full px-6 py-4 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg"
            />
            <svg className="absolute right-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-12 mb-16">
          {faqCategories.map((category) => (
            <div key={category.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-purple-900 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-900/30 dark:to-pink-900/30 p-6 border-b border-purple-100 dark:border-purple-900">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {category.title}
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {category.faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-100 dark:border-gray-700 last:border-0 pb-6 last:pb-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still Need Help */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Still Need Help?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Our support team is ready to assist you with any questions not covered here
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/support">
              <Button size="lg" className="px-8 py-6 text-lg clinic-gradient text-white shadow-lg hover:shadow-xl transition-all">
                Contact Support
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 shadow-lg hover:shadow-xl transition-all">
                Schedule a Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}