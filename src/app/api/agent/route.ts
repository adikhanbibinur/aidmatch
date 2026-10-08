import {
  chatWithOpenRouter,
  OpenRouterMessage,
} from "@/lib/openrouter";

import {
  getDonation,
  getMatchingNeeds,
  calculateAllocation,
} from "@/lib/aidmatch-tools";

const tools = [
  {
    type: "function",

    function: {
      name: "get_donation",

      description:
        "Get the details of a donation from the AidMatch database using its donation ID.",

      parameters: {
        type: "object",

        properties: {
          donationId: {
            type: "integer",
            description: "The database ID of the donation.",
          },
        },

        required: ["donationId"],
      },
    },
  },

  {
    type: "function",

    function: {
      name: "get_matching_needs",

      description:
        "Get current organisation needs that match a specific resource item.",

      parameters: {
        type: "object",

        properties: {
          item: {
            type: "string",
            description:
              "The resource item, for example Blankets.",
          },
        },

        required: ["item"],
      },
    },
  },

  {
    type: "function",

    function: {
      name: "calculate_allocation",

      description:
        "Run AidMatch's deterministic allocation algorithm for a donation. The algorithm considers urgency and location and determines exact quantities.",

      parameters: {
        type: "object",

        properties: {
          donationId: {
            type: "integer",
            description:
              "The database ID of the donation.",
          },
        },

        required: ["donationId"],
      },
    },
  },
];

function parseArguments(raw: string) {
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    throw new Error("Agent returned invalid tool arguments");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const donationId = Number(body.donationId);

    if (!donationId) {
      return Response.json(
        {
          error: "Donation ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const messages: OpenRouterMessage[] = [
      {
        role: "system",

        content: `
You are the AidMatch Resource Allocation Agent.

Your goal is to help allocate donated resources responsibly.

You have access to tools.

For an allocation task:
1. Inspect the donation.
2. Inspect current matching organisation needs.
3. Use the deterministic allocation calculator.
4. Explain the final recommendation.

Never invent donation or organisation data.
Never invent quantities.
The calculate_allocation tool is the authority for exact quantities.

Do not claim that an allocation has been saved or completed.
You are currently making a recommendation only.

Your final answer should clearly state:
- which organisations receive resources
- quantities
- why they were prioritised
- any partial fulfilment
- any unallocated quantity
- one sensible next action

Keep the final answer concise.
        `,
      },

      {
        role: "user",
        content: `Find the best allocation for donation ID ${donationId}.`,
      },
    ];

    const toolsUsed: string[] = [];

    for (let round = 0; round < 6; round++) {
      const assistantMessage =
        await chatWithOpenRouter(messages, tools);

      messages.push(assistantMessage);

      const toolCalls =
        assistantMessage.tool_calls ?? [];

      // Agent has finished and returned its answer
      if (toolCalls.length === 0) {
        if (toolsUsed.length === 0) {
          messages.push({
            role: "user",
            content:
              "You must inspect the AidMatch data using the available tools before giving an answer.",
          });

          continue;
        }

        return Response.json({
          answer:
            assistantMessage.content ??
            "Agent completed without a written answer.",

          toolsUsed,
        });
      }

      for (const call of toolCalls) {
        const toolName = call.function.name;

        const args = parseArguments(
          call.function.arguments
        );

        let result: unknown;

        if (toolName === "get_donation") {
          const id = Number(args.donationId);

          if (!id) {
            throw new Error(
              "Invalid donationId for get_donation"
            );
          }

          result = await getDonation(id);
        }

        else if (toolName === "get_matching_needs") {
          const item = String(args.item ?? "");

          if (!item) {
            throw new Error(
              "Missing item for get_matching_needs"
            );
          }

          result = await getMatchingNeeds(item);
        }

        else if (toolName === "calculate_allocation") {
          const id = Number(args.donationId);

          if (!id) {
            throw new Error(
              "Invalid donationId for calculate_allocation"
            );
          }

          result = await calculateAllocation(id);
        }

        else {
          result = {
            error: `Unknown tool: ${toolName}`,
          };
        }

        toolsUsed.push(toolName);

        messages.push({
          role: "tool",

          tool_call_id: call.id,

          content: JSON.stringify(result),
        });
      }
    }

    return Response.json(
      {
        error:
          "Agent reached its maximum number of steps.",
      },
      {
        status: 500,
      }
    );
  } catch (error) {
    console.error("Agent error:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Agent failed",
      },
      {
        status: 500,
      }
    );
  }
}