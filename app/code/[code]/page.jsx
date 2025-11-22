"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function CodeStatsPage() {
  const router = useRouter();
  const { code } = useParams(); // ✅ FIX: correct way in Next.js 15

  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!code) return;

    let mounted = true;
    setLoading(true);
    setError(null);

    fetch(`/api/links/${encodeURIComponent(code)}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw { status: res.status, message: body?.error || res.statusText };
        }
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        setLink(data);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || "Failed to load link");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [code]);

  const formatTs = (ts) => {
    if (!ts) return "—";
    try {
      return new Date(ts).toLocaleString();
    } catch {
      return ts;
    }
  };

  const handleCopy = async () => {
    const shortUrl = `${window.location.origin}/${link?.code}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Copy failed — please copy manually.");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this short link?")) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/links/${encodeURIComponent(code)}`, {
        method: "DELETE",
      });
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(body.error || "Delete failed");
      }

      router.push("/");
    } catch (err) {
      alert(err.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-pulse h-6 w-48 bg-gray-200 rounded mb-2" />
          <div className="text-gray-500">Loading stats...</div>
        </div>
      </div>
    );
  }

  if (error) {
    const notFound = error.toLowerCase().includes("not found");
    return (
      <div className="min-h-screen p-6 flex items-start justify-center">
        <div className="max-w-3xl w-full bg-white p-6 rounded shadow text-black">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold">
              {notFound ? "Link not found" : "Error"}
            </h1>
            <button
              onClick={() => router.push("/")}
              className="text-sm text-blue-600 underline"
            >
              Back to dashboard
            </button>
          </div>

          <div className="text-gray-600">
            {notFound ? (
              <p>
                The short code <span className="font-medium">{code}</span> does
                not exist.
              </p>
            ) : (
              <p>Unable to load stats — {String(error)}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 flex items-start justify-center">
      <div className="max-w-4xl w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">
              Stats — <span className="text-blue-600">{link.code}</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Details and metrics for this short link
            </p>
          </div>

          <div className="space-x-2">
            <button
              onClick={() => router.push("/")}
              className="px-3 py-1 rounded border text-sm hover:bg-gray-50"
            >
              Back
            </button>

            <button
              onClick={handleCopy}
              className="px-3 py-1 rounded border text-sm bg-white hover:bg-gray-50"
            >
              {copied ? "Copied!" : "Copy Short Link"}
            </button>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-3 py-1 rounded text-sm bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>

        <div className="bg-white text-black rounded shadow overflow-hidden">
          <table className="min-w-full table-auto text-black">
            <thead className="bg-gray-50 text-black">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium">
                  Field
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium">
                  Value
                </th>
              </tr>
            </thead>

            <tbody className="text-black">
              <tr className="border-t">
                <td className="px-4 py-3 text-sm font-medium">Short Code</td>
                <td className="px-4 py-3 text-sm">
                  <a
                    href={`/${link.code}`}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    {window.location.origin}/{link.code}
                  </a>
                </td>
              </tr>

              <tr className="border-t">
                <td className="px-4 py-3 text-sm font-medium">Target URL</td>
                <td className="px-4 py-3 text-sm">
                  <a
                    href={link.url}
                    target="_blank"
                    className="block truncate underline text-blue-600"
                  >
                    {link.url}
                  </a>
                </td>
              </tr>

              <tr className="border-t">
                <td className="px-4 py-3 text-sm font-medium">Total Clicks</td>
                <td className="px-4 py-3 text-sm">{link.click_count ?? 0}</td>
              </tr>

              <tr className="border-t">
                <td className="px-4 py-3 text-sm font-medium">Last Clicked</td>
                <td className="px-4 py-3 text-sm">
                  {formatTs(link.last_clicked)}
                </td>
              </tr>

              <tr className="border-t">
                <td className="px-4 py-3 text-sm font-medium">Created At</td>
                <td className="px-4 py-3 text-sm">
                  {formatTs(link.created_at)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-xs text-gray-500 mt-3">
          <p>
            Tip: long URLs are truncated visually. Hover or click the URL to see
            the full value.
          </p>
        </div>
      </div>
    </div>
  );
}
