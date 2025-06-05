import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-hovmart-purple/5 via-white to-hovmart-light/5">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Hovmart</h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary: "bg-hovmart-purple hover:bg-hovmart-dark",
              card: "shadow-2xl border-0",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
            },
          }}
          redirectUrl="/properties"
        />
      </div>
    </div>
  )
}
