import * as z from "zod";
import { Staff } from "./type";
import { Role } from "@prisma/client";
export const StoreDetailsSchema = z.object({
  id: z.string().optional(),
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
});

export const StaffSchema = z.object({
  id:z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  image: z.string(),
  phone: z.string().optional(),
  role: z.enum(["STORE_OWNER", "STORE_ADMIN", "STORE_STAFF"]),
});

export const TeamInviteShcema = z.object({
  email: z.string().email(),
  role: z.enum(["STORE_STAFF", "STORE_ADMIN"]),
});
