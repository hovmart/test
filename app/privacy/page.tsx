import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Privacy Policy | Hovmart Limited",
  description: "Learn how Hovmart Limited collects, uses, and protects your personal information.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-poppins">Privacy Policy</h1>
            <p className="text-xl text-gray-600 font-poppins">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <Card className="bg-white/80 backdrop-blur-xl shadow-2xl border border-white/20">
            <CardContent className="p-8 md:p-12 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-poppins">1. Information We Collect</h2>
                <p className="text-gray-700 leading-relaxed mb-4 font-poppins">
                  We collect information you provide directly to us, such as when you create an account, make a booking,
                  or contact us for support.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-poppins">Personal Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4 font-poppins">
                  <li>Name, email address, and phone number</li>
                  <li>Profile information and preferences</li>
                  <li>Payment information (processed securely by third parties)</li>
                  <li>Communication preferences</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-poppins">Usage Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 font-poppins">
                  <li>Pages visited and features used</li>
                  <li>Search queries and filters applied</li>
                  <li>Device information and IP address</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-poppins">
                  2. How We Use Your Information
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4 font-poppins">
                  We use the information we collect to provide, maintain, and improve our services:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 font-poppins">
                  <li>Process bookings and transactions</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Send important updates about your account or bookings</li>
                  <li>Personalize your experience and show relevant properties</li>
                  <li>Improve our platform and develop new features</li>
                  <li>Prevent fraud and ensure platform security</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-poppins">3. Information Sharing</h2>
                <p className="text-gray-700 leading-relaxed mb-4 font-poppins">
                  We do not sell, trade, or otherwise transfer your personal information to third parties except as
                  described below:
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-poppins">With Property Owners</h3>
                <p className="text-gray-700 leading-relaxed mb-4 font-poppins">
                  When you make a booking, we share necessary information with property owners to facilitate your stay.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-poppins">Service Providers</h3>
                <p className="text-gray-700 leading-relaxed mb-4 font-poppins">
                  We work with trusted third-party service providers who help us operate our platform, including payment
                  processors, email services, and analytics providers.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-poppins">Legal Requirements</h3>
                <p className="text-gray-700 leading-relaxed font-poppins">
                  We may disclose your information when required by law or to protect our rights, property, or safety.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-poppins">4. Data Security</h2>
                <p className="text-gray-700 leading-relaxed mb-4 font-poppins">
                  We implement appropriate security measures to protect your personal information:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 font-poppins">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and authentication measures</li>
                  <li>Secure payment processing through certified providers</li>
                  <li>Employee training on data protection practices</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-poppins">5. Your Rights and Choices</h2>
                <p className="text-gray-700 leading-relaxed mb-4 font-poppins">
                  You have several rights regarding your personal information:
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-poppins">Access and Update</h3>
                <p className="text-gray-700 leading-relaxed mb-4 font-poppins">
                  You can access and update your account information at any time through your profile settings.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-poppins">Data Portability</h3>
                <p className="text-gray-700 leading-relaxed mb-4 font-poppins">
                  You can request a copy of your personal data in a structured, machine-readable format.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-poppins">Deletion</h3>
                <p className="text-gray-700 leading-relaxed mb-4 font-poppins">
                  You can request deletion of your account and personal data, subject to legal retention requirements.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-poppins">Communication Preferences</h3>
                <p className="text-gray-700 leading-relaxed font-poppins">
                  You can opt out of marketing communications at any time by using the unsubscribe link in emails or
                  updating your preferences.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-poppins">6. Cookies and Tracking</h2>
                <p className="text-gray-700 leading-relaxed mb-4 font-poppins">
                  We use cookies and similar technologies to enhance your experience:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 font-poppins">
                  <li>
                    <strong>Essential Cookies:</strong> Required for basic platform functionality
                  </li>
                  <li>
                    <strong>Analytics Cookies:</strong> Help us understand how you use our platform
                  </li>
                  <li>
                    <strong>Preference Cookies:</strong> Remember your settings and preferences
                  </li>
                  <li>
                    <strong>Marketing Cookies:</strong> Used to show relevant advertisements
                  </li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4 font-poppins">
                  You can control cookie settings through your browser preferences.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-poppins">7. Data Retention</h2>
                <p className="text-gray-700 leading-relaxed font-poppins">
                  We retain your personal information for as long as necessary to provide our services and comply with
                  legal obligations. When you delete your account, we will delete or anonymize your personal information
                  within 30 days, except where retention is required by law.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-poppins">8. International Transfers</h2>
                <p className="text-gray-700 leading-relaxed font-poppins">
                  Your information may be transferred to and processed in countries other than your own. We ensure
                  appropriate safeguards are in place to protect your personal information in accordance with applicable
                  data protection laws.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-poppins">9. Children's Privacy</h2>
                <p className="text-gray-700 leading-relaxed font-poppins">
                  Our services are not intended for children under 18 years of age. We do not knowingly collect personal
                  information from children under 18. If you become aware that a child has provided us with personal
                  information, please contact us immediately.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-poppins">10. Changes to This Policy</h2>
                <p className="text-gray-700 leading-relaxed font-poppins">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                  new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this
                  Privacy Policy periodically.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-poppins">11. Contact Us</h2>
                <p className="text-gray-700 leading-relaxed mb-4 font-poppins">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-900 font-poppins">Hovmart Limited - Privacy Team</p>
                  <p className="text-gray-700 font-poppins">Email: privacy@hovmart.com</p>
                  <p className="text-gray-700 font-poppins">Phone: +234 (0) 123 456 7890</p>
                  <p className="text-gray-700 font-poppins">Address: Lagos, Nigeria</p>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
