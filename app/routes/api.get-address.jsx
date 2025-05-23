import { json } from '@remix-run/node';
import { verifyShopifyToken } from '../utils/auth';
import {getUserApiKeyByShop } from "../models/UserModel";
export const loader = async ({ request }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }
  const url = new URL(request.url);
  const input = url.searchParams.get("input") || "";
  const country = url.searchParams.get("country") || "";
  //const googleApiKey = process.env.GOOGLE_API_KEY;
   const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  let decoded;
  try {
    decoded = verifyShopifyToken(token);
   
  } catch (err) {
    return json({ error: err.message }, { status: 401 });
  }


 const googleApiKey= await  getUserApiKeyByShop(decoded.dest);
 //console.log('decoded',api_key)

  if (!googleApiKey) {
    return json({ error: "Missing Google API key" }, {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
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

    return json({ result: data }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    return json({ error: "Google API failed" }, {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      }
    });
  }
};
