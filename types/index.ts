export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  salePrice?: number;
  category: string;
  description: string;
  longDescription: string;
  images: string[];
  sizes?: string[];
  colors?: string[];
  inStock: boolean;
  featured: boolean;
  badge?: string;
  stripePriceId?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  count: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}
