import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-16 pt-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <svg className="w-12 h-12" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M53.5529 13.0146C53.5529 10.2546 52.081 7.71957 49.708 6.35457L42.1534 1.98957C39.7804 0.62457 36.8517 0.62457 34.4637 1.98957L4.20034 19.4346C1.82733 20.8146 0.355469 23.3496 0.355469 26.0796V28.6146C0.355469 31.3596 1.82733 33.8946 4.20034 35.2596L34.4637 52.7196C36.8367 54.0846 39.7654 54.0846 42.1534 52.7196L49.708 48.3546C52.081 46.9896 53.5529 44.4546 53.5529 41.7096C53.5529 37.4646 50.1135 34.0296 45.8631 34.0296H38.7741V40.4496L16.1405 27.3996L38.7741 14.3496V20.6946H45.8631C50.1135 20.6946 53.5529 17.2596 53.5529 13.0146Z"/>
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            ClinicEase <span className="bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">AI</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-600 dark:text-blue-300 max-w-3xl mx-auto font-medium mb-10">
            Streamlining appointment scheduling, patient management, billing, and clinical support 
            for small to mid-size healthcare clinics across the USA
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/login?role=staff">
              <Button size="lg" className="px-8 py-6 text-lg clinic-gradient text-white shadow-lg hover:shadow-xl transition-all">
                Staff Login
              </Button>
            </Link>
            <Link href="/login?role=patient">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 shadow-lg hover:shadow-xl transition-all">
                Patient Portal
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader>
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <CardTitle className="text-2xl text-gray-900 dark:text-white">Smart Scheduling</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-lg">
                AI-powered appointment scheduling with no-show prediction and automated overbooking
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader>
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <CardTitle className="text-2xl text-gray-900 dark:text-white">Intelligent Billing</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-lg">
                Automated ICD-10/CPT coding with beautiful visual progress tracking and Stripe integration
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader>
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                <svg className="w-10 h-10 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <CardTitle className="text-2xl text-gray-900 dark:text-white">Patient Portal</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-lg">
                Comprehensive patient management with secure messaging, records, and payment processing
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-md">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">95%</div>
            <div className="text-gray-600 dark:text-gray-300">Appointment Efficiency</div>
          </div>
          <div className="text-center p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-md">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">80%</div>
            <div className="text-gray-600 dark:text-gray-300">Billing Accuracy</div>
          </div>
          <div className="text-center p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-md">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">24/7</div>
            <div className="text-gray-600 dark:text-gray-300">Support Available</div>
          </div>
          <div className="text-center p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-md">
            <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-2">10K+</div>
            <div className="text-gray-600 dark:text-gray-300">Happy Clinics</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mb-16">
          <Card className="max-w-3xl mx-auto border-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl">
            <CardHeader>
              <CardTitle className="text-3xl mb-4">Transform Your Healthcare Practice</CardTitle>
              <CardDescription className="text-xl text-gray-700 dark:text-gray-300">
                Join thousands of healthcare providers who trust ClinicEase AI to streamline their operations
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center pb-8">
              <Link href="/login?role=staff">
                <Button size="lg" className="px-8 py-6 text-lg clinic-gradient text-white shadow-lg hover:shadow-xl transition-all">
                  Get Started Today
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 shadow-lg hover:shadow-xl transition-all">
                  Schedule a Demo
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="py-8 text-center text-gray-600 dark:text-gray-400">
          <div className="flex flex-wrap justify-center gap-8 mb-6">
            <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</Link>
            <Link href="/pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</Link>
            <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</Link>
            <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</Link>
            <div className="relative group">
              <button className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center">
                Resources
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <Link href="/blog" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Blog</Link>
                <Link href="/docs" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Documentation</Link>
                <Link href="/support" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Support</Link>
                <Link href="/faq" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">FAQs</Link>
              </div>
            </div>
          </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} Clinch Infosystems. HIPAA-compliant healthcare management system.</p>
        </footer>
      </div>
    </main>
  )
}