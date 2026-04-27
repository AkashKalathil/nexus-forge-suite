import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// === TOOL DEFINITIONS (function-calling schema) ===
const tools = [
  {
    type: "function",
    function: {
      name: "create_customer",
      description:
        "Create a new customer record in the ERP. Use when the user wants to add/register/onboard a customer.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Company or customer full name" },
          email: { type: "string", description: "Email address (optional)" },
          phone: { type: "string", description: "Phone number (optional)" },
          address: { type: "string", description: "Physical address (optional)" },
          contact_person: { type: "string", description: "Primary contact person (optional)" },
          industry: { type: "string", description: "Industry sector (optional)" },
        },
        required: ["name"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_enquiry",
      description:
        "Create a new sales enquiry. Use when the user wants to log a customer enquiry, lead, or RFQ.",
      parameters: {
        type: "object",
        properties: {
          customer_name: { type: "string" },
          subject: { type: "string", description: "Short subject line for the enquiry" },
          description: { type: "string", description: "Details of what the customer is asking for" },
          customer_email: { type: "string" },
          customer_phone: { type: "string" },
          priority: { type: "string", enum: ["low", "medium", "high", "urgent"] },
          estimated_value: { type: "number", description: "Estimated value in INR (optional)" },
          follow_up_date: { type: "string", description: "ISO date YYYY-MM-DD (optional)" },
        },
        required: ["customer_name", "subject"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_job_card",
      description:
        "Create a new production job card. Use when the user wants to start/open a job, work order, or production task.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Short title of the job" },
          description: { type: "string", description: "Detailed scope of work (optional)" },
          customer_name: {
            type: "string",
            description: "Existing customer name to link (optional, fuzzy matched)",
          },
          priority: { type: "string", enum: ["low", "medium", "high", "urgent"] },
          assigned_to: { type: "string", description: "Person/team assigned (optional)" },
          due_date: { type: "string", description: "ISO date YYYY-MM-DD (optional)" },
          estimated_hours: { type: "number" },
        },
        required: ["title"],
        additionalProperties: false,
      },
    },
  },
];

async function executeTool(
  supabase: ReturnType<typeof createClient>,
  name: string,
  args: Record<string, any>
): Promise<{ ok: boolean; data?: any; error?: string }> {
  try {
    if (name === "create_customer") {
      const { data, error } = await supabase
        .from("customers")
        .insert([{ ...args, status: "active" }])
        .select()
        .single();
      if (error) return { ok: false, error: error.message };
      return { ok: true, data };
    }

    if (name === "create_enquiry") {
      const enquiry_id = `ENQ-${Date.now().toString().slice(-6)}`;
      const { data, error } = await supabase
        .from("enquiries")
        .insert([{ ...args, enquiry_id, status: "new", priority: args.priority || "medium" }])
        .select()
        .single();
      if (error) return { ok: false, error: error.message };
      return { ok: true, data };
    }

    if (name === "create_job_card") {
      let customer_id: string | undefined;
      if (args.customer_name) {
        const { data: cust } = await supabase
          .from("customers")
          .select("id, name")
          .ilike("name", `%${args.customer_name}%`)
          .limit(1)
          .maybeSingle();
        if (cust) customer_id = cust.id;
      }
      const job_number = `JOB-${Date.now().toString().slice(-6)}`;
      const payload: any = {
        job_number,
        title: args.title,
        description: args.description,
        priority: args.priority || "medium",
        status: "pending",
        assigned_to: args.assigned_to,
        due_date: args.due_date,
        estimated_hours: args.estimated_hours,
      };
      if (customer_id) payload.customer_id = customer_id;
      const { data, error } = await supabase.from("job_cards").insert([payload]).select().single();
      if (error) return { ok: false, error: error.message };
      return { ok: true, data };
    }

    return { ok: false, error: `Unknown tool: ${name}` };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Tool execution failed" };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, mode } = await req.json();
    const AI_GATEWAY_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!AI_GATEWAY_KEY) throw new Error("AI Gateway API key is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const isCreateMode = mode === "create";

    // Fetch context (only needed for ask mode, but useful for both)
    const [
      { data: customers },
      { data: jobCards },
      { data: enquiries },
      { data: quotations },
      { data: invoices },
      { data: purchaseOrders },
      { data: tools_data },
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

    const askPrompt = `
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

**Tools (${tools_data?.length || 0}):**
${JSON.stringify(tools_data || [], null, 2)}

**Quality Inspections (${qualityInspections?.length || 0}):**
${JSON.stringify(qualityInspections || [], null, 2)}

**Shipments (${shipments?.length || 0}):**
${JSON.stringify(shipments || [], null, 2)}

**Production Stages (${productionStages?.length || 0}):**
${JSON.stringify(productionStages || [], null, 2)}`;

    const createPrompt = `
=== LAYER 1: IDENTITY ===
You are an AI Data-Entry Assistant for a Steel & Metal Manufacturing ERP. Your job is to help non-technical shop-floor staff add records to the system through a friendly conversation.

=== LAYER 2: DATA SCOPE ===
You can create records in exactly THREE tables using the provided tools:
- create_customer (add a new customer/client)
- create_enquiry (log a sales enquiry/lead)
- create_job_card (open a production job)

Existing customers (for fuzzy matching when creating job cards):
${JSON.stringify((customers || []).map((c: any) => ({ name: c.name })), null, 2)}

=== LAYER 3: CONVERSATIONAL RULES ===
1. Be warm, simple, and patient. Avoid jargon. Talk like a helpful colleague.
2. When the user wants to add data, ask for ONE or TWO missing fields at a time — never overwhelm.
3. Required fields:
   - Customer: name (only)
   - Enquiry: customer_name, subject
   - Job Card: title
   All other fields are optional — if the user doesn't mention them, don't insist.
4. BEFORE calling a tool, summarise what you're about to create in plain English and ask "Shall I save this?" — wait for confirmation (yes/ok/save/go ahead).
5. After the tool runs, confirm success in one short friendly sentence with the new ID/number, and ask if they want to add another.
6. If a tool returns an error, apologise plainly and suggest what to fix.
7. REFUSAL: If the user asks anything outside data entry (general knowledge, off-topic), say: "I'm here to help you add records to the ERP — customers, enquiries, or job cards. What would you like to add?"`;

    const systemPrompt = isCreateMode ? createPrompt : askPrompt;

    // === Tool-calling loop (non-streaming for create mode) ===
    if (isCreateMode) {
      const convo: any[] = [{ role: "system", content: systemPrompt }, ...messages];
      const toolEvents: any[] = [];

      for (let iter = 0; iter < 5; iter++) {
        const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AI_GATEWAY_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: convo,
            tools,
            tool_choice: "auto",
          }),
        });

        if (!aiResp.ok) {
          const t = await aiResp.text();
          console.error("AI gateway error:", aiResp.status, t);
          if (aiResp.status === 429) {
            return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), {
              status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          if (aiResp.status === 402) {
            return new Response(JSON.stringify({ error: "Payment required, please add credits." }), {
              status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          return new Response(JSON.stringify({ error: "AI service error" }), {
            status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const json = await aiResp.json();
        const msg = json.choices?.[0]?.message;
        if (!msg) break;

        const toolCalls = msg.tool_calls || [];
        if (toolCalls.length === 0) {
          // Final assistant text
          return new Response(
            JSON.stringify({ content: msg.content || "", toolEvents }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Append assistant message with tool_calls
        convo.push(msg);

        // Execute each tool
        for (const call of toolCalls) {
          const fname = call.function?.name;
          let fargs: any = {};
          try { fargs = JSON.parse(call.function?.arguments || "{}"); } catch {}
          const result = await executeTool(supabase, fname, fargs);
          toolEvents.push({ name: fname, args: fargs, result });
          convo.push({
            role: "tool",
            tool_call_id: call.id,
            content: JSON.stringify(result),
          });
        }
      }

      return new Response(
        JSON.stringify({ content: "Done.", toolEvents }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // === ASK MODE: streaming as before ===
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AI_GATEWAY_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
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
