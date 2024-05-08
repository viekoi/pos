"use client";

import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { NumberInput } from "@tremor/react";

import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useToast } from "../ui/use-toast";

import * as z from "zod";

import { Input } from "../ui/input";

import { Button } from "../ui/button";
import { Customer } from "@prisma/client";
import Loading from "../loaders/loading";

import { useModal } from "@/providers/modal-provider";

import { deleteCustomer, upsertCustomer } from "@/lib/queries";
import { CustomerDetailSchema } from "@/schema";

type Props = {
  data?: Customer;
};

const CustomerDetail = ({ data }: Props) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const { setClose } = useModal();

  const form = useForm<z.infer<typeof CustomerDetailSchema>>({
    mode: "onChange",
    resolver: zodResolver(CustomerDetailSchema),
    defaultValues: {
      name: data?.name || "",
      email: data?.email || "",
      phone: data?.phone || "",
      address: data?.address || "",
      city: data?.city || "",
      country: data?.country || "Viet Nam",
    },
  });
  const isLoading = form.formState.isSubmitting;

  const handleSubmit = async (values: z.infer<typeof CustomerDetailSchema>) => {
    try {
      const customer = await upsertCustomer(values, data?.id);
      if (customer) {
        toast({
          title: "Customer created",
        });
        router.refresh();
        setClose();
      } else {
        toast({
          variant: "destructive",
          title: "Something went wrong!!!",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "Something went wrong",
      });
    }
  };
  const onDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const res = await deleteCustomer(id);
      console.log(res);
      if (res) {
        toast({
          variant: "default",
          description: "deleted",
        });
        router.refresh();
        setClose();
      } else {
        toast({
          variant: "destructive",
          description: "Something went wrong!!!",
        });
      }
      setIsDeleting(false);
    } catch (error) {
      console.log(error);
      setIsDeleting(false);
      toast({
        variant: "destructive",
        description: "Something went wrong!!!",
      });
    }
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <div className="flex md:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Customer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex md:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                disabled={isLoading}
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 st..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex md:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                disabled={isLoading}
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loading /> : "Save customer information"}
              </Button>
            </form>
          </Form>

          {data?.id && (
            <>
              <div className="flex flex-row items-center justify-between rounded-lg border border-destructive gap-4 p-4 mt-4">
                <div>
                  <div className="text-destructive">Danger Zone</div>
                </div>

                <AlertDialogTrigger
                  disabled={isLoading || isDeleting}
                  className="bg-destructive text-white p-2 text-center mt-2 rounded-md hove:bg-red-600  whitespace-nowrap"
                >
                  {isDeleting ? "Deleting..." : "Delete customer"}
                </AlertDialogTrigger>
              </div>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-left">
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-left">
                    This action cannot be undone
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex items-center">
                  <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={isDeleting}
                    className="bg-destructive hover:bg-destructive"
                    onClick={() => onDelete(data.id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </>
          )}
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default CustomerDetail;
