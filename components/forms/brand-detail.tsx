"use client";
import React, { useState } from "react";
import { z } from "zod";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "../ui/card";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { Input } from "../ui/input";

import { Button } from "../ui/button";
import { BrandSchema } from "@/schema";

import { ImageUpload } from "../uploaders/image-upload";
import {
  deleteBrand,
  saveActivityLogsNotification,
  upsertBrand,
} from "@/lib/queries";
import { useModal } from "@/providers/modal-provider";
import { Textarea } from "../ui/textarea";
import { Brand } from "@prisma/client";

interface Props {
  data?: Brand;
}

const BrandDetail: React.FC<Props> = ({ data }) => {
  const { toast } = useToast();
  const { setClose } = useModal();
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof BrandSchema>>({
    resolver: zodResolver(BrandSchema),
    mode: "onSubmit",
    defaultValues: {
      imageUrl: data ? data.imageUrl : null,
      name: data?.name || "",
      description: data?.description || "",
    },
  });

  async function onSubmit(values: z.infer<typeof BrandSchema>) {
    try {
      const response = await upsertBrand(values, data?.id);
      if (response) {
        await saveActivityLogsNotification({
          link: "",
          description: `${data?.id ? "update" : "add"} | ${response.name}`,
        });
        toast({
          title: "Succes",
          description: `${data?.id ? "Updated brand" : "Added brand"}`,
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
  const onDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const res = await deleteBrand(id);
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

  const isLoading = form.formState.isSubmitting;

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                disabled={isLoading}
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand image</FormLabel>
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
                      {isDeleting ? "Deleting..." : "Delete brand"}
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

export default BrandDetail;
