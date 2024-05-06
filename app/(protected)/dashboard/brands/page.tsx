import { db } from "@/lib/db";
import { getAuthUserDetail, getStore } from "@/lib/queries";
import { redirect } from "next/navigation";
import React from "react";
import BrandComponent from "./_components/brand-component";

const page = async () => {
  const user = await getAuthUserDetail();
  if (!user) redirect("/");

  const store = await getStore();

  if (!store) redirect("setup");

  const brands = await db.brand.findMany({
    where: {
      storeId: store.id,
    },
  });

  

  return <BrandComponent data={brands} />;
};

export default page;
