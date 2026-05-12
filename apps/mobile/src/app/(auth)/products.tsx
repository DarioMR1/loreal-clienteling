import React, { useState } from "react";

import { SplitView } from "@/components/layout/split-view";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductGrid } from "@/features/product-catalog/product-grid";
import { ProductDetail } from "@/features/product-catalog/product-detail";
import type { Product } from "@/types";

export default function ProductsScreen() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <SplitView
      master={
        <ProductGrid
          selectedId={selectedProduct?.id ?? null}
          onSelect={setSelectedProduct}
        />
      }
      detail={
        selectedProduct ? (
          <ProductDetail product={selectedProduct} />
        ) : (
          <EmptyState
            icon="bag"
            title="Selecciona un producto"
            message="Elige un producto del catálogo para ver su ficha"
          />
        )
      }
    />
  );
}
