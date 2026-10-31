// Furneview site settings. Edit these values, then commit.
window.FURNEVIEW = {
  // Your store's myshopify address (from the Shopify admin URL: admin.shopify.com/store/109181-tr)
  shopDomain: "109181-tr.myshopify.com",

  // Public Storefront access token from Shopify (Headless sales channel).
  // Leave empty to run the site with sample products (checkout disabled).
  storefrontToken: "",

  // Storefront API version
  apiVersion: "2026-04",

  // WhatsApp number with country code, digits only, e.g. "919876543210". Empty hides the button.
  whatsapp: "",

  phone: "+91 80 0000 0000",
  email: "hello@furneview.in",

  // Sale countdown end date (YYYY-MM-DD). Empty hides the countdown.
  saleEnds: "2026-11-15",

  // Category tiles. "handle" must match the collection handle in Shopify
  // (Products → Collections → open a collection → the end of its URL).
  categories: [
    { title: "Sofas", handle: "sofas", art: "sofa" },
    { title: "Beds", handle: "beds", art: "bed" },
    { title: "Mattresses", handle: "mattresses", art: "mattress" },
    { title: "Dining", handle: "dining", art: "dining" },
    { title: "Wardrobes", handle: "wardrobes", art: "wardrobe" },
    { title: "Recliners", handle: "recliners", art: "recliner" },
    { title: "TV Units", handle: "tv-units", art: "tv" },
    { title: "Coffee Tables", handle: "coffee-tables", art: "coffee" },
    { title: "Study Tables", handle: "study-tables", art: "study" },
    { title: "Office Chairs", handle: "office-chairs", art: "chair" },
    { title: "Decor", handle: "decor", art: "decor" },
    { title: "Lighting", handle: "lighting", art: "lamp" }
  ],

  rooms: [
    { title: "Living room", handle: "living-room", art: "sofa", bg: "#F6E3D3" },
    { title: "Bedroom", handle: "bedroom", art: "bed", bg: "#E3EEE6" },
    { title: "Dining", handle: "dining", art: "dining", bg: "#F3ECDF" },
    { title: "Home office", handle: "home-office", art: "study", bg: "#E8E6E3" }
  ],

  stores: [
    { name: "Indiranagar, Bengaluru", detail: "Open 10 AM – 9 PM" },
    { name: "Whitefield, Bengaluru", detail: "Open 10 AM – 9 PM" },
    { name: "JP Nagar, Bengaluru", detail: "Open 10 AM – 9 PM" }
  ],

  offers: [
    { title: "Extra 10% off", text: "On your first order, up to ₹3,000", code: "FURNEVIEW10" },
    { title: "₹2,500 cashback", text: "With bank card EMI, min. ₹25,000", code: "BANKHOME" },
    { title: "Buy 2, save 15%", text: "Mix any bedroom furniture and mattress", code: "BEDROOM15" }
  ]
};
