import React from "react";
import InfoBar from "../_components/info-bar";

import {
  getAuthUserDetail,
  getNotificationAndUser,
  getStoreById,
  getStoreStaff
} from "@/lib/queries";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import SideBar from "../_components/side-bar";
import AuthUserWithRoleProvider from "@/providers/auth-user-with-role-provider";

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

  const userStoreRole = await getStoreStaff(user.id, store.id);

  if (!userStoreRole) redirect("/store");

  const userWithStoreData = await db.userToStore.findMany({
    where: {
      userId: user.id,
    },
    include: {
      store: true,
    },
  });

  const stores = userWithStoreData.map((u) => u.store);

  let allNoti: any = [];
  const notifications = await getNotificationAndUser(store.id);
  if (notifications) allNoti = notifications;
  return (
    <AuthUserWithRoleProvider storeId={store.id}>
      <div className="relative flex w-full min-h-screen">
        <SideBar stores={stores} store={store} user={user} />
        <div className="flex-[1_0_0] relative">
          <InfoBar notifications={allNoti} user={user} />
          {children}
        </div>
      </div>
    </AuthUserWithRoleProvider>
  );
};

export default StoreLayout;
