export type ToolCall = {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
};

export type OpenRouterMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string | null;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
};

export async function chatWithOpenRouter(
  messages: OpenRouterMessage[],
  tools?: unknown[]
) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("Missing OPENROUTER_API_KEY");
  }

  const model =
    process.env.OPENROUTER_MODEL ?? "openrouter/free";

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "X-Title": "AidMatch",
      },

      body: JSON.stringify({
        model,
        messages,
        tools,
        tool_choice: tools ? "auto" : undefined,

        // Easier for us to understand while learning:
        // one requested tool at a time.
        parallel_tool_calls: false,

        temperature: 0.1,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `OpenRouter error ${response.status}: ${errorText}`
    );
  }

  const data = await response.json();

  const message = data.choices?.[0]?.message;

  if (!message) {
    throw new Error("OpenRouter returned no message");
  }

  return message as OpenRouterMessage;
}

export async function askOpenRouter(prompt: string) {
  const message = await chatWithOpenRouter([
    {
      role: "system",
      content:
        "You are AidMatch, an AI assistant for responsible humanitarian resource allocation.",
    },
    {
      role: "user",
      content: prompt,
    },
  ]);

  return message.content ?? "No response generated.";
}