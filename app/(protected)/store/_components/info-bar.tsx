"use client";

import React from "react";
import { twMerge } from "tailwind-merge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, User2 } from "lucide-react";
import { ModeToggle } from "@/components/switches/mode-toggle";
import { UserWithNotification } from "@/type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { User } from "@prisma/client";
import { signOut } from "next-auth/react";

type Props = {
  notifications: UserWithNotification;
  className?: string;
  user:User 
};

const InfoBar = ({ notifications, className,user}: Props) => {
  return (
    <>
      <div
        className={twMerge(
          "fixed z-[20] md:left-[300px] left-0 right-0 top-0 p-4 bg-background/80 backdrop-blur-md flex  gap-4 items-center border-b-[1px] ",
          className
        )}
      >
        <div className="flex items-center gap-2 ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={user.image ? user.image : ""} />
                  <AvatarFallback>
                    <User2 />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => signOut()}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          <Sheet>
            <SheetTrigger>
              <div className="rounded-full w-9 h-9 bg-primary flex items-center justify-center text-white">
                <Bell size={17} />
              </div>
            </SheetTrigger>
            <SheetContent className="mt-4 mr-4 pr-4 overflow-auto custom-scrollbar">
              <SheetHeader className="text-left">
                <SheetTitle>Notifications</SheetTitle>
              </SheetHeader>
              {notifications?.map((notification) => (
                <div
                  key={notification.id}
                  className="flex flex-col gap-y-2 mb-2 overflow-x-scroll text-ellipsis"
                >
                  <div className="flex gap-2">
                    <Avatar>
                      <AvatarImage
                        src={notification.user.image || ""}
                        alt="Profile Picture"
                      />
                      <AvatarFallback className="bg-primary">
                        <User2 />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p>
                        <span className="font-bold">
                          {notification.notification.split("|")[0]}
                        </span>
                        <span className="text-muted-foreground">
                          {notification.notification.split("|")[1]}
                        </span>
                        <span className="font-bold">
                          {notification.notification.split("|")[2]}
                        </span>
                      </p>
                      <small className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
              {notifications?.length === 0 && (
                <div
                  className="flex items-center justify-center text-muted-foreground"
                  mb-4
                >
                  You have no notifications
                </div>
              )}
            </SheetContent>
          </Sheet>
          <ModeToggle />
        </div>
      </div>
    </>
  );
};

export default InfoBar;