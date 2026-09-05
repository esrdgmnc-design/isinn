// This route keeps the Anthropic API key on the server, never exposed to the browser.
// Add your key as an environment variable named ANTHROPIC_API_KEY in Vercel's project
// settings (Settings -> Environment Variables) before deploying, or in a local .env.local
// file for development. Get a key at https://console.anthropic.com/settings/keys

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY ortam değişkeni ayarlanmamış. Vercel proje ayarlarından ekleyin." },
      { status: 500 }
    );
  }

  const body = await request.json();

  const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  const data = await anthropicResponse.json();
  return Response.json(data, { status: anthropicResponse.status });
}
