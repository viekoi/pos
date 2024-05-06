import React from "react";
import MediaComponent from "./_component/media-component";
import { getAuthUserDetail, getStore } from "@/lib/queries";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const page = async () => {
  const user = await getAuthUserDetail();
  if (!user) redirect("/");

  const store = await getStore();

  if (!store) redirect("setup");

  const medias = await db.media.findMany({
    where: {
      storeId: store.id,
    },
  });
  return <MediaComponent data={medias} />;
};

export default page;
