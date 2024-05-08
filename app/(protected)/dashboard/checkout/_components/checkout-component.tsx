"use client"
import React from "react";

import { FolderSearch, Plus } from "lucide-react";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { Order } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Props = {
  data: Order[];
};

const CheckoutComponent = ({ data }: Props) => {
  const router = useRouter()
  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl">Orders</h1>
        <Button className="gap-x-2" onClick={()=>router.push("/dashboard/checkout/new")}>
          Add
          <Plus size={15} />
        </Button>
      </div>
      <Command className="bg-transparent">
        <CommandInput placeholder="Search for order name..." />
        <CommandList className="pb-40 max-h-full ">
          <CommandGroup heading="Orders">
            <div className="grid  md:grid-cols-2 xl:grid-cols-6  grid-cols-2  gap-2">
              {data.map((o) => (
                <CommandItem
                  key={o.id}
                  className="p-0 col-span-1 rounded-lg !bg-transparent !font-medium !text-white"
                >
                  {/* <BrandCard brand={brand} /> */}
                </CommandItem>
              ))}
              {!data.length && (
                <div className=" col-span-full flex items-center justify-center w-full flex-col">
                  <FolderSearch
                    size={200}
                    className="dark:text-muted text-slate-300"
                  />
                  <p className="text-muted-foreground ">
                    Empty! no order history to show.
                  </p>
                </div>
              )}
            </div>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default CheckoutComponent;
