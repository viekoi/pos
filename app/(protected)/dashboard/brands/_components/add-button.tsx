"use client";
import BrandDetail from "@/components/forms/brand-detail";
import CustomModal from "@/components/modals/custom-modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/modal-provider";
import { Plus } from "lucide-react";

import React from "react";

const BrandAddButton = () => {
  const { setOpen } = useModal();

  return (
    <Button
      className="gap-x-2"
      onClick={() => {
        setOpen(
          <CustomModal
            title="Add a brand"
            subheading="add a brand to your store"
          >
            <div className=""></div>
            <BrandDetail />
          </CustomModal>
        );
      }}
    >
      Add
      <Plus size={15} />
    </Button>
  );
};

export default BrandAddButton;
