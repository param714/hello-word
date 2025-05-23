import { extension } from "@shopify/ui-extensions/checkout";
const BASE_URL = "https://hello-word-a7us.onrender.com";
export default extension(
  "purchase.address-autocomplete.suggest",
  async ({ signal, target, sessionToken }) => {
    const { field, value, selectedCountryCode } = target;
    const token = await sessionToken.get();
    const response = await fetchSuggestions(
      field,
      value,
      selectedCountryCode,
      signal,
      token
    );
    const { result } = await response.json();
    const suggestions = result.predictions.map((prediction) => {
      return {
        id: prediction.place_id,
        label: prediction.description,
        matchedSubstrings: prediction.matched_substrings,
        formattedAddress: {
          address1: prediction.structured_formatting.main_text,
          address2: '',
          city: extractFromTerms(prediction.terms, 1),
          province: extractFromTerms(prediction.terms, 2),
          country: extractFromTerms(prediction.terms, 3),
          zip: '',
        },
      };
    });
    return { suggestions };
  }
);
function extractFromTerms(terms, index) {
  return terms && terms.length > index ? terms[index].value : '';
}
async function fetchSuggestions(field, value, selectedCountryCode, signal, token) {
  const response = await fetch(
    `${BASE_URL}/api/get-address/?input=${encodeURIComponent(value)}&country=${selectedCountryCode}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      signal, 
    }
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch suggestions: ${errorText}`);
  }

  return response
}
