import { Brand, Category, Media, Notification, Product, User } from "@prisma/client";

export type UserWithNotification = Notification & { user: User };

export type ProductWithBrandsAndCategory = Product & {categories:Category[]} &{brands:Brand[]}

