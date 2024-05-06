"use client";
import { Category } from "@prisma/client";
import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useModal } from "@/providers/modal-provider";
import CustomModal from "@/components/modals/custom-modal";
import CategoryDetail from "@/components/forms/category-detail";

type Props = { category: Category };

const CategoryCard = ({ category }: Props) => {
  const { setOpen } = useModal();

  return (
    <Card
      className="w-full hover:cursor-pointer"
      onClick={() =>
        setOpen(
          <CustomModal subheading="update category" title="Category Information">
            <CategoryDetail data={category} />
          </CustomModal>
        )
      }
    >
      <AspectRatio ratio={4 / 3}>
        <Image
          src={category.imageUrl || "/images/placeholder.webp"}
          alt="preview image"
          fill
          className="object-cover rounded-lg"
        />
      </AspectRatio>

      <CardHeader>
        <CardTitle className="text-xl">{category.name}</CardTitle>
        <CardDescription>{category.description}</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default CategoryCard;
