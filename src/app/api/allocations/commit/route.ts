import { supabase } from "@/lib/supabase";

import {
  calculateAllocation,
} from "@/lib/aidmatch-tools";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const donationId =
      Number(body.donationId);

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

    // IMPORTANT:
    // Recalculate on the backend.
    //
    // Never trust quantities sent by the frontend.
    const result =
      await calculateAllocation(donationId);

    if (
      result.allocations.length === 0
    ) {
      return Response.json(
        {
          error:
            "There is currently nothing to allocate.",
        },
        {
          status: 400,
        }
      );
    }

    const rows =
      result.allocations.map(
        (allocation) => ({
          donation_id:
            donationId,

          need_id:
            allocation.needId,

          allocated_quantity:
            allocation.allocatedQuantity,

          status:
            "approved",
        })
      );

    const { data, error } =
      await supabase
        .from("allocations")
        .insert(rows)
        .select();

    if (error) {
      console.error(error);

      return Response.json(
        {
          error:
            "Failed to commit allocation",
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        message:
          "Allocation approved and saved",

        allocations:
          data,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Allocation failed",
      },
      {
        status: 500,
      }
    );
  }
}