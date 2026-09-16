import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ leadId?: string }>;
}) {
  const { leadId } = await searchParams;

  const lead = leadId
    ? await prisma.lead.findUnique({
        where: { id: leadId },
        select: { fullName: true, email: true, program: true, createdAt: true },
      })
    : null;

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "120px 24px 80px",
        maxWidth: 980,
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <Link
          href="/"
          style={{
            color: "var(--text-muted)",
            textDecoration: "none",
            fontSize: 12,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          ← Back to landing
        </Link>
      </div>

      <h1
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 56,
          fontWeight: 300,
          lineHeight: 1,
          marginBottom: 16,
        }}
      >
        Your Dashboard
      </h1>

      {lead ? (
        <div
          style={{
            marginTop: 32,
            border: "1px solid var(--border)",
            background: "var(--dark-2)",
            padding: 32,
          }}
        >
          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 10,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "var(--gold)",
              marginBottom: 12,
            }}
          >
            Enrollment confirmed
          </p>

          <p style={{ color: "var(--text-muted)", marginBottom: 10 }}>
            <strong style={{ color: "var(--text)" }}>{lead.fullName}</strong> ·{" "}
            {lead.email}
          </p>

          <p style={{ color: "var(--text-muted)", marginBottom: 22 }}>
            Program:{" "}
            <strong style={{ color: "var(--text)" }}>
              {lead.program === "men"
                ? "Men's Vitality Program"
                : "Women's Intimate Health Program"}
            </strong>
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="btn-primary"
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              Start Lesson 1 →
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="btn-ghost"
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              View Program Roadmap
            </a>
          </div>
        </div>
      ) : (
        <div
          style={{
            marginTop: 32,
            border: "1px solid var(--border)",
            background: "var(--dark-2)",
            padding: 32,
          }}
        >
          <p style={{ color: "var(--text-muted)", lineHeight: 1.8 }}>
            No enrollment found. Go back to the landing page and sign up to generate
            your dashboard.
          </p>
        </div>
      )}
    </main>
  );
}


