import { supabase } from "@/lib/supabase";

type Need = {
  id: number;
  organisation: string;
  item: string;
  quantity: number;
  urgency: string;
  location: string;
};

const urgencyScore: Record<string, number> = {
  Critical: 100,
  High: 70,
  Medium: 40,
  Low: 10,
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { donationId } = body;

    if (!donationId) {
      return Response.json(
        { error: "Donation ID is required" },
        { status: 400 }
      );
    }

    // 1. Get selected donation
    const { data: donation, error: donationError } = await supabase
      .from("donations")
      .select("*")
      .eq("id", donationId)
      .single();

    if (donationError || !donation) {
      return Response.json(
        { error: "Donation not found" },
        { status: 404 }
      );
    }

    // 2. Get all organisation needs
    const { data: needs, error: needsError } = await supabase
      .from("needs")
      .select("*");

    if (needsError) {
      return Response.json(
        { error: "Failed to load needs" },
        { status: 500 }
      );
    }

    // 3. Only keep needs for the same resource
    const matchingNeeds = (needs as Need[]).filter(
      (need) =>
        need.item.trim().toLowerCase() ===
        donation.item.trim().toLowerCase()
    );

    // 4. Give every need a score
    const scoredNeeds = matchingNeeds.map((need) => {
      let score = urgencyScore[need.urgency] ?? 0;

      if (
        need.location.trim().toLowerCase() ===
        donation.location.trim().toLowerCase()
      ) {
        score += 25;
      }

      return {
        ...need,
        score,
      };
    });

    // 5. Highest score first
    scoredNeeds.sort((a, b) => b.score - a.score);

    // 6. Allocate resources
    let remaining = donation.quantity;

    const allocations = [];

    for (const need of scoredNeeds) {
      if (remaining <= 0) {
        break;
      }

      const allocatedQuantity = Math.min(
        remaining,
        need.quantity
      );

      allocations.push({
        needId: need.id,
        organisation: need.organisation,
        item: need.item,
        requestedQuantity: need.quantity,
        allocatedQuantity,
        urgency: need.urgency,
        location: need.location,
        score: need.score,
      });

      remaining -= allocatedQuantity;
    }

    return Response.json({
      donation,
      allocations,
      unallocatedQuantity: remaining,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}