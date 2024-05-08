import {
  Brand,
  Category,
  Customer,
  Media,
  Notification,
  Order,
  OrderItem,
  Product,
  User,
} from "@prisma/client";

import * as z from "zod";
import { OrderDetailSchema } from "./schema";

export type UserWithNotification = Notification & { user: User };

export type ProductWithBrandsAndCategory = Product & {
  categories: Category[];
} & { brands: Brand[] };

export type OrderItemWithProduct = OrderItem & {
  product?: ProductWithBrandsAndCategory;
};

export type OrderWithOrderItems = Order & {
  orderItems: OrderItemWithProduct[];
};
