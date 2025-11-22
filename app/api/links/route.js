import { pool } from "@/lib/db";

// GET -> List all links
export async function GET() {
  const result = await pool.query("SELECT * FROM links ORDER BY created_at DESC");
  return Response.json(result.rows);
}

// Helper: Validate short code
function validateCode(code) {
  const pattern = /^[A-Za-z0-9]{6,8}$/;
  return pattern.test(code);
}

// POST -> Create new link
export async function POST(req) {
  try {
    const { url, code } = await req.json();

    if (!url) {
      return Response.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return Response.json({ error: "Invalid URL format" }, { status: 400 });
    }

    // Validate code (must be 6–8 alphanumeric)
    if (code && !validateCode(code)) {
      return Response.json(
        { error: "Code must be 6–8 characters, letters + numbers only" },
        { status: 400 }
      );
    }

    // Check duplicate (only if user provided a code)
    if (code) {
      const existing = await pool.query(
        "SELECT * FROM links WHERE code = $1",
        [code]
      );

      if (existing.rows.length > 0) {
        return Response.json(
          { error: "Short code already exists" },
          { status: 409 }
        );
      }
    }

    // Auto-generate code if not provided
    const shortCode = code || Math.random().toString(36).substring(2, 10).slice(0, 8);

    const result = await pool.query(
      "INSERT INTO links (code, url) VALUES ($1, $2) RETURNING *",
      [shortCode, url]
    );

    return Response.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error("POST /api/links ERROR", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
