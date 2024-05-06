"use client";
import { Store } from "@prisma/client";
import React, { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, PlusCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CustomModal from "@/components/modals/custom-modal";
import { useModal } from "@/providers/modal-provider";
import StoreDetails from "@/components/forms/store-details";
import Link from "next/link";

interface Props {
  stores: Store[];
}

const StoreSelect: React.FC<Props> = ({ stores }) => {
  const [store, setStore] = useState<Store | null>(null);
  const [open, setOpen] = useState(false);
  const { setOpen: setModalOpen } = useModal();

  return (
    <div className=" relative h-full w-full">
      <div className="absolute -top-10 -left-10 right-0 bottom-0 z-30 flex items-center justify-center backdrop-blur-md bg-background/50">
        <Card className="w-full max-w-[400px]">
          <CardHeader>
            <CardTitle>Select a store</CardTitle>
            <CardDescription>something something</CardDescription>
          </CardHeader>
          <CardContent>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {store
                    ? stores.find((s) => s.id === store.id)?.name
                    : "Select store..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80  mt-4 z-[200] p-0">
                <Command>
                  <CommandInput placeholder="Search store..." />
                  <CommandEmpty>No store found.</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {stores.map((s) => (
                        <CommandItem
                          key={s.id}
                          value={s.name}
                          onSelect={(currentValue) => {
                            setStore(s);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              s.name === store?.name
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {s.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                  <Button
                    className="w-full flex gap-2"
                    onClick={() => {
                      setModalOpen(
                        <CustomModal
                          title="Create A store"
                          subheading="You can switch between your store"
                        >
                          <div className=""></div>
                          <StoreDetails />
                        </CustomModal>
                      );
                    }}
                  >
                    <PlusCircleIcon size={15} />
                    Create store
                  </Button>
                </Command>
              </PopoverContent>
            </Popover>
          </CardContent>
          <CardFooter>
            {store && <Link className="w-full" href={`/store/${store.id}`}>
              <Button className="w-full">continue</Button>
            </Link>}
            
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default StoreSelect;
