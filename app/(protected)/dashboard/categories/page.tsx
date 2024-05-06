import React from "react";
import CategoryComponent from "./_component/category-component";
import { getAuthUserDetail, getStore } from "@/lib/queries";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const page = async () => {
  const user = await getAuthUserDetail();
  if (!user) redirect("/");

  const store = await getStore();

  if (!store) redirect("setup");

  const categories = await db.category.findMany({
    where: {
      storeId: store.id,
    },
  });

  return <CategoryComponent data={categories} />;
};

export default page;
