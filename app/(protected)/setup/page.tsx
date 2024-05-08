import StoreDetails from "@/components/forms/store-details";
import { getAuthUserDetail, getStore } from "@/lib/queries";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const user = await getAuthUserDetail();
  if (!user) return;

  const store = await getStore();


  if (store) {
    redirect(`/dashboard`);
  }

  return (
    <div className="max-w-[1240px] mx-auto h-full flex flex-col items-center gap-y-5 p-4">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text ">
        Create your store
      </h1>
      <StoreDetails />
    </div>
  );
};

export default page;
