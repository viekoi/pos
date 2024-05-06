"use client";

import ProductDetail from "@/components/forms/product-detail";
import CustomModal from "@/components/modals/custom-modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/modal-provider";
import { Brand, Category } from "@prisma/client";
import { Plus } from "lucide-react";

import React from "react";

interface Props {
  brands: Brand[];
  categories: Category[];
}

const ProductAddButton: React.FC<Props> = ({ brands, categories }) => {
  const { setOpen } = useModal();

  return (
    <Button
      className="gap-x-2"
      onClick={() => {
        setOpen(
          <CustomModal
            title="Add a product"
            subheading="add a product to your store"
          >
            <ProductDetail brands={brands} categories={categories} />
          </CustomModal>
        );
      }}
    >
      Add
      <Plus size={15} />
    </Button>
  );
};

export default ProductAddButton;
