# University of Montana Merch Store — WordPress Theme

Headless REST API theme. No frontend templates. Requires **WooCommerce**.

## Setup

1. Copy the `uom-merch-wp` folder into `wp-content/themes/`.
2. Activate the theme in **Appearance → Themes**.
3. Ensure WooCommerce is installed and active.
4. All browser requests redirect to the WP login page; only the REST API and WP admin are served.

## REST API

Base URL: `https://your-site.com/wp-json/uom-merch/v1`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products/categories` | All product categories |
| GET | `/products` | Paginated product list |
| GET | `/products/{id}` | Single product detail |

### Query parameters — `GET /products`

| Param | Default | Notes |
|-------|---------|-------|
| `page` | `1` | Page number |
| `per_page` | `12` | Max `100` |
| `category` | `` | Category slug |
| `search` | `` | Keyword search |
| `min_price` | `null` | Minimum price filter |
| `max_price` | `null` | Maximum price filter |
| `orderby` | `date` | `date`, `price`, `title`, `popularity`, `rating` |
| `order` | `desc` | `asc` or `desc` |

### Response headers — `GET /products`

- `X-WP-Total` — total number of products
- `X-WP-TotalPages` — total pages

## CORS

`functions.php` allows `http://localhost:3000` and the Vercel deployment URL by default.  
Update the `$allowed` array for production.

## Custom product meta

The detail endpoint returns `meta.stripe_price_id` from the `_stripe_price_id` post meta field.  
Set this on each product in WooCommerce → Product → Custom Fields.
