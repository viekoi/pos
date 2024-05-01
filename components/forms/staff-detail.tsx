"use client";

import { useModal } from "@/providers/modal-provider";

import React, { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useParams, useRouter } from "next/navigation";

import { z } from "zod";
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
} from "@/components/ui/form";

import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { ImageUpload } from "../uploaders/image-upload";
import { StaffSchema } from "@/schema";
import { Staff } from "@/type";
import Loading from "../loaders/loading";
import { updateStaff } from "@/lib/queries";

type Props = {
  storeId: string;
  userData?: Partial<Staff>;
};

const StaffDetails = ({ storeId, userData }: Props) => {
  const { data, setClose } = useModal();

  //Get authUSerDtails

  const form = useForm<z.infer<typeof StaffSchema>>({
    resolver: zodResolver(StaffSchema),
    mode: "onChange",
    defaultValues: {
      id: userData ? userData.id : data.staff?.id,
      name: userData ? userData.name : data.staff?.name,
      email: userData ? userData.user?.email : data?.staff?.user.email,
      image: userData ? userData.image : data?.staff?.image,
      role: userData ? userData.role : data?.staff?.role,
      phone: userData ? userData.phone || "" : data.staff?.phone || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof StaffSchema>) => {
    try {
      const res = await updateStaff(values, storeId);

      if (res.status) {
      }
    } catch (error) {}
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>User Details</CardTitle>
        <CardDescription>Add or update your information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile picture</FormLabel>
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
              disabled={
                userData?.role === "STORE_OWNER" || form.formState.isSubmitting
              }
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" readOnly {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>User full name</FormLabel>
                  <FormControl>
                    <Input required placeholder="Full Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel> User Role</FormLabel>
                  <Select
                    disabled={field.value === "STORE_OWNER"}
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="STORE_ADMIN">Store Admin</SelectItem>
                      {(data?.staff?.role === "STORE_OWNER" ||
                        userData?.role === "STORE_OWNER") && (
                        <SelectItem value="STORE_OWNER">Store Owner</SelectItem>
                      )}
                      <SelectItem value="STORE_STAFF">Store Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <Button disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting ? <Loading /> : "Save User Details"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default StaffDetails;
