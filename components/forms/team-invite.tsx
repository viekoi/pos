"use client";
import React from "react";
import { z } from "zod";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";

import { useToast } from "../ui/use-toast";
import Loading from "../loaders/loading";
import { TeamInviteShcema } from "@/schema";
import { saveActivityLogsNotification, sendTeamInvite } from "@/lib/queries";
import { useModal } from "@/providers/modal-provider";

interface TeamInviteProps {
  storeId: string;
}

const TeamInvite: React.FC<TeamInviteProps> = ({ storeId }) => {
  const { toast } = useToast();
  const {setClose} = useModal()

  const form = useForm<z.infer<typeof TeamInviteShcema>>({
    resolver: zodResolver(TeamInviteShcema),
    mode: "onChange",
    defaultValues: {
      email: "",
      role: "STORE_STAFF",
    },
  });

  const onSubmit = async (values: z.infer<typeof TeamInviteShcema>) => {
    try {
      const res = await sendTeamInvite(values, storeId);

      if (res.status) {
        await saveActivityLogsNotification({
          storeId: storeId,
          description: `Invited ${values.email}`,
        });
        toast({
          title: "Success",
          description: `${res.message}`,
        });
        setClose()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: `${res.message}`,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "something went wrong!!!",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invitation</CardTitle>
        <CardDescription>
          An invitation will be sent to the user. Users who already have an
          invitation sent out to their email, will not receive another
          invitation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              disabled={form.formState.isSubmitting}
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
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>User role</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="STORE_ADMIN">Store Admin</SelectItem>
                      <SelectItem value="STORE_STAFF">Store Staff</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting ? <Loading /> : "Send Invitation"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TeamInvite;
