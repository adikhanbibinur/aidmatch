"use client";

import { useState } from "react";

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");

  async function handleSaveDonation() {
    const response = await fetch("/api/donations", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        item: item,
        quantity: Number(quantity),
        location: location,
      }),
    });

    const data = await response.json();

    console.log("Response from backend:", data);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-600">
            AI Resource Allocation Agent
          </p>

          <h1 className="text-5xl font-bold tracking-tight">AidMatch</h1>

          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Match donated resources with organisations that need them most.
            AidMatch uses AI to prioritize urgency, quantity, and need.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Available Donations</p>
            <p className="mt-2 text-4xl font-bold">12</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Active Needs</p>
            <p className="mt-2 text-4xl font-bold">8</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Resources Matched</p>
            <p className="mt-2 text-4xl font-bold">47</p>
          </div>
        </div>

        <div className="mt-10 flex gap-4">
          <button
            onClick={() => setShowForm(true)}
            className="rounded-xl bg-slate-900 px-6 py-3 font-medium text-white"
          >
            Add Donation
          </button>

          <button className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-medium">
            View Needs
          </button>
        </div>

        {showForm && (
          <div className="mt-10 max-w-xl rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold">Add Donation</h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Resource
                </label>

                <input
                  value={item}
                  onChange={(event) => setItem(event.target.value)}
                  placeholder="e.g. Blankets"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Quantity
                </label>

                <input
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  placeholder="e.g. 40"
                  type="number"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Location
                </label>

                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="e.g. Kowloon"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSaveDonation}
                  className="rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white"
                >
                  Save Donation
                </button>

                <button
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-slate-300 px-5 py-3"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}