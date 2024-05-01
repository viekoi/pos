"use client";
import { useToast } from "@/components/ui/use-toast";
import { useModal } from "@/providers/modal-provider";
import { Staff } from "@/type";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import CustomModal from "@/components/modals/custom-modal";
import { deleteUser, getStoreStaff } from "@/lib/queries";
import StaffDetails from "@/components/forms/staff-detail";
import { useAuthUserWithRole } from "@/providers/auth-user-with-role-provider";
interface CellActionsProps {
  rowData: Staff;
}

const CellActions: React.FC<CellActionsProps> = ({ rowData }) => {
  const { data, setOpen } = useModal();
  const { authUserWithRole } = useAuthUserWithRole();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  if (!rowData) return;
  if (authUserWithRole?.role === "STORE_STAFF") return;

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="flex gap-2"
            onClick={() => navigator.clipboard.writeText(rowData.user.email)}
          >
            <Copy size={15} /> Copy Email
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex gap-2"
            onClick={() => {
              setOpen(
                <CustomModal subheading="" title="Edit User Details">
                  <StaffDetails storeId={rowData.storeId} userData={rowData} />
                  <div className=""></div>
                </CustomModal>,
                async () => {
                  return await getStoreStaff(rowData.userId, rowData.storeId);
                }
              );
            }}
          >
            <Edit size={15} />
            Edit Details
          </DropdownMenuItem>

          {authUserWithRole?.role === "STORE_OWNER" &&
            rowData.role !== "STORE_OWNER" && (
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="flex gap-2" onClick={() => {}}>
                  <Trash size={15} /> Remove User
                </DropdownMenuItem>
              </AlertDialogTrigger>
            )}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            This action cannot be undone. This will permanently delete the user
            and related data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-destructive hover:bg-destructive"
            onClick={async () => {
              setLoading(true);
              try {
                const user = await deleteUser(rowData.id);
                if (user) {
                  toast({
                    title: "Deleted User",
                    description:
                      "The user has been deleted from this agency they no longer have access to the agency",
                  });
                } else {
                  toast({
                    title: "Something went wrong!!!",
                  });
                }
              } catch (error) {
                console.log(error);
                toast({
                  title: "Something went wrong!!!",
                });
              }

              setLoading(false);
              router.refresh();
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CellActions;
