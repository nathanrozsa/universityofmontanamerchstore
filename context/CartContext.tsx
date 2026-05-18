"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { CartItem, Product } from "@/types";

interface CartState {
  items: CartItem[];
}

type CartAction =
  | {
      type: "ADD_ITEM";
      payload: { product: Product; quantity: number; size?: string; color?: string };
    }
  | { type: "REMOVE_ITEM"; payload: { productId: string; size?: string; color?: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number; size?: string; color?: string } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity, size, color } = action.payload;
      const idx = state.items.findIndex(
        (i) =>
          i.product.id === product.id &&
          i.selectedSize === size &&
          i.selectedColor === color
      );
      if (idx >= 0) {
        const next = [...state.items];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return { items: next };
      }
      return {
        items: [
          ...state.items,
          { product, quantity, selectedSize: size, selectedColor: color },
        ],
      };
    }
    case "REMOVE_ITEM":
      return {
        items: state.items.filter(
          (i) =>
            !(
              i.product.id === action.payload.productId &&
              i.selectedSize === action.payload.size &&
              i.selectedColor === action.payload.color
            )
        ),
      };
    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return {
          items: state.items.filter(
            (i) =>
              !(
                i.product.id === action.payload.productId &&
                i.selectedSize === action.payload.size &&
                i.selectedColor === action.payload.color
              )
          ),
        };
      }
      return {
        items: state.items.map((i) =>
          i.product.id === action.payload.productId &&
          i.selectedSize === action.payload.size &&
          i.selectedColor === action.payload.color
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };
    }
    case "CLEAR_CART":
      return { items: [] };
    case "LOAD_CART":
      return { items: action.payload };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (product: Product, quantity: number, size?: string, color?: string) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("um-merch-cart");
      if (saved) dispatch({ type: "LOAD_CART", payload: JSON.parse(saved) });
    } catch {}
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem("um-merch-cart", JSON.stringify(state.items));
  }, [state.items]);

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const total = state.items.reduce(
    (sum, i) => sum + (i.product.salePrice ?? i.product.price) * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        itemCount,
        total,
        addItem: (p, qty, size, color) =>
          dispatch({ type: "ADD_ITEM", payload: { product: p, quantity: qty, size, color } }),
        removeItem: (id, size, color) =>
          dispatch({ type: "REMOVE_ITEM", payload: { productId: id, size, color } }),
        updateQuantity: (id, qty, size, color) =>
          dispatch({ type: "UPDATE_QUANTITY", payload: { productId: id, quantity: qty, size, color } }),
        clearCart: () => dispatch({ type: "CLEAR_CART" }),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
