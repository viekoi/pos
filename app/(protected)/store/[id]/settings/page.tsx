import StoreDetails from "@/components/forms/store-details";
import { getAuthUserDetail, getStoreById, getStoreStaff } from "@/lib/queries";
import { redirect } from "next/navigation";

import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  const user = await getAuthUserDetail();
  if (!user) return;

  const store = await getStoreById(params.id);

  if (!store) redirect("/store");

  const userRole = getStoreStaff(user.id, store.id);

  if (!userRole) redirect("/store");

  return (
    <div>
      <StoreDetails data={store} />
    </div>
  );
};

export default page;
