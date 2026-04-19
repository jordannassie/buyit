export const metadata = { title: 'Terms of Service — Selli' }

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-black mb-2">Terms of Service</h1>
      <p className="text-neutral-500 text-sm mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <div className="prose prose-neutral max-w-none text-sm text-neutral-700 space-y-6">
        <p>By using Selli, you agree to these terms. Please read them carefully.</p>
        <h2 className="text-base font-semibold text-black">Use of Service</h2>
        <p>Selli provides tools to create product pages and accept payments. You are responsible for your products and complying with applicable laws.</p>
        <h2 className="text-base font-semibold text-black">Payments</h2>
        <p>Payments are processed by Stripe. Selli does not store your payment card details. Your Stripe account governs payouts.</p>
        <h2 className="text-base font-semibold text-black">Prohibited Use</h2>
        <p>You may not use Selli to sell illegal products, infringe intellectual property, or engage in fraud.</p>
        <h2 className="text-base font-semibold text-black">Termination</h2>
        <p>We reserve the right to suspend accounts that violate these terms.</p>
        <h2 className="text-base font-semibold text-black">Contact</h2>
        <p>Questions? Email us at hello@selli.app</p>
      </div>
    </div>
  )
}
