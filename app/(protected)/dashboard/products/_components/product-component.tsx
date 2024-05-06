import React from "react";

import { FolderSearch } from "lucide-react";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { ProductWithBrandsAndCategory } from "@/type";
import ProductAddButton from "./product-add-button";
import { Brand, Category } from "@prisma/client";
import ProductCard from "./product-card";

type Props = {
  data: ProductWithBrandsAndCategory[];
  brands: Brand[];
  categories: Category[];
};

const ProductComponent = ({ data, brands, categories }: Props) => {
  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl">Products</h1>
        <ProductAddButton brands={brands} categories={categories} />
      </div>
      <Command className="bg-transparent">
        <CommandInput placeholder="Search for product name..." />
        <CommandList className="pb-40 max-h-full ">
          <CommandGroup heading="Products">
            <div className="grid  md:grid-cols-2 xl:grid-cols-6  grid-cols-2  gap-2">
              {data.map((product) => (
                <CommandItem
                  key={product.id}
                  className="p-0 col-span-1 rounded-lg !bg-transparent !font-medium !text-white"
                >
                  <ProductCard
                    categories={categories}
                    brands={brands}
                    product={product}
                  />
                </CommandItem>
              ))}
              {!data.length && (
                <div className="col-span-full flex items-center justify-center w-full flex-col">
                  <FolderSearch
                    size={200}
                    className="dark:text-muted text-slate-300"
                  />
                  <p className="text-muted-foreground ">
                    Empty! no product to show.
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

export default ProductComponent;
