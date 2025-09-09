'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-purple-100 dark:border-purple-900">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              <strong>Last Updated:</strong> September 8, 2025
            </p>
            
            <p className="mb-6">
              Clinch Infosystems ("we", "our", or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you visit our website clinicaseai.com and use our healthcare management platform 
              (the "Service"). Please read this privacy policy carefully. If you do not agree with 
              the terms of this privacy policy, please do not access the Service.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">Personal Information</h3>
            <p className="mb-4">
              We collect personal information that you voluntarily provide to us when you register 
              on the Service, express an interest in obtaining information about us or our products 
              and services, when you participate in activities on the Service, or otherwise when 
              you contact us. The personal information we collect may include:
            </p>
            <ul className="list-disc pl-8 mb-6 space-y-2">
              <li>Personal identification information (name, email address, phone number)</li>
              <li>Business information (practice name, address, tax ID)</li>
              <li>Professional credentials (medical license numbers)</li>
              <li>Payment information (credit card details, bank account information)</li>
              <li>Healthcare information (patient data, medical records, appointment details)</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">Usage Data</h3>
            <p className="mb-4">
              We may also automatically collect information about your activity on our Service, including:
            </p>
            <ul className="list-disc pl-8 mb-6 space-y-2">
              <li>IP address and browser type</li>
              <li>Device information and operating system</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website and exit pages</li>
              <li>Click patterns and navigation paths</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">2. Use of Your Information</h2>
            <p className="mb-4">
              Having accurate information about you helps us provide better service and comply with 
              healthcare regulations. We may use the information we collect for various purposes:
            </p>
            <ul className="list-disc pl-8 mb-6 space-y-2">
              <li>To provide and maintain our Service</li>
              <li>To manage your account and registration</li>
              <li>To process transactions and send related information</li>
              <li>To send you technical notices and support messages</li>
              <li>To respond to your comments, questions, and requests</li>
              <li>To monitor and analyze usage trends and preferences</li>
              <li>To detect, prevent, and address technical issues</li>
              <li>To comply with legal obligations and healthcare regulations</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">3. HIPAA Compliance</h2>
            <p className="mb-4">
              As a healthcare technology provider, we take HIPAA compliance seriously. We implement 
              administrative, physical, and technical safeguards to protect electronic protected 
              health information (ePHI) in accordance with HIPAA regulations. Our platform:
            </p>
            <ul className="list-disc pl-8 mb-6 space-y-2">
              <li>Uses encryption for data in transit and at rest</li>
              <li>Maintains audit logs of all access to patient data</li>
              <li>Requires role-based access controls</li>
              <li>Implements secure authentication mechanisms</li>
              <li>Provides business associate agreements (BAAs) to covered entities</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">4. Data Sharing and Disclosure</h2>
            <p className="mb-4">
              We may share information we collect or receive in the following situations:
            </p>
            <ul className="list-disc pl-8 mb-6 space-y-2">
              <li><strong>With Service Providers:</strong> We may share your information with third-party vendors who perform services on our behalf.</li>
              <li><strong>For Legal Reasons:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
              <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition.</li>
              <li><strong>With Your Consent:</strong> We may disclose your information for any other purpose with your consent.</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">5. Data Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational security measures to protect 
              the security of your personal information. However, please note that no method of 
              transmission over the Internet or method of electronic storage is 100% secure.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">6. Data Retention</h2>
            <p className="mb-4">
              We will retain your information for as long as necessary to fulfill the purposes 
              outlined in this Privacy Policy unless a longer retention period is required or 
              permitted by law. Healthcare data is retained in accordance with applicable 
              medical record retention laws.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">7. Your Rights</h2>
            <p className="mb-4">
              Depending on your location and applicable laws, you may have certain rights regarding 
              your personal information, including:
            </p>
            <ul className="list-disc pl-8 mb-6 space-y-2">
              <li>The right to access, update, or delete your information</li>
              <li>The right to data portability</li>
              <li>The right to restrict or object to processing</li>
              <li>The right to withdraw consent</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">8. Children's Privacy</h2>
            <p className="mb-4">
              Our Service does not address anyone under the age of 18. We do not knowingly collect 
              personally identifiable information from anyone under the age of 18. If we become 
              aware that we have collected personal information from someone under 18, we will 
              take steps to remove that information from our servers.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">9. Changes to This Privacy Policy</h2>
            <p className="mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the "Last Updated" date. 
              You are advised to review this Privacy Policy periodically for any changes.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">10. Contact Us</h2>
            <p className="mb-4">
              If you have questions or comments about this policy, you may email us at:
              <a href="mailto:privacy@clinceaseai.com" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
                privacy@clinceaseai.com
              </a>
            </p>
            <p className="mb-4">
              Or write to us at:
            </p>
            <address className="not-italic mb-6">
              Clinch Infosystems<br />
              Privacy Officer<br />
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