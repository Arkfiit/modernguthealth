import Link from "next/link";

export default function Privacy() {
  return (
    <div className="legal-container">
      <h1 className="legal-title">Privacy Policy</h1>
      <p className="legal-text">Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2 className="legal-subtitle">1. Information We Collect</h2>
      <p className="legal-text">We collect information you provide directly to us when you create an account, participate in our program, or request support via email. This may include your name, email address, and program progress.</p>

      <h2 className="legal-subtitle">2. How We Use Your Information</h2>
      <p className="legal-text">We use the information we collect to provide, maintain, and improve our services, to process your transactions, to send you technical notices and support messages, and to personalize your experience.</p>

      <h2 className="legal-subtitle">3. Information Sharing</h2>
      <p className="legal-text">We do not share your personal data with third parties except as necessary to provide our services (such as secure authentication providers or payment processors), or when required by law.</p>

      <h2 className="legal-subtitle">4. Security</h2>
      <p className="legal-text">We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access.</p>

      <div className="legal-back-container">
        <Link href="/" className="legal-back-link">
          <span>←</span> Back to Home
        </Link>
      </div>
    </div>
  );
}
