"use client";
import React from "react";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { Input } from "../ui/input";

import { Button } from "../ui/button";
import { MediaSchema } from "@/schema";
import { Media } from "@prisma/client";
import { ImageUpload } from "../uploaders/image-upload";
import { saveActivityLogsNotification, upsertMedia } from "@/lib/queries";
import { useModal } from "@/providers/modal-provider";

const UploadMediaForm = () => {
  const { toast } = useToast();
  const { setClose } = useModal();
  const router = useRouter();
  const form = useForm<z.infer<typeof MediaSchema>>({
    resolver: zodResolver(MediaSchema),
    mode: "onSubmit",
    defaultValues: {
      imageUrl: "",
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof MediaSchema>) {
    try {
      const response = await upsertMedia(values);
      if (response) {
        await saveActivityLogsNotification({
          link: "",
          description: `Uploaded a media file | ${response.name}`,
        });
      }
      toast({ title: "Succes", description: "Uploaded media" });
      router.refresh();
      setClose();
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Could not uploaded media",
      });
    }
  }

  const isLoading = form.formState.isSubmitting;


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Media Information</CardTitle>
        <CardDescription>
          Please enter the details for your file
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              disabled={isLoading}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media File</FormLabel>
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
                  <FormLabel>File Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Mame" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-4" disabled={isLoading}>
              Upload Media
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UploadMediaForm;
