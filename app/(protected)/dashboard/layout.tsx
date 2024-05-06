import {
  getAuthUserDetail,
  getNotificationAndUser,
  getStore,
} from "@/lib/queries";
import { redirect } from "next/navigation";
import React from "react";
import SideBar from "./_components/side-bar";
import InfoBar from "./_components/info-bar";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getAuthUserDetail();

  if (!user) redirect("/");

  const store = await getStore();

  if (!store) redirect("/dashboard");

  let allNoti: any = [];
  const notifications = await getNotificationAndUser(store.id);
  if (notifications) allNoti = notifications;

  return (
    <div className="relative flex w-full min-h-screen">
      <SideBar store={store} user={user} />
      <div className="flex-[1_0_0] relative flex flex-col gap-y-2 ">
        <InfoBar notifications={allNoti} user={user} />
        <div className="px-4">{children}</div>
      </div>
    </div>
  );
};

export default layout;
