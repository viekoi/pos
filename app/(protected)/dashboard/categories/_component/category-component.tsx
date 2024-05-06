import React from "react";

import { FolderSearch } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import CategoryUploadButton from "./category-upload-button";
import CategoryCard from "./category-card";
import { Category } from "@prisma/client";

type Props = {
  data: Category[];
};

const CategoryComponent = ({ data }: Props) => {
  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl">Categories</h1>
        <CategoryUploadButton />
      </div>
      <Command className="bg-transparent">
        <CommandInput placeholder="Search for category name..." />
        <CommandList className="pb-40 max-h-full ">
          <CommandGroup heading="Categories">
            <div className="grid  md:grid-cols-2 xl:grid-cols-6  grid-cols-2   gap-2">
              {data.map((category) => (
                <CommandItem
                  key={category.id}
                  className="p-0 col-span-1 rounded-lg !bg-transparent !font-medium !text-white"
                >
                  <CategoryCard category={category} />
                </CommandItem>
              ))}
              {!data.length && (
                <div className="col-span-full flex items-center justify-center w-full flex-col">
                  <FolderSearch
                    size={200}
                    className="dark:text-muted text-slate-300"
                  />
                  <p className="text-muted-foreground ">
                    Empty! no categories to show.
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

export default CategoryComponent;
