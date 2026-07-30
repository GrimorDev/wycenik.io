import { NextResponse } from "next/server";
import { CORS_HEADERS } from "@/lib/http/cors";
import { toCalculatorConfig, type RawCalculator } from "@/lib/calculator/mapper";
import { createPublicClient } from "@/lib/supabase/public";

const CALCULATOR_SELECT =
  "id,name,base_price,currency,estimate_spread_percent,questions(id,label,type,config,position,required,options(id,label,price_delta,price_multiplier,position))";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(
  _request: Request,
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

  return NextResponse.json(toCalculatorConfig(data as unknown as RawCalculator), {
    headers: CORS_HEADERS,
  });
}
