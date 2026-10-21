"use client";

// Client boundary: the catalog is shared interactive state across product routes.
import { createContext, useCallback, useContext, useEffect, useReducer, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchProducts } from "@/lib/api";
import type { Product } from "@/lib/types";

interface State {
  products: Product[];
  status: "loading" | "success" | "error";
  error: string | null;
  notice: string;
  noticeId: number;
  nextId: number;
}
type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; products: Product[] }
  | { type: "FETCH_ERROR"; error: string }
  | { type: "ADD"; product: Product }
  | { type: "UPDATE"; product: Product }
  | { type: "DELETE"; id: number }
  | { type: "DISMISS_NOTICE" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START": return { ...state, status: "loading", error: null };
    case "FETCH_SUCCESS": return { products: action.products, status: "success", error: null, notice: "", noticeId: state.noticeId, nextId: Math.max(0, ...action.products.map((product) => product.id)) + 1 };
    case "FETCH_ERROR": return { ...state, status: "error", error: action.error };
    case "ADD": return { ...state, products: [...state.products, action.product], nextId: Math.max(state.nextId, action.product.id + 1), notice: `“${action.product.name}” was created${action.product.status === "Archived" ? " as Archived" : ""}.`, noticeId: state.noticeId + 1 };
    case "UPDATE": {
      const previous = state.products.find((product) => product.id === action.product.id);
      if (!previous) return state;
      const archived = previous.status !== "Archived" && action.product.status === "Archived";
      const restored = previous.status === "Archived" && action.product.status !== "Archived";
      const message = archived ? "was archived" : restored ? `was restored as ${action.product.status}` : "was updated";
      return { ...state, products: state.products.map((p) => p.id === action.product.id ? action.product : p), notice: `“${action.product.name}” ${message}.`, noticeId: state.noticeId + 1 };
    }
    case "DELETE": {
      const product = state.products.find((product) => product.id === action.id);
      if (!product) return state;
      return { ...state, products: state.products.filter((product) => product.id !== action.id), notice: `“${product.name}” was deleted.`, noticeId: state.noticeId + 1 };
    }
    case "DISMISS_NOTICE": return { ...state, notice: "" };
  }
}

interface ProductsContextValue extends State {
  retry: () => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
  dismissNotice: () => void;
  getProductById: (id: string) => Product | undefined;
}
const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { products: [], status: "loading", error: null, notice: "", noticeId: 0, nextId: 1 });
  const [reloadKey, setReloadKey] = useState(0);
  const searchParams = useSearchParams();
  // Simulate only the initial load. Retry deliberately makes a normal request.
  const initialSimulation = useRef(searchParams.get("simulate"));

  useEffect(() => {
    const controller = new AbortController();
    const simulation = reloadKey === 0 ? initialSimulation.current : null;
    fetchProducts({
      delay: simulation === "slow" ? 2000 : undefined,
      fail: simulation === "error",
      signal: controller.signal,
    }).then((products) => {
      if (!controller.signal.aborted) dispatch({ type: "FETCH_SUCCESS", products });
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) dispatch({
        type: "FETCH_ERROR",
        error: error instanceof Error ? error.message : "Could not load products. Please try again.",
      });
    });
    return () => controller.abort();
  }, [reloadKey]);

  function retry() {
    if (state.status !== "error") return;
    dispatch({ type: "FETCH_START" });
    setReloadKey((key) => key + 1);
  }

  const dismissNotice = useCallback(() => dispatch({ type: "DISMISS_NOTICE" }), []);

  return (
    <ProductsContext.Provider value={{
      ...state, retry,
      addProduct: (product) => { dispatch({ type: "ADD", product }); },
      updateProduct: (product) => { dispatch({ type: "UPDATE", product }); },
      deleteProduct: (id) => { dispatch({ type: "DELETE", id }); },
      dismissNotice,
      getProductById: (id) => state.products.find((p) => String(p.id) === id),
    }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) throw new Error("useProducts must be used inside ProductsProvider.");
  return context;
}
