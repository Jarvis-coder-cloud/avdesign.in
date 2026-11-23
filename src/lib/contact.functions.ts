import { createServerFn } from "@tanstack/react-start";

import { enquirySchema } from "./contact-schema";

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input) => enquirySchema.parse(input))
  .handler(async ({ data }) => {
    const rateLimitWindow = new Date(Math.floor(Date.now() / 60_000) * 60_000).toISOString();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: saved, error } = await supabaseAdmin
      .from("contact_submissions")
      .insert({ ...data, rate_limit_window: rateLimitWindow })
      .select("id")
      .maybeSingle();

    if (error?.code === "23505") {
      return { ok: false as const, reason: "rate_limited" as const };
    }
    if (error || !saved) throw new Error("Unable to save enquiry.");

    return { ok: true as const };
  });