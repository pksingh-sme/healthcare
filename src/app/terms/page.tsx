'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function TermsOfServicePage() {
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
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            These terms govern your use of ClinicEase AI and our healthcare management platform.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-purple-100 dark:border-purple-900">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              <strong>Last Updated:</strong> September 8, 2025
            </p>
            
            <p className="mb-6">
              Welcome to ClinicEase AI. These Terms of Service ("Terms") govern your access to and use of 
              our healthcare management platform and services (collectively, the "Service"). By accessing 
              or using the Service, you agree to be bound by these Terms and our Privacy Policy.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By registering for, accessing, or using our Service, you acknowledge that you have read, 
              understood, and agree to be bound by these Terms and our Privacy Policy. If you are using 
              the Service on behalf of an organization, you are agreeing to these Terms for that organization 
              and representing to us that you have the authority to bind that organization to these Terms.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">2. Eligibility</h2>
            <p className="mb-4">
              You must be at least 18 years old to use the Service. By agreeing to these Terms, you represent 
              and warrant that you are at least 18 years old and that you have the right, authority, and 
              capacity to enter into these Terms.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">3. Account Registration</h2>
            <p className="mb-4">
              To access certain features of the Service, you may be required to register for an account. 
              You agree to provide accurate, current, and complete information during registration and 
              to update such information to keep it accurate, current, and complete. You are responsible 
              for safeguarding your password and for all activities that occur under your account.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">4. Healthcare Compliance</h2>
            <p className="mb-4">
              As a healthcare technology provider, we are committed to compliance with applicable healthcare 
              regulations including HIPAA. You acknowledge that:
            </p>
            <ul className="list-disc pl-8 mb-6 space-y-2">
              <li>You are responsible for ensuring your use of the Service complies with all applicable laws and regulations</li>
              <li>You will not use the Service to transmit any information that would make us a covered entity under HIPAA</li>
              <li>You will maintain appropriate administrative, physical, and technical safeguards for electronic protected health information</li>
              <li>You will promptly notify us of any security incidents or breaches involving the Service</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">5. Acceptable Use</h2>
            <p className="mb-4">
              You agree not to misuse the Service or help anyone else do so. You agree not to:
            </p>
            <ul className="list-disc pl-8 mb-6 space-y-2">
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>Interfere with or disrupt the Service or servers or networks connected to the Service</li>
              <li>Attempt to gain unauthorized access to the Service or related systems</li>
              <li>Transmit any viruses, worms, or other malicious code</li>
              <li>Reverse engineer or attempt to extract the source code of the Service</li>
              <li>Use the Service to store or transmit any patient health information without proper authorization</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">6. Subscription and Payments</h2>
            <p className="mb-4">
              Some features of the Service may require payment of fees. By selecting a subscription plan, 
              you agree to pay the fees associated with that plan. All fees are exclusive of taxes, and 
              you are responsible for paying any applicable taxes. We reserve the right to modify our 
              pricing at any time, with notice to you.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">7. Termination</h2>
            <p className="mb-4">
              We may terminate or suspend your account and access to the Service immediately, without 
              prior notice or liability, for any reason whatsoever, including without limitation if 
              you breach the Terms. Upon termination, your right to use the Service will immediately cease.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">8. Disclaimer of Warranties</h2>
            <p className="mb-4">
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We expressly disclaim 
              all warranties of any kind, whether express or implied, including but not limited to the 
              implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">9. Limitation of Liability</h2>
            <p className="mb-4">
              In no event shall Clinch Infosystems, nor its directors, employees, partners, agents, 
              suppliers, or affiliates, be liable for any indirect, incidental, special, consequential 
              or punitive damages, including without limitation, loss of profits, data, use, goodwill, 
              or other intangible losses, resulting from your access to or use of or inability to access 
              or use the Service.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">10. Governing Law</h2>
            <p className="mb-4">
              These Terms shall be governed and construed in accordance with the laws of the State of 
              Washington, without regard to its conflict of law provisions. Our failure to enforce any 
              right or provision of these Terms will not be considered a waiver of those rights.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">11. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
              If a revision is material, we will provide at least 30 days' notice prior to any new terms 
              taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">12. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about these Terms, please contact us at:
              <a href="mailto:legal@clinceaseai.com" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
                legal@clinceaseai.com
              </a>
            </p>
            <p className="mb-4">
              Or write to us at:
            </p>
            <address className="not-italic mb-6">
              Clinch Infosystems<br />
              Legal Department<br />
              123 Healthcare Blvd<br />
              Seattle, WA 98101<br />
              USA
            </address>
          </div>
        </div>
      </div>
    </div>
  )
}