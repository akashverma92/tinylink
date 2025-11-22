"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load all short links on page load
  const loadLinks = async () => {
    const res = await fetch("/api/links");
    const data = await res.json();
    setLinks(data);
  };

  useEffect(() => {
    loadLinks();
  }, []);

  // Create a new short link
  const createShortLink = async () => {
    if (!url) return alert("Please enter a URL");

    setLoading(true);

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      // Add the new link at the top
      setLinks([data, ...links]);
      setUrl("");
      setCode("");
    } catch (error) {
      alert("Failed to create link");
    }

    setLoading(false);
  };

  // Delete a short link
  const deleteLink = async (shortCode) => {
    const res = await fetch(`/api/links/${shortCode}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (res.ok) {
      setLinks(links.filter((l) => l.code !== shortCode));
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">TinyLink – Create Short URLs</h1>

      {/* Create Form */}
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow text-black">
        <label className="block mb-2 font-medium">Long URL</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="https://example.com"
        />

        <label className="block mb-2 font-medium">
          Custom Code (Optional)
        </label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="your-code"
        />

        <button
          onClick={createShortLink}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? "Creating..." : "Create Short Link"}
        </button>
      </div>

      {/* Short Links List */}
      <div className="w-full max-w-2xl mt-10">
        <h2 className="text-xl font-semibold mb-4">Your Short Links</h2>

        {links.length === 0 ? (
          <p className="text-gray-400">No links created yet.</p>
        ) : (
          <div className="space-y-4">
            {links.map((link) => (
              <div
                key={link.code}
                className="border p-4 rounded-lg bg-white text-black shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-blue-600">
                    <a
                      href={`/${link.code}`}
                      target="_blank"
                      className="underline"
                    >
                      {typeof window !== "undefined" ? window.location.origin : ""}/{link.code}
                    </a>
                  </p>

                  <p className="text-sm text-gray-600">➡ {link.url}</p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">Clicks:</span>{" "}
                    {link.click_count}
                  </p>
                </div>

                <button
                  onClick={() => deleteLink(link.code)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
