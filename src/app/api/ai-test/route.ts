import { askOpenRouter } from "@/lib/openrouter";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const prompt = body.prompt;

    if (!prompt) {
      return Response.json(
        {
          error: "Prompt is required",
        },
        {
          status: 400,
        }
      );
    }

    const answer = await askOpenRouter(prompt);

    return Response.json({
      answer,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "AI request failed",
      },
      {
        status: 500,
      }
    );
  }
}