"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Donation = {
  id: number;
  item: string;
  quantity: number;
  location: string;
};

type Allocation = {
  needId: number;
  organisation: string;
  item: string;
  requestedQuantity: number;
  allocatedQuantity: number;
  urgency: string;
  location: string;
  score: number;
};

type MatchResult = {
  donation: Donation;
  allocations: Allocation[];
  unallocatedQuantity: number;
};

export default function MatchPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [selectedDonationId, setSelectedDonationId] = useState("");
  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);

  const [agentAnswer, setAgentAnswer] = useState("");
  const [agentTools, setAgentTools] = useState<string[]>([]);
  const [agentLoading, setAgentLoading] = useState(false);

  // Step 26 States
  const [commitLoading, setCommitLoading] = useState(false);
  const [commitMessage, setCommitMessage] = useState("");

  async function loadDonations() {
    const response = await fetch("/api/donations");
    const data = await response.json();

    if (data.donations) {
      setDonations(data.donations);

      if (data.donations.length > 0) {
        setSelectedDonationId(String(data.donations[0].id));
      }
    }
  }

  useEffect(() => {
    loadDonations();
  }, []);

  async function handleMatch() {
    if (!selectedDonationId) return;

    setLoading(true);
    setResult(null);

    const response = await fetch("/api/match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        donationId: Number(selectedDonationId),
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setResult(data);
    }

    setLoading(false);
  }

  async function handleRunAgent() {
    if (!selectedDonationId) return;

    setAgentLoading(true);
    setAgentAnswer("");
    setAgentTools([]);

    const response = await fetch("/api/agent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        donationId: Number(selectedDonationId),
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setAgentAnswer(data.answer);
      setAgentTools(data.toolsUsed ?? []);
    } else {
      setAgentAnswer(data.error ?? "Agent failed.");
    }

    setAgentLoading(false);
  }

  // Step 26 Function
  async function handleApproveAllocation() {
    if (!selectedDonationId) return;

    const confirmed = window.confirm(
      "Approve and save this allocation?"
    );

    if (!confirmed) return;

    setCommitLoading(true);
    setCommitMessage("");

    const response = await fetch("/api/allocations/commit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        donationId: Number(selectedDonationId),
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setCommitMessage("Allocation approved and saved successfully.");

      // Re-run matcher so the UI reflects remaining quantities.
      await handleMatch();
    } else {
      setCommitMessage(data.error ?? "Could not save allocation.");
    }

    setCommitLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-5xl px-6 py-12">
        <Link
          href="/"
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
            AidMatch Allocation Engine
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Find the Best Match
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Select a donation and AidMatch will prioritize organisations
            based on urgency and location.
          </p>
        </div>

        <div className="mt-10 rounded-2xl bg-white p-8 shadow-sm">
          <label className="mb-2 block text-sm font-medium">
            Select Donation
          </label>

          <select
            value={selectedDonationId}
            onChange={(event) => setSelectedDonationId(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          >
            {donations.map((donation) => (
              <option key={donation.id} value={donation.id}>
                {donation.quantity} × {donation.item} — {donation.location}
              </option>
            ))}
          </select>

          <button
            onClick={handleMatch}
            disabled={loading || !selectedDonationId}
            className="mt-5 rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white disabled:opacity-50"
          >
            {loading ? "Finding Best Allocation..." : "Find Best Allocation"}
          </button>

          <button
            onClick={handleRunAgent}
            disabled={agentLoading || !selectedDonationId}
            className="ml-3 mt-5 rounded-xl bg-slate-900 px-6 py-3 font-medium text-white disabled:opacity-50"
          >
            {agentLoading ? "Agent is Working..." : "Run AI Agent"}
          </button>
        </div>

        {result && (
          <div className="mt-10">
            <div className="rounded-2xl bg-slate-900 p-6 text-white">
              <p className="text-sm text-slate-300">Donation analysed</p>
              <h2 className="mt-2 text-2xl font-bold">
                {result.donation.quantity} × {result.donation.item}
              </h2>
              <p className="mt-1 text-slate-300">{result.donation.location}</p>
            </div>

            <h2 className="mt-8 text-2xl font-bold">Recommended Allocation</h2>

            <div className="mt-5 space-y-4">
              {result.allocations.length === 0 ? (
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  No matching organisations found.
                </div>
              ) : (
                result.allocations.map((allocation, index) => (
                  <div
                    key={allocation.needId}
                    className="rounded-2xl bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-emerald-600">
                          Priority #{index + 1}
                        </p>
                        <h3 className="mt-1 text-xl font-bold">
                          {allocation.organisation}
                        </h3>
                        <p className="mt-2 text-slate-600">
                          Allocate <strong>{allocation.allocatedQuantity}</strong>{" "}
                          of {allocation.requestedQuantity} requested
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                          {allocation.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium">
                          {allocation.urgency}
                        </span>
                        <p className="mt-3 text-xs text-slate-400">
                          Match score: {allocation.score}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-sm text-slate-500">
                Remaining unallocated resources
              </p>
              <p className="mt-1 text-3xl font-bold">
                {result.unallocatedQuantity}
              </p>
            </div>

            {/* Step 27 UI: Human Approval */}
            {result.allocations.length > 0 && (
              <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Human Approval Required
                </p>
                <p className="mt-3 text-slate-600">
                  AidMatch has generated a recommendation. Review the
                  quantities above before committing the allocation.
                </p>

                <button
                  onClick={handleApproveAllocation}
                  disabled={commitLoading}
                  className="mt-5 rounded-xl bg-slate-900 px-6 py-3 font-medium text-white disabled:opacity-50"
                >
                  {commitLoading ? "Saving Allocation..." : "Approve Allocation"}
                </button>

                {commitMessage && (
                  <p className="mt-4 text-sm font-medium text-emerald-700">
                    {commitMessage}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {(agentLoading || agentAnswer) && (
          <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
              AidMatch Agent
            </p>

            {agentLoading ? (
              <p className="mt-4 text-slate-600">
                The agent is inspecting resources and organisation needs...
              </p>
            ) : (
              <>
                <p className="mt-4 whitespace-pre-line leading-7 text-slate-700">
                  {agentAnswer}
                </p>

                {agentTools.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-slate-500">
                      Tools used
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {agentTools.map((tool, index) => (
                        <span
                          key={`${tool}-${index}`}
                          className="rounded-full bg-slate-100 px-3 py-1 text-sm"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </section>
    </main>
  );
}