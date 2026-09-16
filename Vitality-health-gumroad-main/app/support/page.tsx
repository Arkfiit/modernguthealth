import Link from "next/link";

export default function Support() {
  return (
    <div className="legal-container">
      <h1 className="legal-title">Support</h1>
      <p className="legal-text">
        If you need assistance with your account, accessing the program, or have any technical issues, our team is here to help.
      </p>
      
      <h2 className="legal-subtitle">Contact Us</h2>
      <ul className="legal-list">
        <li>
          <strong>General Support:</strong> <a href="mailto:support@vitalitysexualhealth.site" className="legal-link">support@vitalitysexualhealth.site</a>
        </li>
        <li>
          <strong>Expert Guidance &amp; Specific Program Questions:</strong> <a href="mailto:experts@vitalitysexualhealth.site" className="legal-link">experts@vitalitysexualhealth.site</a>
        </li>
      </ul>

      <div className="legal-back-container">
        <Link href="/" className="legal-back-link">
          <span>←</span> Back to Home
        </Link>
      </div>
    </div>
  );
}
