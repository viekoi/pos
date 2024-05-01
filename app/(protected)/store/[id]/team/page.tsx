import { db } from "@/lib/db";
import {
  getAuthUserDetail,
  getStoreStaffs,
  getStoreById,
  getStoreStaff,
} from "@/lib/queries";
import { redirect } from "next/navigation";
import React from "react";
import DataTable from "./data-table";
import { columns } from "./columns";
import { Plus } from "lucide-react";
import SendInvitation from "@/components/forms/team-invite";
import TeamInvite from "@/components/forms/team-invite";

const page = async ({ params }: { params: { id: string } }) => {
  const user = await getAuthUserDetail();
  if (!user) return;

  const store = await getStoreById(params.id);

  if (!store) redirect("/store");

  const userRole = getStoreStaff(user.id, store.id);

  if (!userRole) redirect("/store");

  const data = await getStoreStaffs(store.id);

  return (
    <div>
      <DataTable
        columns={columns}
        filterValue="name"
        data={data}
        actionButtonText={
          <>
            <Plus size={15} />
            Add
          </>
        }
        modalChildren={<TeamInvite storeId={params.id} />}
      />
    </div>
  );
};

export default page;
