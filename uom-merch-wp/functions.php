<?php
/**
 * University of Montana Merch Store — functions.php
 *
 * Bootstraps the headless theme:
 *   1. Verifies WooCommerce is active; shows an admin notice if not.
 *   2. Loads the REST API class and registers all endpoints.
 *   3. Adds permissive CORS headers so the Next.js frontend can call the API.
 *   4. Suppresses the frontend — redirects any non-admin, non-REST page request
 *      to the WP admin login rather than rendering a blank theme.
 */

defined( 'ABSPATH' ) || exit;

// ── 1. WooCommerce dependency check ─────────────────────────────────────────

add_action( 'admin_notices', 'uom_woocommerce_notice' );
function uom_woocommerce_notice(): void {
    if ( class_exists( 'WooCommerce' ) ) {
        return;
    }
    echo '<div class="notice notice-error"><p>'
        . '<strong>University of Montana Merch Store</strong> requires '
        . '<a href="https://wordpress.org/plugins/woocommerce/" target="_blank">WooCommerce</a> '
        . 'to be installed and activated.'
        . '</p></div>';
}

// ── 2. Load REST API ─────────────────────────────────────────────────────────

require_once get_template_directory() . '/inc/class-rest-api.php';

add_action( 'rest_api_init', static function (): void {
    if ( ! class_exists( 'WooCommerce' ) ) {
        return;
    }
    ( new UOM_Merch_REST_API() )->register_routes();
} );

// ── 3. CORS headers ──────────────────────────────────────────────────────────
// Allow the Next.js frontend (and any other authorised origin) to reach the API.
// Tighten ALLOWED_ORIGINS in production to your exact frontend domain.

add_action( 'rest_api_init', static function (): void {
    remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );

    add_filter( 'rest_pre_serve_request', static function ( $value ) {
        $allowed = [
            'http://localhost:3000',
            'https://universityofmontanamerchstore.vercel.app',
        ];

        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

        if ( in_array( $origin, $allowed, true ) ) {
            header( 'Access-Control-Allow-Origin: ' . $origin );
        } else {
            header( 'Access-Control-Allow-Origin: *' );
        }

        header( 'Access-Control-Allow-Methods: GET, POST, OPTIONS' );
        header( 'Access-Control-Allow-Credentials: true' );
        header( 'Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce' );

        if ( 'OPTIONS' === $_SERVER['REQUEST_METHOD'] ) {
            status_header( 200 );
            exit;
        }

        return $value;
    } );
}, 15 );

// ── 4. Suppress the frontend ─────────────────────────────────────────────────
// Redirect non-API, non-admin browser requests to wp-login so the blank theme
// is never served to visitors.

add_action( 'template_redirect', static function (): void {
    if ( is_admin() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) {
        return;
    }
    wp_redirect( wp_login_url(), 302 );
    exit;
} );
