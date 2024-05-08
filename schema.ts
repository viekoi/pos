import { OrderItem } from "@prisma/client";
import * as z from "zod";
import { OrderItemWithProduct, ProductWithBrandsAndCategory } from "./type";

export const StoreDetailsSchema = z.object({
  name: z.string().min(2, { message: "store name must be atleast 2 chars." }),
  storeEmail: z.string().min(1),
  storePhone: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  storeLogo: z.string().min(1).nullable(),
});

export const CustomerDetailSchema = z.object({
  name: z
    .string()
    .min(2, { message: "customer name must be atleast 2 chars." }),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

export const MediaSchema = z.object({
  imageUrl: z.string().min(1, { message: "Media File is required" }),
  name: z.string().min(1, { message: "Name is required" }),
});

export const CategorySchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string(),
  imageUrl: z.string().min(1).nullable(),
});

export const BrandSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string(),
  imageUrl: z.string().min(1).nullable(),
});

export const ProductSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string(),
    isDiscounting: z.boolean(),
    imageUrl: z.string().min(1).nullable(),
    basePrice: z.coerce.number(),
    discountPrice:z.coerce.number(),
    categories: z.array(
      z.object({
        name: z.string(),
        id: z.string(),
      })
    ),
    brands: z.array(
      z.object({
        name: z.string(),
        id: z.string(),
      })
    ),
  })
  .refine(
    (data) => {
      if (data.isDiscounting && data.discountPrice >= data.basePrice) {
        return false;
      } else {
        return true;
      }
    },
    {
      path: ["discountPrice"],
      message: `Discount price should be lower than base price`,
    }
  );

export const OrderItemSchema = z.object({
  id: z.string().nullable(),
  name: z.string(),
  productId: z.string(),
  isDiscounting: z.boolean(),
  basePrice: z.coerce.number(),
  discountPrice: z.coerce.number(),
  note: z.string(),
  quantity: z.coerce.number(),
  sellingPrice: z.coerce.number(),
  product: z.custom<ProductWithBrandsAndCategory>().optional(),
});

export const OrderCustomerSchema = z.object({
  name: z.string(),
  customerId: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  country: z.string().nullable(),
});

export const OrderDetailSchema = z.object({
  subTotalPrice: z.coerce.number(),
  totalAmount: z.coerce.number(),
  shippingPrice: z.coerce.number(),
  discountPercent: z.coerce.number(),
  finalPrice: z.coerce.number(),
  note: z.string(),
  customer: OrderCustomerSchema.nullable(),
  orderItems: z.array(OrderItemSchema),
});
