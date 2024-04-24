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
import { Switch } from "../ui/switch";

import { Button } from "../ui/button";
import { Store } from "@prisma/client";
import { ImageUpload } from "../uploaders/image-upload";
import Loading from "../loaders/loading";
import {
  insertStore,
  saveActivityLogsNotification,
  updateStore,
} from "@/lib/queries";
import { StoreDetailsSchema } from "@/schema";
import { useModal } from "@/providers/modal-provider";

type Props = {
  data?: Partial<Store>;
};

const StoreDetails = ({ data }: Props) => {
  const { toast } = useToast();
  const { setClose } = useModal();
  const router = useRouter();
  const [deletingAgency, setDeletingAgency] = useState(false);

  const form = useForm<z.infer<typeof StoreDetailsSchema>>({
    mode: "onChange",
    resolver: zodResolver(StoreDetailsSchema),
    defaultValues: {
      id: data?.id,
      name: data?.name,
      storeEmail: data?.storeEmail,
      storePhone: data?.storePhone,
      whiteLabel: data?.whiteLabel || false,
      address: data?.address,
      city: data?.city,
      zipCode: data?.zipCode,
      state: data?.state,
      country: data?.country,
      storeLogo: data?.storeLogo,
      goal: data?.goal || 0,
    },
  });
  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data]);

  const handleSubmit = async (values: z.infer<typeof StoreDetailsSchema>) => {
    try {
      if (data?.id) {
        const response = await updateStore(values);
        if (response) {
          toast({
            title: "Store created",
          });
          setClose();
          router.refresh();
        }
      } else {
        const response = await insertStore(values);
        if (response) {
          toast({
            title: "Store created",
          });
          setClose();
          router.refresh();
        }
      }
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "could not create your agency",
      });
    }
  };
  const handleDeleteAgency = async () => {
    // if (!data?.id) return;
    // setDeletingAgency(true);
    // //WIP: discontinue the subscription
    // try {
    //   const response = await deleteAgency(data.id);
    //   toast({
    //     title: "Deleted Agency",
    //     description: "Deleted your agency and all subaccounts",
    //   });
    //   router.refresh();
    // } catch (error) {
    //   console.log(error);
    //   toast({
    //     variant: "destructive",
    //     title: "Oppse!",
    //     description: "could not delete your agency ",
    //   });
    // }
    // setDeletingAgency(false);
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
          <CardDescription>
            Lets create an store for you business. You can edit store settings
            later from the store settings tab.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                disabled={isLoading}
                control={form.control}
                name="storeLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Logo</FormLabel>
                    <FormControl>
                      <ImageUpload
                        endpoint="imageUploader"
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex md:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Store Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your store name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="storeEmail"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Store Email</FormLabel>
                      <FormControl>
                        <Input
                          readOnly={!!data?.id}
                          placeholder="Email"
                          {...field}
                        />
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
                  name="storePhone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Store Phone Number</FormLabel>
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
                name="whiteLabel"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border gap-4 p-4">
                      <div>
                        <FormLabel>Whitelabel Store</FormLabel>
                        <FormDescription>
                          Turning on whilelabel mode will show your store logo
                          to all user accounts by default. You can overwrite
                          this functionality through user account settings.
                        </FormDescription>
                      </div>

                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
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
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Zipcpde</FormLabel>
                      <FormControl>
                        <Input placeholder="Zipcode" {...field} />
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
            {/* "  {data?.id && (
                <div className="flex flex-col gap-2">
                  <FormLabel>Create A Goal</FormLabel>
                  <FormDescription>
                    ✨ Create a goal for your store. As your business grows your
                    goals grow too so dont forget to set the bar higher!
                  </FormDescription>
                  <NumberInput
                    defaultValue={data?.goal}
                    onValueChange={async (val) => {
                      if (!data?.id) return;
                      await updateStoreDetails(data.id, { goal: val });
                      await saveActivityLogsNotification({
                        storeId: data.id,
                        description: `Updated the store goal to | ${val} Sub Account`,
                      });
                      router.refresh();
                    }}
                    min={1}
                    className="bg-background !border !border-input"
                    placeholder="Sub Account Goal"
                  />
                </div>
              )}" */}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loading /> : "Save store Information"}
              </Button>
            </form>
          </Form>

          {data?.id && (
            <div className="flex flex-row items-center justify-between rounded-lg border border-destructive gap-4 p-4 mt-4">
              <div>
                <div>Danger Zone</div>
              </div>
              <div className="text-muted-foreground">
                Deleting your store cannot be undone. This will also delete all
                data related.
              </div>
              <AlertDialogTrigger
                disabled={isLoading || deletingAgency}
                className="text-red-600 p-2 text-center mt-2 rounded-md hove:bg-red-600 hover:text-white whitespace-nowrap"
              >
                {deletingAgency ? "Deleting..." : "Delete Store"}
              </AlertDialogTrigger>
            </div>
          )}
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
                disabled={deletingAgency}
                className="bg-destructive hover:bg-destructive"
                onClick={handleDeleteAgency}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default StoreDetails;
