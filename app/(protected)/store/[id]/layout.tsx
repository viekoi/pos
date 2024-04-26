import React from "react";
import InfoBar from "../_components/info-bar";

import {
  getAuthUserDetail,
  getNotificationAndUser,
  getStoreById,
  getUserStoreRole,
} from "@/lib/queries";
import { redirect } from "next/navigation";
import Sidebar from "../_components/side-bar";
import { db } from "@/lib/db";
import SideBar from "../_components/side-bar";

const StoreLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) => {
  const user = await getAuthUserDetail();

  if (!user) return;

  const store = await getStoreById(params.id);

  if (!store) redirect("/store");

  const userStoreRole = await getUserStoreRole(user.id, store.id);

  if (!userStoreRole) redirect("/store");

  const userWithStoreData = await db.userToStore.findMany({
    where: {
      userId: user.id,
    },
    include: {
      Store: true,
    },
  });
  
  const stores = userWithStoreData.map((u) => u.Store);

  let allNoti: any = [];
  const notifications = await getNotificationAndUser(store.id);
  if (notifications) allNoti = notifications;
  return (
    <div className="relative flex w-full min-h-screen">
      <SideBar stores={stores} store={store} user={user}/>
      <div className="flex-[1_0_0] relative">
        <InfoBar notifications={allNoti} user={user} />
        {children}
      </div>
    </div>
  );
};

export default StoreLayout;
