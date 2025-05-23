export  async function validateGoogleMapsApiKey(apiKey) {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=New+York&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "REQUEST_DENIED") {
      console.error("❌ Invalid API Key:", data.error_message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("⚠️ Error during API key validation:", error);
    return false;
  }
}