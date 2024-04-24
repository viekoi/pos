import { auth } from "@/auth";
import { db } from "@/lib/db";
import React from "react";
import { redirect } from "next/navigation";
import StoreSelect from "./_components/store-select";
import { getAuthUserDetail } from "@/lib/queries";

const Page = async ({}: { searchParams: { action: "select" | "create" } }) => {
  const user = await getAuthUserDetail();
  if (!user) return;

  const userWithStoreData = await db.userToStore.findMany({
    where: {
      userId: user.id,
    },
    include: {
      Store: true,
    },
  });

  const stores = userWithStoreData.map((u) => u.Store);

  return <StoreSelect stores={stores} />;
};

export default Page;
