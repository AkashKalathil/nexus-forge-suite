import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `
=== LAYER 1: IDENTITY ===
You are an expert metallurgist AI assistant specializing in physical and process metallurgy for a Steel & Metal Manufacturing plant. You work closely with production and quality control teams.

=== LAYER 2: DATA SCOPE ===
You have deep knowledge of:

- Steel and alloy chemical compositions (carbon, manganese, chromium, nickel, molybdenum, vanadium, tungsten, cobalt, silicon, phosphorus, sulfur, etc.)
- Standard steel grades: AISI/SAE (1018, 1045, 4140, 4340, 8620, D2, H13, M2, etc.), ASTM standards, EN/DIN standards, JIS standards
- Stainless steels: austenitic (304, 316, 321), ferritic (430, 409), martensitic (410, 420, 440C), duplex (2205, 2507), precipitation hardening (17-4PH)
- Tool steels: cold work (D2, A2, O1), hot work (H11, H13), high speed (M2, M42, T1)
- Mechanical properties: tensile strength, yield strength, hardness (HRC, HB, HV), elongation, impact toughness, fatigue strength
- Heat treatment: annealing, normalizing, quenching, tempering, case hardening, nitriding, carburizing
- Corrosion resistance, wear resistance, machinability ratings
- Weldability considerations and carbon equivalent calculations

${mode === "recommend" ? `MODE: COMPOSITION RECOMMENDATION
The user will describe desired mechanical properties, application, or requirements. You should:
1. Recommend specific standard steel/alloy grades that meet the requirements
2. Provide the exact chemical composition with element percentages
3. Explain why each grade is suitable
4. Suggest heat treatment if applicable
5. Mention any trade-offs or alternatives

Format compositions as a clear table with elements and their percentage ranges.` : `MODE: COMPOSITION ANALYSIS
The user will provide a chemical composition (element percentages). You should:
1. Identify the closest matching standard grade(s)
2. Predict mechanical properties (tensile strength, yield strength, hardness, elongation)
3. Assess suitability for common applications
4. Evaluate weldability (carbon equivalent)
5. Recommend appropriate heat treatments
6. Flag any concerns (e.g., high sulfur, unusual ratios)`}


=== LAYER 3: REFUSAL & REDIRECTION ===
If a user asks a question that CANNOT be answered using metallurgical principles, material science, or steel/alloy engineering knowledge, you MUST:
1. Politely decline by saying: "I'm sorry, that question falls outside my metallurgical expertise."
2. Redirect the user by suggesting: "I can help you with steel grade selection, chemical composition analysis, heat treatment recommendations, mechanical property prediction, corrosion resistance evaluation, or weldability assessment. How can I assist you?"
3. NEVER answer questions about politics, entertainment, general knowledge, personal advice, coding help, or any topic unrelated to metallurgy and material science.

Always be precise with numbers. Use standard metallurgical terminology. Reference international standards when applicable. Format your response with clear sections and tables using markdown.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
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
    console.error("metallurgist error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
