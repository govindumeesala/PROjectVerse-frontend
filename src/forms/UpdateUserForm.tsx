// src/forms/UpdateUserForm.tsx
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useUpdateMyProfile } from "@/api/userApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Props = {
  user: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type FormValues = {
  name: string;
  idNumber?: string;
  year?: string;
  summary?: string;
  profilePhoto?: FileList | null;
};

const UpdateUserForm: React.FC<Props> = ({ user, open, onOpenChange }) => {
  // single form object required by shadcn Form wrapper
  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      idNumber: "",
      year: "",
      summary: "",
      profilePhoto: null,
    },
  });

  const { handleSubmit, reset, control } = form;
  const [preview, setPreview] = useState<string | null>(null);
  const { updateProfile, isPending } = useUpdateMyProfile();

  // populate the form when dialog opens or user changes
  useEffect(() => {
    if (open) {
      reset({
        name: user?.name ?? "",
        idNumber: user?.idNumber ?? "",
        year: user?.year ?? "",
        summary: user?.summary ?? "",
        profilePhoto: null,
      });
      setPreview(user?.profilePhoto ?? null);
    }
  }, [open, user, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      // if user selected a new file -> send multipart/form-data
      const file = data.profilePhoto?.[0];
      const fd = new FormData();

      if (file) {
        // include current values from form (they reflect user edits)
        fd.append("profilePhoto", file);
      } 

      fd.append("name", data.name ?? user?.name ?? "");
        fd.append("idNumber", data.idNumber ?? user?.idNumber ?? "");
        fd.append("year", data.year ?? user?.year ?? "");
        fd.append("summary", data.summary ?? user?.summary ?? "");
        await updateProfile(fd);

      onOpenChange(false);
    } catch (err) {
      console.error("Update profile error:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your account details here</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-400">No photo</div>
                )}
              </div>

              <Controller
                control={control}
                name="profilePhoto"
                render={({ field }) => (
                  <label className="cursor-pointer px-3 py-2 bg-white border rounded text-sm hover:bg-gray-50 flex items-center gap-3">
                    <span>Change Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const files = e.target.files;
                        field.onChange(files); // store FileList
                        if (files && files[0]) {
                          setPreview(URL.createObjectURL(files[0]));
                        } else {
                          setPreview(user?.profilePhoto ?? null);
                        }
                      }}
                    />
                  </label>
                )}
              />
            </div>

            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="bg-blue-800 cursor-pointer hover:bg-blue-900 text-white">
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserForm;
