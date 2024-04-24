import { Notification, User } from "@prisma/client";

export type UserWithNotification = (Notification &{user:User})[]