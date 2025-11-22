# TinyLink – URL Shortener

A modern, full-featured URL shortener application built with Next.js. Create short, memorable links and track their usage with click analytics.

## Features

- ✨ **Create Short URLs** – Convert long URLs into short, shareable links
- 🎯 **Custom Codes** – Optionally specify your own short code (6-8 alphanumeric characters)
- 📊 **Click Tracking** – Monitor how many times each link has been clicked
- 🗑️ **Link Management** – View and delete your short links
- 🔄 **Auto-redirect** – Seamless redirection to original URLs
- 💚 **Health Check** – Built-in health monitoring endpoint

## Tech Stack

- **Framework**: Next.js 16.0.3 (App Router)
- **Frontend**: React 19.2.0
- **Database**: PostgreSQL (via `pg` library)
- **Styling**: Tailwind CSS 4
- **Testing**: Jest
- **Language**: TypeScript/JavaScript

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm, yarn, pnpm, or bun

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tinylink-next
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/tinylink
   ```

4. **Set up the database**
   
   Create a PostgreSQL database and run the following SQL to create the `links` table:
   ```sql
   CREATE TABLE links (
     code VARCHAR(8) PRIMARY KEY,
     url TEXT NOT NULL,
     click_count INTEGER DEFAULT 0,
     last_clicked TIMESTAMP,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Usage

### Creating a Short Link

1. Enter a long URL in the "Long URL" field
2. (Optional) Enter a custom code (6-8 alphanumeric characters)
3. Click "Create Short Link"
4. Your short link will appear in the list below

### Accessing a Short Link

Simply visit `http://localhost:3000/[code]` and you'll be redirected to the original URL. The click count will be automatically incremented.

### Managing Links

- View all your short links on the home page
- See click statistics for each link
- Delete links using the "Delete" button

## API Endpoints

### `GET /api/links`
Returns a list of all short links, ordered by creation date (newest first).

**Response:**
```json
[
  {
    "code": "abc123",
    "url": "https://example.com",
    "click_count": 5,
    "last_clicked": "2024-01-15T10:30:00Z",
    "created_at": "2024-01-10T08:00:00Z"
  }
]
```

### `POST /api/links`
Creates a new short link.

**Request Body:**
```json
{
  "url": "https://example.com",
  "code": "custom" // optional
}
```

**Response:**
```json
{
  "code": "custom",
  "url": "https://example.com",
  "click_count": 0,
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**
- `400` – Invalid URL format or invalid code format
- `409` – Short code already exists
- `500` – Server error

### `GET /api/links/[code]`
Returns information about a specific short link.

**Response:**
```json
{
  "code": "abc123",
  "url": "https://example.com",
  "click_count": 5,
  "last_clicked": "2024-01-15T10:30:00Z",
  "created_at": "2024-01-10T08:00:00Z"
}
```

### `DELETE /api/links/[code]`
Deletes a short link.

**Response:**
```json
{
  "message": "Deleted successfully"
}
```

### `GET /[code]`
Redirects to the original URL and increments the click count.

**Response:** HTTP 302 redirect

### `GET /healthz`
Health check endpoint for monitoring.

**Response:**
```json
{
  "ok": true,
  "version": "1.0",
  "uptime": 1234.56
}
```

## Code Validation Rules

- Custom codes must be 6-8 characters long
- Only alphanumeric characters (A-Z, a-z, 0-9) are allowed
- If no custom code is provided, a random 8-character code is generated

## Scripts

- `npm run dev` – Start the development server
- `npm run build` – Build the application for production
- `npm run start` – Start the production server
- `npm run lint` – Run ESLint
- `npm run test` – Run tests with Jest

## Testing

Run the test suite:
```bash
npm test
```

The project includes tests for the API endpoints using Jest and Supertest.

## Project Structure

```
tinylink-next/
├── app/
│   ├── [code]/          # Dynamic route for short link redirects
│   ├── api/
│   │   └── links/       # API endpoints for link management
│   ├── healthz/         # Health check endpoint
│   ├── page.jsx         # Home page with UI
│   └── layout.tsx       # Root layout
├── lib/
│   └── db.js           # PostgreSQL connection pool
├── tests/
│   └── api/            # API tests
└── public/             # Static assets
```

## Database Schema

The `links` table has the following structure:

| Column       | Type      | Description                          |
|--------------|-----------|--------------------------------------|
| `code`       | VARCHAR(8)| Primary key, the short code          |
| `url`        | TEXT      | The original long URL                |
| `click_count`| INTEGER   | Number of times the link was clicked |
| `last_clicked`| TIMESTAMP | Timestamp of the last click          |
| `created_at` | TIMESTAMP | When the link was created            |

## Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Environment Variables

Make sure to set the `DATABASE_URL` environment variable in your production environment.

### Recommended Platforms

- **Vercel** – Optimized for Next.js applications
- **Railway** – Easy PostgreSQL + Node.js deployment
- **Render** – Simple deployment with PostgreSQL support
- **AWS/GCP/Azure** – For enterprise deployments

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary.

## Support

For issues and questions, please open an issue in the repository.
