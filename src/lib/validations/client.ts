import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  gstin: z.string().trim().optional().or(z.literal("")),
  email: z.string().trim().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  state: z.string().trim().min(1, "State is required"),
  country: z.string().trim().default("India"),
});

export type ClientInput = z.infer<typeof clientSchema>;
