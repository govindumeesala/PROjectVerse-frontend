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
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

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
  socials?: {
    github?: string;
    linkedin?: string;
    instagram?: string;
  };
};

const UpdateUserForm: React.FC<Props> = ({ user, open, onOpenChange }) => {
  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      idNumber: "",
      year: "",
      summary: "",
      profilePhoto: null,
      socials: {
        github: "",
        linkedin: "",
        instagram: "",
      },
    },
  });

  const { handleSubmit, reset, control } = form;
  const [preview, setPreview] = useState<string | null>(null);
  const { updateProfile, isPending } = useUpdateMyProfile();

  useEffect(() => {
    if (open) {
      reset({
        name: user?.name ?? "",
        idNumber: user?.idNumber ?? "",
        year: user?.year ?? "",
        summary: user?.summary ?? "",
        profilePhoto: null,
        socials: {
          github: user?.socials?.github ?? "",
          linkedin: user?.socials?.linkedin ?? "",
          instagram: user?.socials?.instagram ?? "",
        },
      });
      setPreview(user?.profilePhoto ?? null);
    }
  }, [open, user, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      const file = data.profilePhoto?.[0];
      const fd = new FormData();

      if (file) fd.append("profilePhoto", file);

      fd.append("name", data.name ?? user?.name ?? "");
      fd.append("idNumber", data.idNumber ?? user?.idNumber ?? "");
      fd.append("year", data.year ?? user?.year ?? "");
      fd.append("summary", data.summary ?? user?.summary ?? "");
      fd.append("socials", JSON.stringify(data.socials ?? {}));

      await updateProfile(fd);
      onOpenChange(false);
    } catch (err) {
      console.error("Update profile error:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-semibold">Edit Profile</DialogTitle>
          <DialogDescription>
            Update your personal information and social links.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto px-6 pb-6" style={{ maxHeight: "75vh" }}>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Top Section: Photo + Basic Info */}
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Photo */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-32 h-32 rounded-full border-2 border-gray-200 overflow-hidden shadow-sm">
                    {preview ? (
                      <img
                        src={preview}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No photo
                      </div>
                    )}
                  </div>
                  <Controller
                    control={control}
                    name="profilePhoto"
                    render={({ field }) => (
                      <label className="cursor-pointer text-sm font-medium text-blue-700 hover:underline">
                        Change Photo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const files = e.target.files;
                            field.onChange(files);
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

                {/* User Basic Info */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Your full name" />
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
                          <Input {...field} placeholder="Ex: CS12345" />
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
                          <Input {...field} placeholder="Ex: 3rd Year" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Summary */}
              <FormField
                control={control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={3}
                        placeholder="Brief description about you..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Socials */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={control}
                  name="socials.github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <FaGithub className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                          <Input
                            {...field}
                            placeholder="GitHub profile URL"
                            className="pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="socials.linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <FaLinkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                          <Input
                            {...field}
                            placeholder="LinkedIn profile URL"
                            className="pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="socials.instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <FaInstagram className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                          <Input
                            {...field}
                            placeholder="Instagram profile URL"
                            className="pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-blue-700 hover:bg-blue-800 text-white"
                >
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserForm;
