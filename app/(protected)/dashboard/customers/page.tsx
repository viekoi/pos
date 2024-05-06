import React from "react";
import DataTable from "../_components/data-table";
import { columns } from "./_table-settings/column";
import { getAuthUserDetail, getStore } from "@/lib/queries";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Plus } from "lucide-react";
import CustomModal from "@/components/modals/custom-modal";
import CustomerDetail from "@/components/forms/customer-detail";

const page = async () => {
  const user = await getAuthUserDetail();
  if (!user) redirect("/");

  const store = await getStore();

  if (!store) redirect("setup");

  const customers = await db.customer.findMany({
    where: {
      storeId: store.id,
    },
  });

  return (
    <DataTable
      columns={columns}
      data={customers}
      filterValue="name"
      actionButtonText={
        <>
          <Plus size={15} />
          add
        </>
      }
      modalChildren={<CustomerDetail />}
      modalChildrenHeader="Add customer"
      modalChildrenDescription="add or update a customer"
    />
  );
};

export default page;
