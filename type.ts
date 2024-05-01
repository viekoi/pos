import { Notification, Role, User, UserToStore } from "@prisma/client";

export type UserWithNotification = Notification & {staff:Staff};
export type Staff = UserToStore & { user: {email: string } };
