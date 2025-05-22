export function redirectToCheckoutSettings() {
  if (typeof window !== "undefined") {
    window.open("shopify://admin/settings/checkout", "_top");
  }
}
