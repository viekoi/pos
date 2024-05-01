"use client";
import clsx from "clsx";
import { ColumnDef } from "@tanstack/react-table";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Staff } from "@/type";
import CellActions from "./action";

export const columns: ColumnDef<Staff>[] = [
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
            <Image
              src={row.original.image || ""}
              fill
              className="rounded-full object-cover"
              alt="avatar image"
            />
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
      return <div className="">{row.original.user.email}</div>;
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
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      return (
        <Badge
          className={clsx({
            "bg-emerald-500": row.original.role === "STORE_OWNER",
            "bg-orange-400": row.original.role === "STORE_ADMIN",
            "bg-primary": row.original.role === "STORE_STAFF",
          })}
        >
          {row.original.role}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <CellActions rowData={row.original} />;
    },
  },
];
