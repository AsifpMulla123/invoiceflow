import { z } from "zod";

export const lineItemSchema = z.object({
  description: z
    .string()
    .trim()
    .min(2, "Description must be at least 2 characters"),
  quantity: z.number().int().positive("Quantity must be a positive number"),
  rate: z.number().positive("Rate must be a positive number"),
});

export const invoiceSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  lineItems: z
    .array(lineItemSchema)
    .min(1, "At least one line item is required"),
  discount: z.number().min(0).default(0),
  dueDate: z
    .string()
    .refine((val) => new Date(val) >= new Date(new Date().toDateString()), {
      message: "Due date must be today or later",
    }),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;
