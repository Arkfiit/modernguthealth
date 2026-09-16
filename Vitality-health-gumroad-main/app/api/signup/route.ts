import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { signupSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = signupSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const lead = await prisma.lead.create({
    data: {
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      program: parsed.data.program,
    },
    select: { id: true, program: true },
  });

  return NextResponse.json({ leadId: lead.id, program: lead.program });
}


