import { NextResponse } from "next/server";
import { CORS_HEADERS } from "@/lib/http/cors";
import { extractSourceDomain, isDomainAllowed } from "@/lib/http/domain";
import { calculatePrice } from "@/lib/calculator/engine";
import { toCalculatorConfig, type RawCalculator } from "@/lib/calculator/mapper";
import type { AnswersMap } from "@/lib/calculator/types";
import { isValidEmail, isValidPolishPhone } from "@/lib/calculator/validation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";

const CALCULATOR_SELECT =
  "id,name,base_price,currency,estimate_spread_percent,accent_color,locale,corner_style,bg_color,text_color,border_color,allowed_domain,questions(id,label,type,config,position,required,options(id,label,price_delta,price_multiplier,position))";

interface LeadRequestBody {
  name?: string;
  email?: string;
  phone?: string;
  answers?: AnswersMap;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  let body: LeadRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const phone = body.phone?.trim();
  const answers = body.answers ?? {};

  if (!name || !email || !phone) {
    return NextResponse.json(
      { error: "name, email, and phone are required" },
      { status: 400, headers: CORS_HEADERS },
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Invalid email" },
      { status: 400, headers: CORS_HEADERS },
    );
  }
  if (!isValidPolishPhone(phone)) {
    return NextResponse.json(
      { error: "Invalid phone" },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  const supabase = createPublicClient();
  const { data, error: fetchError } = await supabase
    .from("calculators")
    .select(CALCULATOR_SELECT)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (fetchError || !data) {
    return NextResponse.json(
      { error: "Calculator not found" },
      { status: 404, headers: CORS_HEADERS },
    );
  }

  const raw = data as unknown as RawCalculator & { allowed_domain: string | null };

  if (!isDomainAllowed(raw.allowed_domain, extractSourceDomain(request))) {
    return NextResponse.json(
      { error: "Domain not allowed" },
      { status: 403, headers: CORS_HEADERS },
    );
  }

  const config = toCalculatorConfig(raw);

  let estimate;
  try {
    estimate = calculatePrice(config, answers);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Invalid answers" },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  const admin = createAdminClient();
  const { error: insertError } = await admin.from("leads").insert({
    calculator_id: config.id,
    name,
    email,
    phone,
    answers,
    estimated_min: estimate.min,
    estimated_max: estimate.max,
    source_domain: extractSourceDomain(request),
  });

  if (insertError) {
    return NextResponse.json(
      { error: "Failed to save lead" },
      { status: 500, headers: CORS_HEADERS },
    );
  }

  return NextResponse.json(
    { min: estimate.min, max: estimate.max, currency: estimate.currency },
    { headers: CORS_HEADERS },
  );
}
