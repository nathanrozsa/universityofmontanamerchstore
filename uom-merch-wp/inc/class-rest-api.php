<?php
/**
 * UOM_Merch_REST_API
 *
 * Registers custom WooCommerce-backed REST endpoints under the namespace
 * `uom-merch/v1`:
 *
 *   GET /products/categories          – all product categories
 *   GET /products                     – paginated product list (category filter)
 *   GET /products/(?P<id>\d+)         – single product with images & variations
 */

defined( 'ABSPATH' ) || exit;

class UOM_Merch_REST_API {

    private const NAMESPACE = 'uom-merch/v1';

    // ── Route registration ───────────────────────────────────────────────────

    public function register_routes(): void {
        register_rest_route( self::NAMESPACE, '/products/categories', [
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => [ $this, 'get_categories' ],
            'permission_callback' => '__return_true',
        ] );

        register_rest_route( self::NAMESPACE, '/products', [
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => [ $this, 'get_products' ],
            'permission_callback' => '__return_true',
            'args'                => $this->collection_args(),
        ] );

        register_rest_route( self::NAMESPACE, '/products/(?P<id>\d+)', [
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => [ $this, 'get_product' ],
            'permission_callback' => '__return_true',
            'args'                => [
                'id' => [
                    'required'          => true,
                    'validate_callback' => static fn( $v ) => is_numeric( $v ) && (int) $v > 0,
                    'sanitize_callback' => 'absint',
                ],
            ],
        ] );
    }

    // ── GET /products/categories ─────────────────────────────────────────────

    public function get_categories( WP_REST_Request $request ): WP_REST_Response {
        $terms = get_terms( [
            'taxonomy'   => 'product_cat',
            'hide_empty' => false,
        ] );

        if ( is_wp_error( $terms ) ) {
            return new WP_REST_Response( [ 'error' => $terms->get_error_message() ], 500 );
        }

        $data = array_map( [ $this, 'format_category' ], $terms );

        return new WP_REST_Response( $data, 200 );
    }

    // ── GET /products ────────────────────────────────────────────────────────

    public function get_products( WP_REST_Request $request ): WP_REST_Response {
        $per_page   = (int) $request->get_param( 'per_page' );
        $page       = (int) $request->get_param( 'page' );
        $category   = $request->get_param( 'category' );
        $search     = $request->get_param( 'search' );
        $min_price  = $request->get_param( 'min_price' );
        $max_price  = $request->get_param( 'max_price' );
        $orderby    = $request->get_param( 'orderby' );
        $order      = $request->get_param( 'order' );

        $args = [
            'status'   => 'publish',
            'limit'    => $per_page,
            'page'     => $page,
            'paginate' => true,
            'orderby'  => $orderby,
            'order'    => strtoupper( $order ),
        ];

        if ( ! empty( $category ) ) {
            $args['category'] = [ sanitize_text_field( $category ) ];
        }

        if ( ! empty( $search ) ) {
            $args['s'] = sanitize_text_field( $search );
        }

        if ( $min_price !== null ) {
            $args['min_price'] = (float) $min_price;
        }

        if ( $max_price !== null ) {
            $args['max_price'] = (float) $max_price;
        }

        $result   = wc_get_products( $args );
        $products = array_map( [ $this, 'format_product_summary' ], $result->products );

        $response = new WP_REST_Response( $products, 200 );
        $response->header( 'X-WP-Total',      (int) $result->total );
        $response->header( 'X-WP-TotalPages', (int) $result->max_num_pages );

        return $response;
    }

    // ── GET /products/{id} ───────────────────────────────────────────────────

    public function get_product( WP_REST_Request $request ): WP_REST_Response {
        $id      = $request->get_param( 'id' );
        $product = wc_get_product( $id );

        if ( ! $product || $product->get_status() !== 'publish' ) {
            return new WP_REST_Response( [ 'error' => 'Product not found.' ], 404 );
        }

        return new WP_REST_Response( $this->format_product_detail( $product ), 200 );
    }

    // ── Formatters ───────────────────────────────────────────────────────────

    private function format_category( WP_Term $term ): array {
        $thumbnail_id  = get_term_meta( $term->term_id, 'thumbnail_id', true );
        $thumbnail_url = $thumbnail_id ? wp_get_attachment_url( $thumbnail_id ) : null;

        return [
            'id'          => $term->term_id,
            'name'        => $term->name,
            'slug'        => $term->slug,
            'description' => $term->description,
            'count'       => $term->count,
            'image'       => $thumbnail_url,
        ];
    }

    private function format_product_summary( WC_Product $product ): array {
        return [
            'id'           => $product->get_id(),
            'name'         => $product->get_name(),
            'slug'         => $product->get_slug(),
            'type'         => $product->get_type(),
            'status'       => $product->get_status(),
            'price'        => (float) $product->get_price(),
            'regular_price'=> (float) $product->get_regular_price(),
            'sale_price'   => $product->is_on_sale() ? (float) $product->get_sale_price() : null,
            'on_sale'      => $product->is_on_sale(),
            'in_stock'     => $product->is_in_stock(),
            'categories'   => $this->get_product_categories( $product ),
            'thumbnail'    => $this->get_thumbnail( $product ),
            'permalink'    => get_permalink( $product->get_id() ),
        ];
    }

    private function format_product_detail( WC_Product $product ): array {
        $data = $this->format_product_summary( $product );

        $data['description']       = $product->get_description();
        $data['short_description'] = $product->get_short_description();
        $data['sku']               = $product->get_sku();
        $data['weight']            = $product->get_weight();
        $data['dimensions']        = [
            'length' => $product->get_length(),
            'width'  => $product->get_width(),
            'height' => $product->get_height(),
        ];
        $data['images']            = $this->get_all_images( $product );
        $data['attributes']        = $this->get_attributes( $product );
        $data['variations']        = $this->get_variations( $product );
        $data['meta']              = [
            'stripe_price_id' => $product->get_meta( '_stripe_price_id' ),
        ];

        return $data;
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private function get_thumbnail( WC_Product $product ): ?array {
        $id = $product->get_image_id();
        if ( ! $id ) {
            return null;
        }
        return [
            'id'  => (int) $id,
            'src' => wp_get_attachment_url( $id ),
            'alt' => get_post_meta( $id, '_wp_attachment_image_alt', true ),
        ];
    }

    private function get_all_images( WC_Product $product ): array {
        $ids    = array_filter( array_merge( [ $product->get_image_id() ], $product->get_gallery_image_ids() ) );
        $images = [];

        foreach ( $ids as $id ) {
            $images[] = [
                'id'  => (int) $id,
                'src' => wp_get_attachment_url( $id ),
                'alt' => get_post_meta( $id, '_wp_attachment_image_alt', true ),
            ];
        }

        return $images;
    }

    private function get_product_categories( WC_Product $product ): array {
        $terms = get_the_terms( $product->get_id(), 'product_cat' );
        if ( ! $terms || is_wp_error( $terms ) ) {
            return [];
        }

        return array_map( static fn( WP_Term $t ) => [
            'id'   => $t->term_id,
            'name' => $t->name,
            'slug' => $t->slug,
        ], $terms );
    }

    private function get_attributes( WC_Product $product ): array {
        $result = [];

        foreach ( $product->get_attributes() as $attribute ) {
            $result[] = [
                'name'    => wc_attribute_label( $attribute->get_name() ),
                'options' => $attribute->get_terms()
                    ? wp_list_pluck( $attribute->get_terms(), 'name' )
                    : $attribute->get_options(),
            ];
        }

        return $result;
    }

    private function get_variations( WC_Product $product ): array {
        if ( ! $product->is_type( 'variable' ) ) {
            return [];
        }

        $variations = [];

        foreach ( $product->get_available_variations() as $variation_data ) {
            $variation = wc_get_product( $variation_data['variation_id'] );
            if ( ! $variation ) {
                continue;
            }

            $variations[] = [
                'id'            => $variation->get_id(),
                'price'         => (float) $variation->get_price(),
                'regular_price' => (float) $variation->get_regular_price(),
                'sale_price'    => $variation->is_on_sale() ? (float) $variation->get_sale_price() : null,
                'in_stock'      => $variation->is_in_stock(),
                'attributes'    => $variation_data['attributes'],
                'image'         => $this->get_thumbnail( $variation ),
            ];
        }

        return $variations;
    }

    // ── Argument schemas ─────────────────────────────────────────────────────

    private function collection_args(): array {
        return [
            'page'      => [
                'default'           => 1,
                'sanitize_callback' => 'absint',
            ],
            'per_page'  => [
                'default'           => 12,
                'sanitize_callback' => static fn( $v ) => min( absint( $v ), 100 ),
            ],
            'category'  => [
                'default'           => '',
                'sanitize_callback' => 'sanitize_text_field',
            ],
            'search'    => [
                'default'           => '',
                'sanitize_callback' => 'sanitize_text_field',
            ],
            'min_price' => [
                'default'           => null,
                'sanitize_callback' => static fn( $v ) => $v !== null ? (float) $v : null,
            ],
            'max_price' => [
                'default'           => null,
                'sanitize_callback' => static fn( $v ) => $v !== null ? (float) $v : null,
            ],
            'orderby'   => [
                'default'           => 'date',
                'enum'              => [ 'date', 'price', 'title', 'popularity', 'rating' ],
                'sanitize_callback' => 'sanitize_key',
            ],
            'order'     => [
                'default'           => 'desc',
                'enum'              => [ 'asc', 'desc' ],
                'sanitize_callback' => 'sanitize_key',
            ],
        ];
    }
}
