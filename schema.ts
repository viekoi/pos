import * as z from "zod";

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

export const BrandShcema = z.object({
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
    basePrice: z.number(),
    discountPrice: z.number(),
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
