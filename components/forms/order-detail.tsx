"use client";

import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useToast } from "../ui/use-toast";

import * as z from "zod";

import { Button } from "../ui/button";

import Loading from "../loaders/loading";

import { OrderDetailSchema } from "@/schema";
import { OrderWithOrderItems, ProductWithBrandsAndCategory } from "@/type";
import { ProductSelect } from "@/app/(protected)/dashboard/checkout/_components/product-select";
import { Customer } from "@prisma/client";
import CustomerSelect from "@/app/(protected)/dashboard/checkout/_components/customer-select";
import formatPriceVND from "@/lib/utils";
import { useModal } from "@/providers/modal-provider";
import CustomModal from "../modals/custom-modal";

type Props = {
  data?: OrderWithOrderItems;
  products: ProductWithBrandsAndCategory[];
  customers: Customer[];
};

const OrderDetail = ({ data, products, customers }: Props) => {
  const { toast } = useToast();
  const { setOpen } = useModal();
  const router = useRouter();
  const [subTotalPrice, setSubTotalPrice] = useState<number>(
    data?.subTotalPrice || 0
  );
  const [totalAmount, setTotalAmount] = useState<number>(
    data?.totalAmount || 0
  );
  const [finalPrice, setFinalPrice] = useState<number>(data?.finalPrice || 0);
  const [orderItems, setOrderItems] = useState(data?.orderItems || []);

  const form = useForm<z.infer<typeof OrderDetailSchema>>({
    mode: "onChange",
    resolver: zodResolver(OrderDetailSchema),
    defaultValues: {
      discountPercent: data?.discountPercent || 0,
      finalPrice,
      subTotalPrice,
      totalAmount,
      note: data?.note || "",
      orderItems,
      shippingPrice: data?.shippingPrice || 0,
    },
  });
  const isLoading = form.formState.isSubmitting;
  const customer = form.getValues("customer");
  const handleSubmit = async (values: z.infer<typeof OrderDetailSchema>) => {
    try {
      //   await upsertorder(values, data?.id).then((res) => {
      //     if (res && !data?.id) {
      //       toast({
      //         title: "order created",
      //       });
      //       router.push(`/dashboard`);
      //     } else if (res && data?.id) {
      //       toast({
      //         title: "order updated",
      //       });
      //     } else {
      //       toast({
      //         variant: "destructive",
      //         title: "Something went wrong!!!",
      //       });
      //     }
      //   });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "Something went wrong",
      });
    }
  };

  useEffect(() => {
    const totalAmount = orderItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    const subTotalPrice = orderItems.reduce(
      (total, item) => total + item.sellingPrice * item.quantity,
      0
    );
    setTotalAmount(totalAmount);
    setSubTotalPrice(subTotalPrice);
  }, [orderItems]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Order Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 overflow-hidden"
          >
            <div className="flex w-full gap-x-2">
              <Card className="flex-[2_0_0]">
                <CardContent>
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="customer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Items</FormLabel>
                        <FormControl>
                          <CustomerSelect
                            options={customers}
                            defaultValues={field.value || null}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="orderItems"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Items</FormLabel>
                        <FormControl>
                          <ProductSelect
                            onChange={setOrderItems}
                            options={products}
                            defaultValues={orderItems}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <div className="flex-[1_0_0]">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment</CardTitle>
                    <CardDescription>
                      Invoice to: {customer ? customer.name : ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <th className="text-left">Total Amount:</th>
                          <td className="text-right">{totalAmount}</td>
                        </tr>
                        <tr>
                          <th className="text-left">Subtotal Price:</th>
                          <td className="text-right">
                            {formatPriceVND(subTotalPrice)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="button"
                      disabled={isLoading}
                      className="w-full"
                      onClick={() => {
                        setOpen(
                          <CustomModal
                            title="Not supported yet"
                            subheading="inconvenience"
                          >
                            Comming soon
                          </CustomModal>
                        );
                      }}
                    >
                      {isLoading ? <Loading /> : "Check out"}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default OrderDetail;
