import Link from "next/link";

export default function Disclaimer() {
  return (
    <div className="legal-container">
      <h1 className="legal-title">Medical Disclaimer</h1>
      
      <p className="legal-text-bold">
        The information provided on this website and in our programs is for educational and informational purposes only and does not constitute medical advice.
      </p>

      <p className="legal-text">
        Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this website.
      </p>

      <p className="legal-text">
        Reliance on any information provided by VitaCore, its employees, or others appearing on this site at the invitation of VitaCore is solely at your own risk. The site and its content are provided on an &quot;as is&quot; basis.
      </p>

      <div className="legal-back-container">
        <Link href="/" className="legal-back-link">
          <span>←</span> Back to Home
        </Link>
      </div>
    </div>
  );
}
