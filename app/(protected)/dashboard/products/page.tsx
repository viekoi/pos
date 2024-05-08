import { db } from "@/lib/db";
import { getAuthUserDetail, getStore } from "@/lib/queries";
import { redirect } from "next/navigation";
import React from "react";
import ProductComponent from "./_components/product-component";

const page = async () => {
  const user = await getAuthUserDetail();

  if (!user) redirect("/");

  const store = await getStore();

  if (!store) redirect("setup");

  const products = await db.product.findMany({
    where: {
      storeId: store.id,
    },
    include: {
      brands: true,
      categories: true,
    },
    orderBy: {
      createdAt: "asc", // Sort by createdAt field in descending order
    },
  });

  const brands = await db.brand.findMany({
    where: {
      storeId: store.id,
    },
  });

  const categories = await db.category.findMany({
    where: {
      storeId: store.id,
    },
  });

  return (
    <ProductComponent brands={brands} categories={categories} data={products} />
  );
};

export default page;
