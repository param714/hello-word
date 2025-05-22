import { extension } from "@shopify/ui-extensions/checkout";

const BASE_URL="https://mu-bottle-rubber-street.trycloudflare.com";

export default extension(
  "purchase.address-autocomplete.suggest",
  async ({ signal, target }) => {
    const { field, value, selectedCountryCode } = target;
    const response = await fetchSuggestions(
      field,
      value,
      selectedCountryCode,
      signal
    );
    const { result } = await response.json();
    console.log("Received signal:", signal);
    console.log("Received suggestargettions:", target);
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
async function fetchSuggestions(field, value, selectedCountryCode, signal) {
  const response = await fetch(
    `${BASE_URL}/api/get-address/?input=${encodeURIComponent(value)}&country=${selectedCountryCode}`,
    { signal }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch suggestions from Google Places API");
  }

  return response;
}