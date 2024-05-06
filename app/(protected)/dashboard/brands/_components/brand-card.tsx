"use client";
import { Brand } from "@prisma/client";
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
import BrandDetail from "@/components/forms/brand-detail";

type Props = { brand: Brand };

const BrandCard = ({ brand }: Props) => {
  const { setOpen } = useModal();

  // const onDeleteBrand = async (brandId: string) => {
  //   try {
  //     const res = await deleteBrand(brandId);
  //     console.log(res);
  //     if (res) {
  //       toast({
  //         variant: "default",
  //         description: "brand deleted",
  //       });
  //       router.refresh();
  //     } else {
  //       toast({
  //         variant: "destructive",
  //         description: "Something went wrong!!!",
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast({
  //       variant: "destructive",
  //       description: "Something went wrong!!!",
  //     });
  //   }
  // };

  return (
    <Card
      className="w-full hover:cursor-pointer"
      onClick={() =>
        setOpen(
          <CustomModal subheading="" title="Brand Infomation">
            <BrandDetail data={brand} />
          </CustomModal>
        )
      }
    >
      <AspectRatio ratio={4 / 3}>
        <Image
          src={brand.imageUrl || "/images/placeholder.webp"}
          alt="preview image"
          fill
          className="object-cover rounded-lg"
        />
      </AspectRatio>

      <CardHeader>
        <CardTitle className="text-xl">{brand.name}</CardTitle>
        <CardDescription>{brand.description}</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default BrandCard;
