# Furneview website

Furneview's online store front: a fast static website hosted on GitHub Pages, with products, cart and checkout powered by Shopify.

- **Products and prices** come live from Shopify. Add or edit them in Shopify admin and the site updates automatically.
- **Cart** is a real Shopify cart. **Checkout** opens Shopify's secure checkout, so orders, payments and emails all land in your Shopify admin.
- Until a Storefront token is added, the site shows sample products and checkout is disabled.

## Pages

| File | What it shows |
|---|---|
| `index.html` | Homepage: sale banner, categories, bestsellers, rooms, offers, stores, visit booking |
| `shop.html?c=sofas` | All products in a Shopify collection (`c` = collection handle). `shop.html?q=bed` searches |
| `product.html?h=handle` | One product with photos, options, quantity, add to cart |

## Connect Shopify (one time)

1. In Shopify admin, open **Settings → Apps and sales channels → Shopify App Store** and install **Headless** (free, made by Shopify).
2. Open Headless → **Create storefront**. Copy the **Public access token**.
3. In this repo, open `assets/config.js`, paste the token into `storefrontToken`, and commit.
4. For each product, make sure the **Headless** sales channel is ticked (Products → select all → **Include in sales channels**), or the product won't appear.
5. Create collections whose handles match `categories` in `config.js` (sofas, beds, mattresses, dining…), or edit the handles in `config.js` to match yours.

## Edit content

Everything you'll want to change often is in `assets/config.js`: phone, email, WhatsApp number, sale end date, categories, rooms, stores and offer codes. Create the same discount codes in Shopify → Discounts so they work at checkout.

## Custom domain

1. Repo **Settings → Pages → Custom domain**: enter `www.furneview.com` and save.
2. At your domain registrar, add a **CNAME** record: `www` → `charan383.github.io`.
3. Tick **Enforce HTTPS** once it's available.
