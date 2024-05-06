"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";

import Link from "next/link";
import { ModeToggle } from "@/components/switches/mode-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User2 } from "lucide-react";
import { User } from "@prisma/client";

type Props = {
  user: User | null;
};

const Navigation = ({ user }: Props) => {
  const router = useRouter();
  return (
    <div className="fixed top-0 right-0 left-0 p-4 flex items-center justify-between z-10">
      <aside className="flex items-center gap-2">
        <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text ">
          {" "}
          Pos.
        </span>
      </aside>
      <nav className="hidden md:block absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%]">
        <ul className="flex items-center justify-center gap-8">
          <Link href={"#"}>Pricing</Link>
          <Link href={"#"}>About</Link>
          <Link href={"#"}>Documentation</Link>
          <Link href={"#"}>Features</Link>
        </ul>
      </nav>
      <aside className="flex gap-2 items-center">
        {user ? (
          <Button onClick={() => router.push("/setup")}>Dashboard</Button>
        ) : (
          <Button onClick={() => signIn("google")}>Login</Button>
        )}
        {user  && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={user.image} />
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
        )}

        <ModeToggle />
      </aside>
    </div>
  );
};

export default Navigation;
