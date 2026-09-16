import Link from "next/link";

export default function Terms() {
  return (
    <div className="legal-container">
      <h1 className="legal-title">Terms of Service</h1>
      
      <h2 className="legal-subtitle">1. Acceptance of Terms</h2>
      <p className="legal-text">By accessing or using our program and services, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access our services.</p>

      <h2 className="legal-subtitle">2. Use License</h2>
      <p className="legal-text">Permission is granted to temporarily view the materials on our platform for personal, non-commercial use only. You may not modify, copy, or distribute these materials without explicit written consent.</p>

      <h2 className="legal-subtitle">3. User Account</h2>
      <p className="legal-text">When you create an account with us, you must provide information that is accurate and complete. You are responsible for safeguarding the password that you use to access the service.</p>

      <h2 className="legal-subtitle">4. Refunds</h2>
      <p className="legal-text">We offer a money-back guarantee as outlined during the checkout process on Gumroad. Refunds are processed securely through Gumroad&apos;s platform according to their standard policy.</p>

      <h2 className="legal-subtitle">5. Limitations</h2>
      <p className="legal-text">In no event shall VitaCore be liable for any damages arising out of the use or inability to use the materials on our website.</p>

      <div className="legal-back-container">
        <Link href="/" className="legal-back-link">
          <span>←</span> Back to Home
        </Link>
      </div>
    </div>
  );
}
