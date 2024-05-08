"use client";

import React, {
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import _ from "lodash";
import { FolderSearch, Trash, X } from "lucide-react";
import { CommandList, Command as CommandPrimitive } from "cmdk";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as z from "zod";

import { ProductWithBrandsAndCategory } from "@/type";
import { OrderItemSchema } from "@/schema";
import Image from "next/image";
import formatPriceVND, { cn } from "@/lib/utils";
import { NumberInput } from "@tremor/react";
import { Button } from "@/components/ui/button";

interface Props {
  options: ProductWithBrandsAndCategory[];
  defaultValues: z.infer<typeof OrderItemSchema>[];
  onChange: (...event: any[]) => void;
}

export function ProductSelect({ options, defaultValues, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] =
    useState<z.infer<typeof OrderItemSchema>[]>(defaultValues);
  const [inputValue, setInputValue] = useState("");
  const handleUnselect = useCallback((id: string) => {
    setSelected((prev) => prev.filter((s) => s.productId !== id));
  }, []);

  const handleSelect = (option: ProductWithBrandsAndCategory) => {
    const newOrderItem: z.infer<typeof OrderItemSchema> = {
      id: null,
      name: option.name,
      productId: option.id,
      isDiscounting: option.isDiscounting,
      basePrice: option.basePrice,
      discountPrice: option.discountPrice,
      note: "",
      quantity: 1,
      sellingPrice: option.isDiscounting
        ? option.discountPrice
        : option.basePrice,
      product: option,
    };

    setSelected((prev) => {
      return [...prev, newOrderItem];
    });
  };

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "") {
          setSelected((prev) => {
            const newSelected = [...prev];
            newSelected.pop();
            return newSelected;
          });
        }
      }
      // This is not a default behaviour of the <input /> field
      if (e.key === "Escape") {
        input.blur();
      }
    }
  }, []);

  const selectables = options.filter(
    (option) => !selected.find((s) => s.productId === option.id)
  );

  const onQuantityChange = (value: number, productId: string) => {
    setSelected((prev) => {
      const updatedItems = [...prev];
      const index = updatedItems.findIndex((s) => s.productId === productId);
      const roundedValue = Math.floor(value);
      if (index !== -1) {
        const updatedItem = {
          ...updatedItems[index],
          quantity: roundedValue === 0 ? 1 : roundedValue,
        };
        console.log(updatedItem);

        updatedItems[index] = updatedItem;
        return updatedItems;
      }
      return updatedItems;
    });
  };

  useEffect(() => {
    onChange(selected);
  }, [selected]);

  return (
    <div className="">
      <Command
        onKeyDown={handleKeyDown}
        className="overflow-visible bg-transparent"
      >
        <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <div className="flex gap-1 flex-wrap">
            <CommandPrimitive.Input
              ref={inputRef}
              value={inputValue}
              onValueChange={setInputValue}
              onBlur={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              placeholder="Select categories..."
              className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
            />
          </div>
        </div>
        <CommandList>
          <div className="relative mt-2">
            {open && selectables.length > 0 ? (
              <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                <CommandGroup className="h-full overflow-auto">
                  {selectables.map((option) => {
                    return (
                      <CommandItem
                        key={option.id}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onSelect={(value) => {
                          setInputValue("");
                          handleSelect(option);
                        }}
                        className={"cursor-pointer"}
                      >
                        <div className="flex gap-x-2">
                          <Image
                            width={40}
                            height={40}
                            alt="product image"
                            src={option.imageUrl || "/images/placeholder.webp"}
                          />
                          <div className="">
                            {option.name}{" "}
                            <div className="flex items-center gap-x-2">
                              <h1
                                className={cn(
                                  "font-bold text-foreground",
                                  option.isDiscounting && "line-through"
                                )}
                              >
                                {formatPriceVND(option.basePrice)}
                              </h1>
                              {option.isDiscounting && (
                                <h1 className=" font-bold text-red-600">
                                  {formatPriceVND(option.discountPrice)}
                                </h1>
                              )}
                            </div>
                          </div>
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </div>
            ) : null}
          </div>
        </CommandList>
      </Command>
      <Card className="h-[50vh] overflow-y-auto overflow-x-hidden">
        {selected.length ? (
          <>
            {selected.map((s, i) => {
              return (
                <Card
                  key={i}
                  className={cn(
                    "border-0 border-b-2 rounded-none overflow-hidden shadow-none",
                    i === selected.length && "border-b-0"
                  )}
                >
                  <CardHeader>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex gap-x-2 flex-1 flex-shrink-0">
                        <Image
                          width={40}
                          height={40}
                          alt="product image"
                          src={
                            s.product?.imageUrl || "/images/placeholder.webp"
                          }
                        />
                        <div className="">
                          {s.name}{" "}
                          <div className="flex items-center gap-x-2">
                            <h1
                              className={cn(
                                "font-bold text-foreground",
                                s.isDiscounting && "line-through"
                              )}
                            >
                              {formatPriceVND(s.basePrice)}
                            </h1>
                            {s.isDiscounting && (
                              <h1 className=" font-bold text-red-600">
                                {formatPriceVND(s.discountPrice)}
                              </h1>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-x-2 items-center justify-center">
                        <NumberInput
                          className="rounded-sm"
                          value={s.quantity}
                          min={1}
                          max={99}
                          step={1}
                          onValueChange={(value: number) =>
                            onQuantityChange(value, s.productId)
                          }
                        />
                        <Button
                          type="button"
                          size={"icon"}
                          variant={"destructive"}
                          onClick={() => handleUnselect(s.productId)}
                        >
                          <Trash />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </>
        ) : (
          <CardContent className="rounded-none">
            <div className=" col-span-full flex items-center justify-center w-full flex-col">
              <FolderSearch
                size={200}
                className="dark:text-muted text-slate-300"
              />
              <p className="text-muted-foreground ">there are no products</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
