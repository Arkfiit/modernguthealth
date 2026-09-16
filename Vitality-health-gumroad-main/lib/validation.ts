import { z } from "zod";

export const signupSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  program: z.enum(["men", "women"]),
});

export type SignupInput = z.infer<typeof signupSchema>;


