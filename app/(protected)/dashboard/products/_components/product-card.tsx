"use client";

import React from "react";

import Image from "next/image";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductWithBrandsAndCategory } from "@/type";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import formatPriceVND, { cn } from "@/lib/utils";
import { useModal } from "@/providers/modal-provider";
import CustomModal from "@/components/modals/custom-modal";
import ProductDetail from "@/components/forms/product-detail";
import { Brand, Category } from "@prisma/client";

type Props = {
  product: ProductWithBrandsAndCategory;
  brands: Brand[];
  categories: Category[];
};

const ProductCard = ({ product, categories, brands }: Props) => {
  const { setOpen } = useModal();
  return (
    <Card
      className="w-full hover:cursor-pointer"
      onClick={() =>
        setOpen(
          <CustomModal title="" subheading="">
            <ProductDetail
              categories={categories}
              brands={brands}
              data={product}
            />
          </CustomModal>
        )
      }
    >
      <AspectRatio ratio={1}>
        <Image
          src={product.imageUrl || "/images/placeholder.webp"}
          alt="preview image"
          fill
          className="object-cover rounded-lg"
        />
      </AspectRatio>

      <CardHeader>
        <div className="flex flex-col gap-y-2">
          <CardTitle>{product.name}</CardTitle>
          <div className="flex items-center justify-between">
            <h1 className={cn("font-bold text-foreground",product.isDiscounting && "line-through")}>
              {formatPriceVND(product.basePrice)}
            </h1>
            {product.isDiscounting && (
              <h1 className=" font-bold text-red-600">
                {formatPriceVND(product.discountPrice)}
              </h1>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default ProductCard;
