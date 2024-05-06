import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import _ from "lodash";
import { Option } from "@/components/inputs/multi-select";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPriceVND = (price: number) => {
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0, // Remove decimal places
  }).format(price);

  return formattedPrice;
};

export default formatPriceVND;

export const compareArraysOfObjects = (oldArray: Option[], newArray: Option[]) => {
  const addedEntries = _.differenceWith(newArray, oldArray, _.isEqual);
  const removedEntries = _.differenceWith(oldArray, newArray, _.isEqual);

  return { addedEntries, removedEntries };
};
