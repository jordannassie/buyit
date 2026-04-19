export const metadata = { title: 'Privacy Policy — Selli' }

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-black mb-2">Privacy Policy</h1>
      <p className="text-neutral-500 text-sm mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <div className="prose prose-neutral max-w-none text-sm text-neutral-700 space-y-6">
        <p>Selli ("we", "our", "us") is committed to protecting your privacy. This policy explains what data we collect and how we use it.</p>
        <h2 className="text-base font-semibold text-black">Data We Collect</h2>
        <p>We collect your email address and name when you sign up, billing information processed by Stripe, and information you provide about your products.</p>
        <h2 className="text-base font-semibold text-black">How We Use Your Data</h2>
        <p>We use your data to provide Selli's services, process payments, and communicate with you about your account.</p>
        <h2 className="text-base font-semibold text-black">Third Parties</h2>
        <p>We use Supabase for database and authentication, Stripe for payment processing. We do not sell your data.</p>
        <h2 className="text-base font-semibold text-black">Contact</h2>
        <p>Questions? Email us at hello@selli.app</p>
      </div>
    </div>
  )
}
