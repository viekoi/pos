"use client";

import CustomerDetail from "@/components/forms/customer-detail";
import CustomModal from "@/components/modals/custom-modal";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { useModal } from "@/providers/modal-provider";
import { OrderCustomerSchema } from "@/schema";
import { Customer } from "@prisma/client";
import { Check, ChevronsUpDown, Edit, PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import * as z from "zod";

interface Props {
  options: Customer[];
  defaultValues: z.infer<typeof OrderCustomerSchema> | null;
  onChange: (...event: any[]) => void;
}
const CustomerSelect = ({ options, defaultValues, onChange }: Props) => {
  const { setOpen: modalOpen } = useModal();
  const [open, setOpen] = useState(false);
  const name = options.find((o) => o.id === defaultValues?.customerId)?.name;

  const onSelect = (option: Customer) => {
    if (option.id === defaultValues?.customerId) {
      onChange(null);
      setOpen(false);
    } else {
      const orderCustomer: z.infer<typeof OrderCustomerSchema> = {
        address: option.address,
        city: option.city,
        country: option.country,
        customerId: option.id,
        name: option.name,
        email: option.email,
        phone: option.phone,
      };

      onChange(orderCustomer);
      setOpen(false);
    }
  };

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {name ? name : "select a customer"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search framework..." />
            <CommandEmpty>No Customer found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {options.map((o) => (
                  <CommandItem
                    className="flex items-center justify-between"
                    key={o.name}
                    value={o.id}
                    onSelect={() => onSelect(o)}
                  >
                    <div className="flex gap-x-1 items-center">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          defaultValues?.customerId === o.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {o.name}
                    </div>
                    <Edit
                      className="mr-2 h-4 w-4 cursor-pointer hover:text-green-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        modalOpen(
                          <CustomModal title="Create a customter" subheading="">
                            <CustomerDetail data={o} />
                          </CustomModal>
                        );
                      }}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <Button
              type="button"
              onClick={() => {
                modalOpen(
                  <CustomModal title="Create a customter" subheading="">
                    <CustomerDetail />
                  </CustomModal>
                );
              }}
            >
              <PlusCircleIcon size={15} />
              Create Customer
            </Button>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CustomerSelect;
