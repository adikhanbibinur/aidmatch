import { supabase } from "@/lib/supabase";

type Need = {
  id: number;
  organisation: string;
  item: string;
  quantity: number;
  urgency: string;
  location: string;
};

type AllocationRow = {
  donation_id: number;
  need_id: number;
  allocated_quantity: number;
  status: string;
};

const urgencyScore: Record<string, number> = {
  Critical: 100,
  High: 70,
  Medium: 40,
  Low: 10,
};

export async function getDonation(donationId: number) {
  const { data: donation, error: donationError } =
    await supabase
      .from("donations")
      .select("*")
      .eq("id", donationId)
      .single();

  if (donationError || !donation) {
    throw new Error("Donation not found");
  }

  const { data: allocations, error: allocationError } =
    await supabase
      .from("allocations")
      .select("allocated_quantity")
      .eq("donation_id", donationId)
      .eq("status", "approved");

  if (allocationError) {
    throw new Error(
      "Failed to load existing allocations"
    );
  }

  const alreadyAllocated =
    allocations?.reduce(
      (total, allocation) =>
        total + allocation.allocated_quantity,
      0
    ) ?? 0;

  return {
    ...donation,
    alreadyAllocated,
    availableQuantity:
      donation.quantity - alreadyAllocated,
  };
}

export async function getMatchingNeeds(item: string) {
  const { data: needs, error: needsError } =
    await supabase
      .from("needs")
      .select("*");

  if (needsError) {
    throw new Error(
      "Failed to load organisation needs"
    );
  }

  const { data: allocations, error: allocationError } =
    await supabase
      .from("allocations")
      .select(
        "need_id, allocated_quantity, status"
      )
      .eq("status", "approved");

  if (allocationError) {
    throw new Error(
      "Failed to load existing allocations"
    );
  }

  const allocatedByNeed = new Map<number, number>();

  for (const allocation of
    (allocations ?? []) as AllocationRow[]) {
    const current =
      allocatedByNeed.get(allocation.need_id) ?? 0;

    allocatedByNeed.set(
      allocation.need_id,
      current + allocation.allocated_quantity
    );
  }

  const normalizedItem =
    item.trim().toLowerCase();

  return (needs as Need[])
    .filter(
      (need) =>
        need.item.trim().toLowerCase() ===
        normalizedItem
    )
    .map((need) => {
      const alreadyReceived =
        allocatedByNeed.get(need.id) ?? 0;

      return {
        ...need,

        alreadyReceived,

        remainingQuantity: Math.max(
          0,
          need.quantity - alreadyReceived
        ),
      };
    })
    .filter(
      (need) => need.remainingQuantity > 0
    );
}

export async function calculateAllocation(
  donationId: number
) {
  const donation =
    await getDonation(donationId);

  const matchingNeeds =
    await getMatchingNeeds(donation.item);

  const scoredNeeds = matchingNeeds.map(
    (need) => {
      let score =
        urgencyScore[need.urgency] ?? 0;

      const sameLocation =
        need.location
          .trim()
          .toLowerCase() ===
        donation.location
          .trim()
          .toLowerCase();

      if (sameLocation) {
        score += 25;
      }

      return {
        ...need,
        score,
      };
    }
  );

  scoredNeeds.sort(
    (a, b) => b.score - a.score
  );

  let remaining =
    donation.availableQuantity;

  const allocations = [];

  for (const need of scoredNeeds) {
    if (remaining <= 0) {
      break;
    }

    const allocatedQuantity = Math.min(
      remaining,
      need.remainingQuantity
    );

    allocations.push({
      needId: need.id,

      organisation:
        need.organisation,

      item:
        need.item,

      requestedQuantity:
        need.remainingQuantity,

      allocatedQuantity,

      urgency:
        need.urgency,

      location:
        need.location,

      score:
        need.score,
    });

    remaining -= allocatedQuantity;
  }

  return {
    donation,
    allocations,
    unallocatedQuantity: remaining,
  };
}