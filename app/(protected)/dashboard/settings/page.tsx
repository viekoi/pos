import StoreDetails from "@/components/forms/store-details";
import { getAuthUserDetail, getStore } from "@/lib/queries";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const user = await getAuthUserDetail();
  if (!user) redirect("/");

  const store = await getStore();

  if (!store) redirect("setup");

  return <StoreDetails data={store}  />;
};

export default page;
