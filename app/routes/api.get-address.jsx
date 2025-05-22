
import { json } from '@remix-run/node';


export const loader = async ({ request }) => {

   const url = new URL(request.url);
  const input = url.searchParams.get("input") || "";
  const country = url.searchParams.get("country") || "";
  const googleApiKey = process.env.GOOGLE_API_KEY;
  if (!googleApiKey) {
    return json({ error: "Missing Google API key" }, {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*", // ✅ All origins allowed
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      }
    });
  }
  const queryParams = new URLSearchParams({
    input,
    types: 'address',
    components: `country:${country}`,
    key: googleApiKey,
  });

  const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?${queryParams.toString()}`;

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();

    return json(
      { result: data },
      {
        headers: {
          "Access-Control-Allow-Origin": "*", // ✅ Allow all origins
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    return json({ error: "Google API failed" }, {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      }
    });
  }
};
