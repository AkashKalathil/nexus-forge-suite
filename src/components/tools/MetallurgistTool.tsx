import { useState, useRef, useEffect } from "react";
import { Send, Bot, FlaskConical, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";

const METALLURGIST_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/metallurgist`;

type Msg = { role: "user" | "assistant"; content: string };

const recommendExamples = [
  "I need a steel for high-temperature applications up to 600°C with good creep resistance and oxidation resistance.",
  "Recommend a stainless steel for marine environment with minimum 500 MPa tensile strength and good weldability.",
  "I need a tool steel for cold stamping dies with hardness above 58 HRC and good wear resistance.",
  "What alloy is best for automotive gears requiring case hardening to 60 HRC surface with a tough core?",
];

const analyzeExamples = [
  "Analyze this composition: C 0.40%, Mn 0.75%, Cr 1.0%, Mo 0.20%, Si 0.25%, P 0.035%, S 0.040%",
  "What grade is this? C 0.08%, Cr 18%, Ni 10%, Mn 2%, Si 1%",
  "Evaluate: C 0.38%, Cr 5.2%, Mo 1.3%, V 1.0%, Si 1.0% — is this suitable for hot forging dies?",
  "Check composition: C 0.95%, Cr 1.5%, Mn 0.35%, Si 0.25%, V 0.10%",
];

export function MetallurgistTool() {
  const [mode, setMode] = useState<"recommend" | "analyze">("recommend");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleModeChange = (value: string) => {
    setMode(value as "recommend" | "analyze");
    setMessages([]);
    setInput("");
  };

  const send = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || isLoading) return;
    setInput("");

    const userMsg: Msg = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    let assistantSoFar = "";
    const allMessages = [...messages, userMsg];

    try {
      const resp = await fetch(METALLURGIST_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages, mode }),
      });

      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({ error: "Failed" }));
        setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${err.error || "Something went wrong."}` }]);
        setIsLoading(false);
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
    } catch (e) {
      console.error(e);
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const examples = mode === "recommend" ? recommendExamples : analyzeExamples;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-primary" />
          AI Metallurgist Assistant
        </CardTitle>
        <CardDescription>
          Get expert recommendations on steel & alloy compositions, or analyze existing compositions against standard grades
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={mode} onValueChange={handleModeChange}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="recommend" className="gap-2">
              <SearchIcon className="h-4 w-4" />
              Recommend Composition
            </TabsTrigger>
            <TabsTrigger value="analyze" className="gap-2">
              <FlaskConical className="h-4 w-4" />
              Analyze Composition
            </TabsTrigger>
          </TabsList>

          <TabsContent value={mode}>
            {/* Chat area */}
            <div
              ref={scrollRef}
              className="h-96 overflow-y-auto border rounded-lg p-4 mb-4 bg-muted/30 space-y-4"
            >
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground text-sm mt-6 space-y-4">
                  <Bot className="h-10 w-10 mx-auto opacity-40" />
                  <p className="font-medium">
                    {mode === "recommend"
                      ? "Describe the properties or application you need, and I'll recommend the best alloy."
                      : "Provide a chemical composition, and I'll identify the grade and predict properties."}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 max-w-2xl mx-auto">
                    {examples.map((ex, i) => (
                      <button
                        key={i}
                        onClick={() => send(ex)}
                        className="text-left text-xs p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && <Bot className="h-5 w-5 mt-1 shrink-0 text-primary" />}
                  <div
                    className={`max-w-[85%] rounded-lg px-4 py-3 text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border text-foreground"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex gap-2">
                  <Bot className="h-5 w-5 mt-1 text-primary" />
                  <div className="bg-card border rounded-lg px-4 py-3 text-sm text-muted-foreground animate-pulse">
                    Analyzing...
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder={
                  mode === "recommend"
                    ? "Describe the desired properties, application, or requirements..."
                    : "Enter the chemical composition (e.g., C 0.40%, Cr 1.0%, Mo 0.20%...)"
                }
                disabled={isLoading}
                rows={2}
                className="resize-none text-sm"
              />
              <Button onClick={() => send()} disabled={isLoading || !input.trim()} size="icon" className="h-auto">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
