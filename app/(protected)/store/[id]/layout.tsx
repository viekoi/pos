import BlurPage from "@/components/shared/blur-page";
import React from "react";
import InfoBar from "../_components/info-bar";

import {
  getAuthUserDetail,
  getNotificationAndUser,
  getStoreById,
  getUserStoreRole,
} from "@/lib/queries";
import { redirect } from "next/navigation";

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

  let allNoti: any = [];
  const notifications = await getNotificationAndUser(store.id);
  if (notifications) allNoti = notifications;
  return (
    <div className="h-screen">
      {/* <Sidebar id={params.agencyId} type="agency" /> */}
      <div className="md:pl-[300px]">
        <InfoBar notifications={allNoti} user={user} />
        <div className="relative">
          <BlurPage>{children}</BlurPage>
        </div>
      </div>
    </div>
  );
};

export default StoreLayout;
