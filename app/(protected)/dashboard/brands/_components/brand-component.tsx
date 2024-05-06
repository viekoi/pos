import React from "react";

import { FolderSearch } from "lucide-react";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { Brand } from "@prisma/client";
import BrandCard from "./brand-card";
import BrandAddButton from "./add-button";

type Props = {
  data: Brand[];
};

const BrandComponent = ({ data }: Props) => {
  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl">Brands</h1>
        <BrandAddButton />
      </div>
      <Command className="bg-transparent">
        <CommandInput placeholder="Search for brand name..." />
        <CommandList className="pb-40 max-h-full ">
          <CommandGroup heading="Brands">
            <div className="grid  md:grid-cols-2 xl:grid-cols-6  grid-cols-2  gap-2">
              {data.map((brand) => (
                <CommandItem
                  key={brand.id}
                  className="p-0 col-span-1 rounded-lg !bg-transparent !font-medium !text-white"
                >
                  <BrandCard brand={brand} />
                </CommandItem>
              ))}
              {!data.length && (
                <div className=" col-span-full flex items-center justify-center w-full flex-col">
                  <FolderSearch
                    size={200}
                    className="dark:text-muted text-slate-300"
                  />
                  <p className="text-muted-foreground ">
                    Empty! no brand to show.
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

export default BrandComponent;
