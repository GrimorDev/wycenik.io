import { NextResponse } from "next/server";
import { CORS_HEADERS } from "@/lib/http/cors";
import { extractSourceDomain } from "@/lib/http/domain";
import { toCalculatorConfig, type RawCalculator } from "@/lib/calculator/mapper";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";

const CALCULATOR_SELECT =
  "id,name,base_price,currency,estimate_spread_percent,accent_color,locale,corner_style,bg_color,text_color,border_color,questions(id,label,type,config,position,required,options(id,label,price_delta,price_multiplier,position))";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("calculators")
    .select(CALCULATOR_SELECT)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Calculator not found" },
      { status: 404, headers: CORS_HEADERS },
    );
  }

  const calculator = data as unknown as RawCalculator;

  // Best-effort view logging; never let this fail the actual response.
  try {
    await createAdminClient()
      .from("calculator_views")
      .insert({ calculator_id: calculator.id, source_domain: extractSourceDomain(request) });
  } catch {
    // ignored
  }

  return NextResponse.json(toCalculatorConfig(calculator), {
    headers: CORS_HEADERS,
  });
}
