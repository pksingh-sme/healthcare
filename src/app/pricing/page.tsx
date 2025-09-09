'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$99",
      period: "per month",
      description: "Perfect for small practices getting started",
      features: [
        "Up to 2 providers",
        "Smart appointment scheduling",
        "Basic billing management",
        "Patient portal access",
        "Email support",
        "HIPAA compliant"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      price: "$249",
      period: "per month",
      description: "Ideal for growing medical practices",
      features: [
        "Up to 10 providers",
        "Everything in Starter",
        "AI-powered billing coding",
        "Advanced analytics",
        "SMS notifications",
        "Priority support",
        "EHR integration",
        "Telehealth module"
      ],
      cta: "Try Free for 14 Days",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large healthcare organizations",
      features: [
        "Unlimited providers",
        "Everything in Professional",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 premium support",
        "Advanced reporting",
        "Multi-location management",
        "Custom AI models"
      ],
      cta: "Contact Sales",
      popular: false
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
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Choose the perfect plan for your healthcare practice. All plans include our core features with no hidden fees.
          </p>
        </div>

        {/* Pricing Plans */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative rounded-2xl shadow-xl border-2 ${
                plan.popular 
                  ? 'border-purple-500 dark:border-purple-400 ring-2 ring-purple-500/20 dark:ring-purple-400/20 transform scale-105' 
                  : 'border-gray-200 dark:border-gray-700'
              } bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-2xl`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{plan.description}</p>
                
                <div className="mb-8">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                  {plan.period && <span className="text-gray-600 dark:text-gray-400"> {plan.period}</span>}
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href={plan.name === "Enterprise" ? "/contact" : "/register"} className="block">
                  <Button 
                    className={`w-full py-6 text-lg ${
                      plan.popular 
                        ? 'clinic-gradient text-white shadow-lg hover:shadow-xl' 
                        : 'border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Can I change plans later?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll only pay the prorated difference. 
                Downgrades take effect at the end of your billing cycle.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Is there a setup fee?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                No, there are no setup fees for any of our plans. You only pay the monthly subscription fee.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Do you offer discounts for non-profits?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, we offer special pricing for qualified non-profit healthcare organizations. Please contact our sales team for more information.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We accept all major credit cards (Visa, Mastercard, American Express) and bank transfers. 
                Enterprise customers can also pay by check or ACH.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Still Have Questions?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Our team is here to help you find the perfect solution for your practice
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="px-8 py-6 text-lg clinic-gradient text-white shadow-lg hover:shadow-xl transition-all">
                Contact Sales
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