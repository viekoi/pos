"use client";

import { useCallback, useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import { acceptTeamInvite } from "@/lib/queries";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Loading from "@/components/loaders/loading";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const ConfirmjoinTeam = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  console.log(token);

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("Missing token!");
      return;
    }

    acceptTeamInvite(token)
      .then((data) => {
        if (data.status) {
          setSuccess(data.message);
        } else {
          setError(data.message);
        }
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <Card className="w-full h-full md:h-auto md:w-fit md:min-w-[400px] flex flex-col justify-center border-none bg-black ">
      <CardHeader>
        <CardHeader>Confirming your verification</CardHeader>
      </CardHeader>
      <div className="w-full max-w-[400px] self-center">
        <CardContent>
          {!success && !error && <Loading />}
          {success && (
            <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
              <CheckCircle2 className="h-4 w-4" />
              <p className="font-bold text-xl">{success}</p>
            </div>
          )}

          {error && (
            <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p className="font-bold text-xl">{error}</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="gap-x-2 flex items-center">
          <Button className="w-full" onClick={() => router.push("/")}>
            <ChevronLeft /> Home page
          </Button>
          <Button className="w-full" onClick={() => router.push("/store")}>
            Dashboard
            <ChevronRight />
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};
