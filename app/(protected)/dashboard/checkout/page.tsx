import { db } from "@/lib/db";
import { getAuthUserDetail, getStore } from "@/lib/queries";
import { redirect } from "next/navigation";
import CheckoutComponent from "./_components/checkout-component";

const page = async () => {
  const user = await getAuthUserDetail();
  if (!user) redirect("/");

  const store = await getStore();

  if (!store) redirect("setup");

  const orders = await db.order.findMany({
    where: {
      storeId: store.id,
    },
  });



  return <CheckoutComponent data={orders} />;
};

export default page;
