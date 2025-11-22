import { pool } from "@/lib/db";

export async function GET(request, { params }) {
  const { code } = params;

  const result = await pool.query(
    "SELECT * FROM links WHERE code = $1",
    [code]
  );

  if (result.rowCount === 0) {
    return Response.json({ error: "Link not found" }, { status: 404 });
  }

  return Response.json(result.rows[0], { status: 200 });
}

export async function DELETE(request, { params }) {
  const { code } = await params;

  try {
    const existing = await pool.query(
      "SELECT * FROM links WHERE code = $1",
      [code]
    );

    if (existing.rows.length === 0) {
      return Response.json(
        { error: "Short code not found" },
        { status: 404 }
      );
    }

    await pool.query("DELETE FROM links WHERE code = $1", [code]);

    return Response.json(
      { message: "Deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
