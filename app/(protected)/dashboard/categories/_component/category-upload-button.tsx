"use client";
import CategoryDetail from "@/components/forms/category-detail";
import CustomModal from "@/components/modals/custom-modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/modal-provider";
import { Plus } from "lucide-react";

import React from "react";

const CategoryUploadButton = () => {
  const { setOpen } = useModal();

  return (
    <Button
      className="gap-x-2"
      onClick={() => {
        setOpen(
          <CustomModal
            title="Add a category"
            subheading="add a category to your store"
          >
            <div className=""></div>
            <CategoryDetail />
          </CustomModal>
        );
      }}
    >
      Add
      <Plus size={15} />
    </Button>
  );
};

export default CategoryUploadButton;
