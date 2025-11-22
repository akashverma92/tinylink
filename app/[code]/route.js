import { pool } from "@/lib/db";

export async function GET(request, { params }) {
  const { code } = await params;

  const result = await pool.query(
    "SELECT url FROM links WHERE code=$1",
    [code]
  );

  if (result.rowCount === 0) {
    return Response.json({ error: "Link not found" }, { status: 404 });
  }

  const url = result.rows[0].url;

  // Increase click count
  await pool.query(
    "UPDATE links SET click_count = click_count + 1, last_clicked = NOW() WHERE code=$1",
    [code]
  );

  return Response.redirect(url, 302);
}
