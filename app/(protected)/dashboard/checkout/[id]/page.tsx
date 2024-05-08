import OrderDetail from "@/components/forms/order-detail";
import { db } from "@/lib/db";
import { getAuthUserDetail, getStore } from "@/lib/queries";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: { id: string } }) => {
  const user = await getAuthUserDetail();
  if (!user) redirect("/");

  const store = await getStore();

  if (!store) redirect("setup");

  const order = await db.order.findFirst({
    where: {
      storeId: store.id,
      id: params.id,
    },
    include: {
      orderItems: true,
      customer:true,
    },
  });

  const products = await db.product.findMany({
    where: {
      storeId: store.id,
    },
    include: {
      brands: true,
      categories: true,
    },
  });

  const customers = await db.customer.findMany({
    where: {
      storeId: store.id,
    },
  });

  return <OrderDetail data={order || undefined} products={products} customers={customers} />;
};

export default page;
