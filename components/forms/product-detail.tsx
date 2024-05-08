"use client";
import React, { useState } from "react";
import { z } from "zod";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { Input } from "../ui/input";

import { Button } from "../ui/button";
import { ProductSchema } from "@/schema";

import { ImageUpload } from "../uploaders/image-upload";
import { useModal } from "@/providers/modal-provider";
import { Textarea } from "../ui/textarea";

import { ProductWithBrandsAndCategory } from "@/type";

import { Brand, Category } from "@prisma/client";
import { Switch } from "../ui/switch";
import { MultiSelect } from "../inputs/multi-select";
import {
  deleteProduct,
  saveActivityLogsNotification,
  upsertProduct,
} from "@/lib/queries";
import { NumberInput } from "@tremor/react";

interface Props {
  data?: ProductWithBrandsAndCategory;
  brands: Brand[];
  categories: Category[];
}

const ProductDetail: React.FC<Props> = ({ data, brands, categories }) => {
  const { toast } = useToast();
  const { setClose } = useModal();
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const defaultVales = data
    ? data
    : {
        name: "",
        description: "",
        isDiscounting: false,
        imageUrl: null,
        basePrice: 0,
        discountPrice: 0,
        categories: [],
        brands: [],
      };

  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    mode: "onSubmit",
    defaultValues: defaultVales,
  });

  async function onSubmit(values: z.infer<typeof ProductSchema>) {
    try {
      const response = await upsertProduct(values, data?.id);
      if (response) {
        await saveActivityLogsNotification({
          link: "",
          description: `${data?.id ? "update" : "add"} | ${response.name}`,
        });
        toast({
          title: "Succes",
          description: `${data?.id ? "Product updated" : "Product added"}`,
        });
        router.refresh();
        setClose();
      } else {
        toast({ title: "Failed", description: "Something went wrong!!!" });
      }
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Something went wrong!!!",
      });
    }
  }

  const isLoading = form.formState.isSubmitting;

  console.log(form.watch());

  const onDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const res = await deleteProduct(id);
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
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-y-4"
            >
              <FormField
                disabled={isLoading}
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product image</FormLabel>
                    <FormControl>
                      <ImageUpload
                        endpoint="imageUploader"
                        value={field.value}
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
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={isLoading}
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={isLoading}
                control={form.control}
                name="basePrice"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Base price</FormLabel>
                    <FormControl>
                      <NumberInput
                        className="rounded-sm"
                        min={0}
                        {...field}
                        enableStepper={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col  rounded-lg border p-4 gap-y-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="isDiscounting"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex justify-between items-center w-full">
                        <div>
                          <FormLabel>Add discount price</FormLabel>
                          <FormDescription>
                            set a discount price
                          </FormDescription>
                        </div>

                        <FormControl>
                          <Switch
                            checked={form.getValues("isDiscounting")}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />

                {form.getValues("isDiscounting") && (
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="discountPrice"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Discount price</FormLabel>
                        <FormControl>
                          <NumberInput
                            className="rounded-sm"
                            min={0}
                            {...field}
                            enableStepper={false}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              <FormField
                disabled={isLoading}
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Categories</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={categories}
                        defaultValues={form.getValues("categories")}
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
                name="brands"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Brands</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={brands}
                        defaultValues={form.getValues("brands")}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                      {isDeleting ? "Deleting..." : "Delete product"}
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
                      <AlertDialogCancel className="mb-2">
                        Cancel
                      </AlertDialogCancel>
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

              <Button type="submit" className="mt-4" disabled={isLoading}>
                save
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default ProductDetail;
