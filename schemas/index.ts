import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

// signup form şemasının içine custodyType adında bir parametre daha oluşturacağız.
// custodyType string ve enum olacak ve değerleri END_USER ve DEVELOPER olacak.

export const SignupFormSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  custodyType: z.enum(["END_USER", "DEVELOPER"]),
});
