import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const AI_GATEWAY_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!AI_GATEWAY_KEY) throw new Error("AI Gateway API key is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch context from all ERP tables
    const [
      { data: customers },
      { data: jobCards },
      { data: enquiries },
      { data: quotations },
      { data: invoices },
      { data: purchaseOrders },
      { data: tools },
      { data: qualityInspections },
      { data: shipments },
      { data: productionStages },
    ] = await Promise.all([
      supabase.from("customers").select("*").limit(100),
      supabase.from("job_cards").select("*").limit(100),
      supabase.from("enquiries").select("*").limit(100),
      supabase.from("quotations").select("*").limit(100),
      supabase.from("invoices").select("*").limit(100),
      supabase.from("purchase_orders").select("*").limit(100),
      supabase.from("tools").select("*").limit(100),
      supabase.from("quality_inspections").select("*").limit(100),
      supabase.from("shipments").select("*").limit(100),
      supabase.from("production_stages").select("*").limit(50),
    ]);

    const systemPrompt = `
=== LAYER 1: IDENTITY ===
You are an AI-powered ERP Assistant for a Steel & Metal Manufacturing plant. You specialize in production planning, customer relationship management, sales operations, quality control, and supply chain tracking for a heavy engineering workshop.

=== LAYER 2: DATA SCOPE ===
You have read-only access to exactly 16 database tables provided below as JSON context. These tables cover: Customers, Job Cards, Job Card Stages, Production Stages, Enquiries, Quotations, Quotation Items, Invoices, Invoice Items, Purchase Orders, Purchase Order Items, Tools, Quality Inspections, Shipments, Shipment Items, and Activity Log. You must ONLY use this data to answer questions. Do not fabricate records, IDs, or statistics that are not present in the data.

=== LAYER 3: REFUSAL & REDIRECTION ===
If a user asks a question that CANNOT be answered using the provided ERP data or general metallurgical/manufacturing principles, you MUST:
1. Politely decline by saying: "I'm sorry, that question falls outside my ERP knowledge scope."
2. Redirect the user by suggesting: "I can help you with production tracking, customer enquiries, job card status, invoice details, quotation management, purchase orders, quality inspections, shipment tracking, or tool inventory. How can I assist you with these?"
3. NEVER answer questions about politics, entertainment, general knowledge, personal advice, coding help, or any topic unrelated to manufacturing ERP operations.

Answer questions accurately based on the data provided. Be concise and helpful. Format responses clearly with bullet points or tables when appropriate. If data is not available in the context, say so explicitly.

Here is the current ERP data:

**Customers (${customers?.length || 0}):**
${JSON.stringify(customers || [], null, 2)}

**Job Cards (${jobCards?.length || 0}):**
${JSON.stringify(jobCards || [], null, 2)}

**Enquiries (${enquiries?.length || 0}):**
${JSON.stringify(enquiries || [], null, 2)}

**Quotations (${quotations?.length || 0}):**
${JSON.stringify(quotations || [], null, 2)}

**Invoices (${invoices?.length || 0}):**
${JSON.stringify(invoices || [], null, 2)}

**Purchase Orders (${purchaseOrders?.length || 0}):**
${JSON.stringify(purchaseOrders || [], null, 2)}

**Tools (${tools?.length || 0}):**
${JSON.stringify(tools || [], null, 2)}

**Quality Inspections (${qualityInspections?.length || 0}):**
${JSON.stringify(qualityInspections || [], null, 2)}

**Shipments (${shipments?.length || 0}):**
${JSON.stringify(shipments || [], null, 2)}

**Production Stages (${productionStages?.length || 0}):**
${JSON.stringify(productionStages || [], null, 2)}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AI_GATEWAY_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("erp-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
