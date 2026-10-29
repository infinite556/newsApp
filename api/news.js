export default async function handler(request, response) {
  const apiKey = process.env.NEWSDATA_API_KEY;

  if (!apiKey) {
    response.status(500).json({ message: "NEWSDATA_API_KEY is not configured." });
    return;
  }

  const params = new URLSearchParams(request.query);
  params.delete("apikey");
  params.set("apikey", apiKey);

  try {
    const newsResponse = await fetch(
      `https://newsdata.io/api/1/latest?${params.toString()}`,
    );
    const body = await newsResponse.text();

    response.status(newsResponse.status);
    response.setHeader(
      "Content-Type",
      newsResponse.headers.get("content-type") || "application/json",
    );
    response.send(body);
  } catch (error) {
    response.status(502).json({
      message: error instanceof Error ? error.message : "Unable to reach NewsData.",
    });
  }
}
