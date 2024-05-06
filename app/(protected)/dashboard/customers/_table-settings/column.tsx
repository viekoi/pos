"use client";
import clsx from "clsx";
import { ColumnDef } from "@tanstack/react-table";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";


import { Customer } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CellActions from "./cell-actions";

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "id",
    header: "",
    cell: () => {
      return null;
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 relative flex-none">
            <Avatar>
              <AvatarImage alt="@shadcn" />
              <AvatarFallback className="bg-primary text-white">
                {row.original.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <span>{row.original.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return <div className="">{row.original.email}</div>;
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      return <div className="">{row.original.phone}</div>;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      return <CellActions rowData={row.original} />;
    },
  },
];
