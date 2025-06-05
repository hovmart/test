import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Terms of Service | Hovmart Limited",
  description:
    "Read our terms of service and understand your rights and responsibilities when using Hovmart's platform.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-poppins">Terms of Service</h1>
            <p className="text-xl text-gray-600 font-poppins">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <Card className="bg-white/80 backdrop-blur-xl shadow-2xl border border-white/20">
            <CardContent className="p-8 md:p-12 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-poppins">1. Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed font-poppins">
                  By accessing and using Hovmart Limited's website and services, you accept and agree to be bound by the
                  terms and provision of this agreement. If you do not agree to abide by the above, please do not use
                  this service.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-poppins">2. Use License</h2>
                <p className="text-gray-700 leading-relaxed mb-4 font-poppins">
                  Permission is granted to temporarily download one copy of the materials on Hovmart Limited's website
                  for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer
                  of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 font-poppins">
                  <li>modify or copy the materials</li>
                  <li>
                    use the materials for any commercial purpose or for any public display (commercial or
                    non-commercial)
                  </li>
                  <li>attempt to decompile or reverse engineer any software contained on the website</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-poppins">3. Property Listings</h2>
                <p className="text-gray-700 leading-relaxed mb-4 font-poppins">
                  Hovmart Limited acts as a platform connecting property owners with potential buyers, renters, and
                  guests. We do not own, operate, manage or control any of the properties listed on our platform.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 font-poppins">
                  <li>All property information is provided by property owners or their authorized agents</li>
                  <li>We strive to verify property information but cannot guarantee its accuracy</li>
                  <li>Users are responsible for conducting their own due diligence before making any transactions</li>
                  <li>Hovmart Limited is not responsible for any disputes between users and property owners</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-poppins">4. User Accounts</h2>
                <p className="text-gray-700 leading-relaxed mb-4 font-poppins">
                  When you create an account with us, you must provide information that is accurate, complete, and
                  current at all times. You are responsible for safeguarding the password and for all activities that
                  occur under your account.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 font-poppins">
                  <li>You must be at least 18 years old to create an account</li>
                  <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                  <li>You must notify us immediately of any unauthorized use of your account</li>
                  <li>We reserve the right to suspend or terminate accounts that violate our terms</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-poppins">5. Payments and Fees</h2>
                <p className="text-gray-700 leading-relaxed mb-4 font-poppins">
                  Hovmart Limited may charge fees for certain services. All fees are clearly disclosed before you
                  complete any transaction.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 font-poppins">
                  <li>Service fees are non-refundable unless otherwise stated</li>
                  <li>Payment processing is handled by third-party providers</li>
                  <li>You are responsible for any taxes applicable to your transactions</li>
                  <li>Prices are subject to change with notice</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-poppins">6. Prohibited Uses</h2>
                <p className="text-gray-700 leading-relaxed mb-4 font-poppins">You may not use our service:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 font-poppins">
                  <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>
                    To violate any international, federal, provincial, or state regulations, rules, laws, or local
                    ordinances
                  </li>
                  <li>
                    To infringe upon or violate our intellectual property rights or the intellectual property rights of
                    others
                  </li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>To submit false or misleading information</li>
                  <li>To upload or transmit viruses or any other type of malicious code</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-poppins">7. Disclaimer</h2>
                <p className="text-gray-700 leading-relaxed font-poppins">
                  The information on this website is provided on an 'as is' basis. To the fullest extent permitted by
                  law, this Company excludes all representations, warranties, conditions and terms whether express or
                  implied, statutory or otherwise.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-poppins">8. Limitations</h2>
                <p className="text-gray-700 leading-relaxed font-poppins">
                  In no event shall Hovmart Limited or its suppliers be liable for any damages (including, without
                  limitation, damages for loss of data or profit, or due to business interruption) arising out of the
                  use or inability to use the materials on Hovmart Limited's website.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-poppins">9. Governing Law</h2>
                <p className="text-gray-700 leading-relaxed font-poppins">
                  These terms and conditions are governed by and construed in accordance with the laws of Nigeria and
                  you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-poppins">10. Contact Information</h2>
                <p className="text-gray-700 leading-relaxed font-poppins">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-900 font-poppins">Hovmart Limited</p>
                  <p className="text-gray-700 font-poppins">Email: legal@hovmart.com</p>
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
