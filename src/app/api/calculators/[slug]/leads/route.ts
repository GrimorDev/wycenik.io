import { NextResponse } from "next/server";
import { CORS_HEADERS } from "@/lib/http/cors";
import { extractSourceDomain } from "@/lib/http/domain";
import { calculatePrice } from "@/lib/calculator/engine";
import { toCalculatorConfig, type RawCalculator } from "@/lib/calculator/mapper";
import type { AnswersMap } from "@/lib/calculator/types";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";

const CALCULATOR_SELECT =
  "id,name,base_price,currency,estimate_spread_percent,accent_color,locale,questions(id,label,type,config,position,required,options(id,label,price_delta,price_multiplier,position))";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Invalid email" },
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

  const config = toCalculatorConfig(data as unknown as RawCalculator);

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
