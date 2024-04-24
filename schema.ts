import * as z from "zod"
export const StoreDetailsSchema= z.object({
    id:z.string().optional(),
    name: z.string().min(2, { message: "store name must be atleast 2 chars." }),
    storeEmail: z.string().min(1),
    storePhone: z.string().min(1),
    whiteLabel: z.boolean(),
    address: z.string().min(1),
    city: z.string().min(1),
    zipCode: z.string().min(1),
    state: z.string().min(1),
    country: z.string().min(1),
    storeLogo: z.string().min(1).nullable(),
    goal:z.number(),
  });