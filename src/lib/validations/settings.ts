import { z } from "zod";
import { INDIAN_STATES } from "@/lib/constants/indian-states";

export const settingsSchema = z.object({
  businessName: z.string().trim().min(1, "Business name is required").max(100),
  gstin: z.string().trim().optional().or(z.literal("")),
  state: z.enum(INDIAN_STATES, { message: "Select a valid state" }),
  bankDetails: z.string().trim().optional().or(z.literal("")),
  logoUrl: z
    .string()
    .trim()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
});
