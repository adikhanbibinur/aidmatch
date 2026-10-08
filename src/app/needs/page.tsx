"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Need = {
  id: number;
  organisation: string;
  item: string;
  quantity: number;
  urgency: string;
  location: string;
};

export default function NeedsPage() {
  const [organisation, setOrganisation] = useState("");
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [urgency, setUrgency] = useState("Medium");
  const [location, setLocation] = useState("");

  const [needs, setNeeds] = useState<Need[]>([]);

  async function loadNeeds() {
    const response = await fetch("/api/needs");
    const data = await response.json();

    if (data.needs) {
      setNeeds(data.needs);
    }
  }

  useEffect(() => {
    loadNeeds();
  }, []);

  async function handleSaveNeed() {
    const response = await fetch("/api/needs", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        organisation,
        item,
        quantity: Number(quantity),
        urgency,
        location,
      }),
    });

    if (response.ok) {
      setOrganisation("");
      setItem("");
      setQuantity("");
      setUrgency("Medium");
      setLocation("");

      await loadNeeds();
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-12">

        <Link
          href="/"
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
            AidMatch
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Organisation Needs
          </h1>

          <p className="mt-3 text-slate-600">
            Add resources that community organisations currently need.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">

          {/* FORM */}
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold">
              Add a Need
            </h2>

            <div className="mt-6 space-y-5">

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Organisation
                </label>

                <input
                  value={organisation}
                  onChange={(event) =>
                    setOrganisation(event.target.value)
                  }
                  placeholder="e.g. Hope Shelter"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Resource Needed
                </label>

                <input
                  value={item}
                  onChange={(event) =>
                    setItem(event.target.value)
                  }
                  placeholder="e.g. Blankets"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Quantity
                </label>

                <input
                  type="number"
                  value={quantity}
                  onChange={(event) =>
                    setQuantity(event.target.value)
                  }
                  placeholder="e.g. 20"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Urgency
                </label>

                <select
                  value={urgency}
                  onChange={(event) =>
                    setUrgency(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Location
                </label>

                <input
                  value={location}
                  onChange={(event) =>
                    setLocation(event.target.value)
                  }
                  placeholder="e.g. Kowloon"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              <button
                onClick={handleSaveNeed}
                className="w-full rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white"
              >
                Save Need
              </button>

            </div>
          </div>

          {/* NEEDS LIST */}
          <div>
            <h2 className="text-2xl font-bold">
              Active Needs
            </h2>

            <div className="mt-6 space-y-4">
              {needs.length === 0 ? (
                <div className="rounded-2xl bg-white p-6 text-slate-500 shadow-sm">
                  No organisation needs yet.
                </div>
              ) : (
                needs.map((need) => (
                  <div
                    key={need.id}
                    className="rounded-2xl bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-slate-500">
                          {need.organisation}
                        </p>

                        <h3 className="mt-1 text-xl font-bold">
                          {need.quantity} × {need.item}
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                          {need.location}
                        </p>
                      </div>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium">
                        {need.urgency}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}