import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, MessageSquare, PlusCircle, CheckCircle2, AlertCircle, UserPlus, FileText, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import { useQueryClient } from "@tanstack/react-query";

type ToolEvent = {
  name: string;
  args: Record<string, any>;
  result: { ok: boolean; data?: any; error?: string };
};

type Msg = {
  role: "user" | "assistant";
  content: string;
  toolEvents?: ToolEvent[];
};

type Mode = "ask" | "create";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/erp-chat`;

const MODE_INTRO: Record<Mode, { title: string; sub: string }> = {
  ask: {
    title: "Hi! I'm your ERP Assistant.",
    sub: "Ask me about customers, job cards, invoices, quotations, or anything in the system.",
  },
  create: {
    title: "Let's add something to your ERP.",
    sub: "Just tell me what you'd like to create — a customer, an enquiry, or a job card. I'll guide you step by step.",
  },
};

const QUICK_ACTIONS: { label: string; prompt: string; icon: typeof UserPlus }[] = [
  { label: "Add Customer", prompt: "I want to add a new customer", icon: UserPlus },
  { label: "Log Enquiry", prompt: "I want to log a new enquiry", icon: FileText },
  { label: "Create Job Card", prompt: "I want to create a new job card", icon: ClipboardList },
];

function ToolEventCard({ ev }: { ev: ToolEvent }) {
  const labels: Record<string, string> = {
    create_customer: "Customer",
    create_enquiry: "Enquiry",
    create_job_card: "Job Card",
  };
  const label = labels[ev.name] || ev.name;
  if (ev.result.ok) {
    const d = ev.result.data || {};
    const ref = d.job_number || d.enquiry_id || d.name || d.id?.slice(0, 8);
    return (
      <div className="mt-2 flex items-start gap-2 rounded-md border border-green-500/30 bg-green-500/10 px-2.5 py-2 text-xs">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600 mt-0.5" />
        <div>
          <div className="font-semibold text-green-700 dark:text-green-400">{label} created</div>
          {ref && <div className="text-muted-foreground mt-0.5">Reference: <span className="font-mono">{ref}</span></div>}
        </div>
      </div>
    );
  }
  return (
    <div className="mt-2 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-2.5 py-2 text-xs">
      <AlertCircle className="h-4 w-4 shrink-0 text-destructive mt-0.5" />
      <div>
        <div className="font-semibold text-destructive">Couldn't save {label}</div>
        <div className="text-muted-foreground mt-0.5">{ev.result.error}</div>
      </div>
    </div>
  );
}

export function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("ask");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  // Reset conversation when switching modes
  const switchMode = (m: Mode) => {
    if (m === mode) return;
    setMode(m);
    setMessages([]);
  };

  const sendCreate = async (allMessages: Msg[]) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({
        mode: "create",
        messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: "Failed" }));
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${err.error || "Something went wrong."}` }]);
      return;
    }
    const json = await resp.json();
    const evs: ToolEvent[] = json.toolEvents || [];
    setMessages((prev) => [...prev, { role: "assistant", content: json.content || "", toolEvents: evs }]);

    // Refresh affected lists so the rest of the app reflects new records
    if (evs.some((e) => e.result.ok)) {
      const map: Record<string, string> = {
        create_customer: "customers",
        create_enquiry: "enquiries",
        create_job_card: "job_cards",
      };
      const keys = new Set(evs.filter((e) => e.result.ok).map((e) => map[e.name]).filter(Boolean));
      keys.forEach((k) => queryClient.invalidateQueries({ queryKey: [k] }));
    }
  };

  const sendAsk = async (allMessages: Msg[]) => {
    let assistantSoFar = "";
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({
        messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!resp.ok || !resp.body) {
      const err = await resp.json().catch(() => ({ error: "Failed" }));
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${err.error || "Something went wrong."}` }]);
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;
        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") { streamDone = true; break; }
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantSoFar += content;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant") {
                return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
              }
              return [...prev, { role: "assistant", content: assistantSoFar }];
            });
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }
  };

  const send = async (override?: string) => {
    const text = (override ?? input).trim();
    if (!text || isLoading) return;
    if (!override) setInput("");

    const userMsg: Msg = { role: "user", content: text };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setIsLoading(true);

    try {
      if (mode === "create") await sendCreate(allMessages);
      else await sendAsk(allMessages);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
          aria-label="Open ERP Assistant"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[34rem] bg-card border rounded-xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="font-semibold text-sm">ERP Assistant</span>
            </div>
            <button onClick={() => setOpen(false)} className="hover:opacity-80" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Mode tabs */}
          <div className="grid grid-cols-2 border-b bg-muted/30">
            <button
              onClick={() => switchMode("ask")}
              className={`flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition ${
                mode === "ask" ? "bg-background text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Ask
            </button>
            <button
              onClick={() => switchMode("create")}
              className={`flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition ${
                mode === "create" ? "bg-background text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              Add Data
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground text-sm mt-4">
                <Bot className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium">{MODE_INTRO[mode].title}</p>
                <p className="mt-1 px-2">{MODE_INTRO[mode].sub}</p>

                {mode === "create" && (
                  <div className="mt-4 space-y-2">
                    {QUICK_ACTIONS.map((a) => {
                      const Icon = a.icon;
                      return (
                        <button
                          key={a.label}
                          onClick={() => send(a.prompt)}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-md border bg-background hover:bg-accent text-left text-xs transition"
                        >
                          <Icon className="h-4 w-4 text-primary" />
                          <span className="font-medium">{a.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && <Bot className="h-5 w-5 mt-1 shrink-0 text-primary" />}
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <>
                      {msg.content && (
                        <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      )}
                      {msg.toolEvents?.map((ev, idx) => <ToolEventCard key={idx} ev={ev} />)}
                    </>
                  ) : (
                    msg.content
                  )}
                </div>
                {msg.role === "user" && <User className="h-5 w-5 mt-1 shrink-0 text-muted-foreground" />}
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex gap-2">
                <Bot className="h-5 w-5 mt-1 text-primary" />
                <div className="bg-muted rounded-lg px-3 py-2 text-sm text-muted-foreground">
                  {mode === "create" ? "Working on it..." : "Thinking..."}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={mode === "create" ? "Describe what to add..." : "Ask about your ERP data..."}
              disabled={isLoading}
              className="text-sm"
            />
            <Button size="icon" onClick={() => send()} disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
