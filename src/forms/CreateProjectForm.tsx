// src/forms/CreateProjectForm.tsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProject, useCheckProjectTitle } from "@/api/projectApi";
import { useUpdateProject } from "@/hooks/useProject";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { debounce } from "lodash";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllUsers } from "@/api/userApi";
import {
  UploadCloud,
  Globe,
  Code,
  Users,
  Image,
  Link,
  GitBranch,
} from "lucide-react";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { TECHNOLOGIES, DOMAINS } from "@/constants/projectConstants";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  domain: z.array(z.string()).min(1, "Select at least one domain"),
  techStack: z.array(z.string()).min(1, "Select at least one tech"),
  status: z.enum(["ongoing", "completed"]),
  lookingForContributors: z.boolean().optional(),
  contributors: z.array(z.string()).optional(),
  projectPhoto: z.any().optional(), // file handled separately
  githubURL: z.string().url("Enter a valid GitHub URL").optional(),
  deploymentURL: z
    .string()
    .url("Enter a valid Deployment URL")
    .optional()
    .or(z.literal("")),
  demoURL: z
    .string()
    .url("Enter a valid Demo URL")
    .optional()
    .or(z.literal("")),
});

type FormValues = {
  title: string;
  description: string;
  domain: string[];
  techStack: string[];
  status: "ongoing" | "completed";
  lookingForContributors?: boolean;
  contributors?: string[];
  projectPhoto?: any;
  githubURL?: string;
  deploymentURL?: string;
  demoURL?: string;
};

export const CreateProjectForm = ({
  mode = "create",
  initialValues,
  username,
  slug,
  onSuccess,
}: {
  mode?: "create" | "edit";
  initialValues?: Partial<FormValues>;
  username?: string;
  slug?: string;
  onSuccess?: () => void;
}) => {
  const { createProject, isPending: isCreating } = useCreateProject();
  const { mutateAsync: updateProject, isPending: isUpdating } =
    useUpdateProject(username || "", slug || "");
  const { users = [], isPending: isUsersLoading } = useGetAllUsers();

  const form = useForm<FormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initialValues?.title ?? "",
      description: initialValues?.description ?? "",
      domain: initialValues?.domain ?? [],
      techStack: initialValues?.techStack ?? [],
      status: (initialValues?.status as any) ?? "ongoing",
      lookingForContributors: initialValues?.lookingForContributors ?? false,
      contributors: initialValues?.contributors ?? [],
      projectPhoto: initialValues?.projectPhoto ?? "",
      githubURL: initialValues?.githubURL ?? "",
      deploymentURL: initialValues?.deploymentURL ?? "",
      demoURL: initialValues?.demoURL ?? "",
    },
  });

  // Inside CreateProjectForm component
  const { mutateAsync: checkTitle } = useCheckProjectTitle();

  const [isCheckingTitle, setIsCheckingTitle] = useState(false);
  const [isTitleAvailable, setIsTitleAvailable] = useState(false);
  const [wasTitleChecked, setWasTitleChecked] = useState(false);

  // Debounced check function
  const checkTitleAvailability = debounce(async (title: string) => {
    if (title.length >= 3) {
      // minimum length to check
      setIsCheckingTitle(true);
      try {
        const result = await checkTitle(title);
        setIsTitleAvailable(result.data.available);
        setWasTitleChecked(true);
        if (!result.data.available) {
          form.setError("title", {
            type: "manual",
            message: "This project title is already taken",
          });
        }
      } catch (err) {
        console.error("Error checking project title:", err);
      } finally {
        setIsCheckingTitle(false);
      }
    } else {
      setWasTitleChecked(false);
    }
  }, 500);

  const techSelectProps = {
    options: TECHNOLOGIES,
    placeholder: "Type to add or select technologies...",
    chipColor: "bg-emerald-50",
    chipTextColor: "text-emerald-700",
    borderColor: "border-gray-300 focus:border-emerald-500",
  };

  const domainSelectProps = {
    options: DOMAINS,
    placeholder: "Type to add or select domains...",
    chipColor: "bg-blue-50",
    chipTextColor: "text-blue-700",
    borderColor: "border-gray-300 focus:border-blue-500",
  };

  // const status = form.watch("status");
  const contributors = form.watch("contributors") || [];
  const [contributorInput, setContributorInput] = useState("");
  const [showContributorOptions, setShowContributorOptions] = useState(false);

  // be defensive: ensure users is an array
  const usersList = Array.isArray(users) ? users : [];

  const matchingUsers = usersList
    .filter(
      (u: any) =>
        (u.name?.toLowerCase().includes(contributorInput.toLowerCase()) ||
          u.email?.toLowerCase().includes(contributorInput.toLowerCase())) &&
        !contributors.includes(u._id)
    )
    .slice(0, 5);

  const addContributor = (id: string) => {
    form.setValue("contributors", [...contributors, id]);
    setContributorInput("");
  };

  const removeContributor = (id: string) => {
    form.setValue(
      "contributors",
      contributors.filter((c) => c !== id)
    );
  };

  const onSubmit = async (data: FormValues) => {
    try {
      if (mode === "edit") {
        // Update selected fields; omit title by default (backend may not allow change)
        const updates: any = {
          description: data.description,
          domain: data.domain,
          techStack: data.techStack,
          status: data.status,
          lookingForContributors: !!data.lookingForContributors,
          githubURL: data.githubURL,
          deploymentURL: data.deploymentURL,
          additionalURL: data.demoURL,
        };
        await updateProject(updates);
        onSuccess?.();
      } else {
        // if projectPhoto is a File object (user uploaded), build FormData
        if (data.projectPhoto && typeof data.projectPhoto !== "string") {
          const fd = new FormData();
          fd.append("title", data.title);
          fd.append("description", data.description);
          // Normalize arrays defensively
          const normDomain = Array.isArray(data.domain)
            ? data.domain
            : data.domain
            ? [data.domain as unknown as string]
            : [];
          const normTech = Array.isArray(data.techStack)
            ? data.techStack
            : data.techStack
            ? [data.techStack as unknown as string]
            : [];
          const normContrib = Array.isArray(data.contributors)
            ? data.contributors
            : data.contributors
            ? [data.contributors as unknown as string]
            : [];
          // Append arrays by repeating the same key with [] to force array on backend parsers
          normDomain.forEach((d: string) => fd.append("domain[]", d));
          normTech.forEach((t: string) => fd.append("techStack[]", t));
          fd.append("status", data.status);
          fd.append(
            "lookingForContributors",
            data.lookingForContributors ? "true" : "false"
          );
          normContrib.forEach((c: string) => fd.append("contributors[]", c));
          fd.append("projectPhoto", data.projectPhoto);
          if (data.githubURL) fd.append("githubURL", data.githubURL);
          if (data.deploymentURL)
            fd.append("deploymentURL", data.deploymentURL);
          // Backend expects additionalURL
          if (data.demoURL) fd.append("additionalURL", data.demoURL);

          await createProject(fd);
        } else {
          if (!isTitleAvailable) {
            form.setError("title", {
              type: "manual",
              message: "Please choose an available project title",
            });
            return;
          }
          // Submit as FormData even without a file, to match API typing
          const fd = new FormData();
          fd.append("title", data.title);
          fd.append("description", data.description);
          const normDomain = Array.isArray(data.domain)
            ? data.domain
            : data.domain
            ? [data.domain as unknown as string]
            : [];
          const normTech = Array.isArray(data.techStack)
            ? data.techStack
            : data.techStack
            ? [data.techStack as unknown as string]
            : [];
          const normContrib = Array.isArray(data.contributors)
            ? data.contributors
            : data.contributors
            ? [data.contributors as unknown as string]
            : [];
          normDomain.forEach((d: string) => fd.append("domain[]", d));
          normTech.forEach((t: string) => fd.append("techStack[]", t));
          fd.append("status", data.status);
          fd.append(
            "lookingForContributors",
            data.lookingForContributors ? "true" : "false"
          );
          normContrib.forEach((c: string) => fd.append("contributors[]", c));
          if (data.githubURL) fd.append("githubURL", data.githubURL);
          if (data.deploymentURL)
            fd.append("deploymentURL", data.deploymentURL);
          if (data.demoURL) fd.append("additionalURL", data.demoURL);

          await createProject(fd);
        }
        form.reset();
        setContributorInput("");
      }
    } catch (err) {
      console.error("Create project error:", err);
      // toast.error("Failed to create project");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {mode === "edit" ? "Edit project" : "Create a new project"}
          </h1>
          <p className="text-gray-600 text-lg">
            Projects showcase your work and help you find collaborators. Have a
            project elsewhere?
            <span className="text-blue-600 hover:text-blue-800 cursor-pointer ml-1">
              Import it here
            </span>
            .
          </p>
          <p className="text-sm text-gray-500 italic mt-2">
            Required fields are marked with an asterisk (*)
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Section 1: General Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold text-sm">1</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">General</h2>
              </div>

              <div className="space-y-6">
                {/* Project Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Project title<span className="text-red-500">*</span>
                        {wasTitleChecked && isTitleAvailable && (
                          <span className="ml-2 text-sm text-green-600">
                            Available!
                          </span>
                        )}
                      </FormLabel>

                      <FormControl>
                        <Input
                          placeholder="Enter your project title"
                          {...field}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-11"
                          onChange={(e) => {
                            field.onChange(e);
                            if (mode !== "edit") {
                              form.clearErrors("title");
                              setWasTitleChecked(false);
                              checkTitleAvailability(e.target.value);
                            }
                          }}
                        />
                      </FormControl>
                      <p className="text-sm text-gray-500 mt-1">
                        Great project names are short and memorable. How about{" "}
                        <span className="text-emerald-600 font-medium">
                          awesome-project-verse
                        </span>
                        ?
                      </p>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Description <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your project, its goals, and what makes it unique..."
                          {...field}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[100px] resize-none"
                        />
                      </FormControl>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-gray-500">
                          Descriptions help others understand your project
                          better.
                        </p>
                        <span className="text-sm text-gray-400">
                          {field.value?.length || 0}/500 characters
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section 2: Domain & Tech Stack */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-emerald-600 font-semibold text-sm">
                    2
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Domain & Technology
                </h2>
              </div>

              <div className="space-y-6">
                {/* Domain */}
                <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                        <Globe className="w-4 h-4 mr-2 text-blue-500" />
                        Domain <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <MultiSelect
                          value={field.value}
                          onChange={field.onChange}
                          {...domainSelectProps}
                        />
                      </FormControl>
                      <p className="text-sm text-gray-500 mt-1">
                        Select the primary domain(s) your project belongs to.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tech Stack */}
                <FormField
                  control={form.control}
                  name="techStack"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                        <Code className="w-4 h-4 mr-2 text-emerald-500" />
                        Technology Stack <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <MultiSelect
                          value={field.value}
                          onChange={field.onChange}
                          {...techSelectProps}
                        />
                      </FormControl>
                      <p className="text-sm text-gray-500 mt-1">
                        Choose the technologies, frameworks, and tools used in
                        your project.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section 3: Status & Collaboration */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-purple-600 font-semibold text-sm">
                    3
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Status & Collaboration
                </h2>
              </div>

              <div className="space-y-6">
                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Project Status <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 h-11">
                            <SelectValue placeholder="Select project status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ongoing">
                            🔄 Ongoing - Still in development
                          </SelectItem>
                          <SelectItem value="completed">
                            ✅ Completed - Ready for use
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500 mt-1">
                        Let others know the current state of your project.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Looking for collaborators */}
                {form.watch("status") !== "completed" && (
                  <FormField
                    control={form.control}
                    name="lookingForContributors"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="text-sm font-medium text-gray-700 cursor-pointer">
                            Looking for contributors
                          </FormLabel>
                          <p className="text-sm text-gray-500">
                            Check this if you're open to working with other
                            developers on this project.
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                )}

                {/* Contributors */}
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                    <Users className="w-4 h-4 mr-2 text-purple-500" />
                    Current Contributors
                  </FormLabel>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(form.watch("contributors") || []).map((id: string) => {
                      const user = usersList.find((u: any) => u._id === id);
                      return (
                        <span
                          key={id}
                          className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full flex items-center text-sm font-medium border border-purple-200"
                        >
                          {user?.name || user?.email}
                          <button
                            type="button"
                            className="ml-2 text-purple-600 hover:text-red-600 transition-colors"
                            onClick={() => removeContributor(id)}
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>

                  <Input
                    placeholder={
                      isUsersLoading
                        ? "Loading users..."
                        : "Search contributors by name or email..."
                    }
                    value={contributorInput}
                    onChange={(e) => setContributorInput(e.target.value)}
                    onFocus={() => setShowContributorOptions(true)}
                    onBlur={() =>
                      setTimeout(() => setShowContributorOptions(false), 120)
                    }
                    disabled={isUsersLoading || usersList.length === 0}
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 h-11"
                  />

                  {showContributorOptions && matchingUsers.length > 0 && (
                    <ul className="border border-gray-200 rounded-lg bg-white shadow-lg max-h-40 overflow-auto mt-2">
                      {matchingUsers.map((user: any) => (
                        <li
                          key={user._id}
                          className="p-3 hover:bg-purple-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                          onMouseDown={() => addContributor(user._id)}
                        >
                          <div className="font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Add team members who are already working on this project.
                  </p>
                </FormItem>
              </div>
            </div>

            {/* Section 4: Media & Links */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-orange-600 font-semibold text-sm">
                    4
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Media & Links
                </h2>
              </div>

              <div className="space-y-6">
                {/* Project Photo */}
                <FormField
                  control={form.control}
                  name="projectPhoto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                        <Image className="w-4 h-4 mr-2 text-orange-500" />
                        Project Photo
                      </FormLabel>
                      <FormControl>
                        <label
                          htmlFor="project-photo-upload"
                          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer p-8 bg-gray-50 hover:bg-orange-50 transition-colors group relative"
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.add(
                              "border-orange-400",
                              "bg-orange-50"
                            );
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove(
                              "border-orange-400",
                              "bg-orange-50"
                            );
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove(
                              "border-orange-400",
                              "bg-orange-50"
                            );
                            if (
                              e.dataTransfer.files &&
                              e.dataTransfer.files[0]
                            ) {
                              field.onChange(e.dataTransfer.files[0]);
                            }
                          }}
                        >
                          <UploadCloud className="w-12 h-12 mb-3 text-orange-400 group-hover:text-orange-500 transition-colors" />
                          <span className="font-medium text-gray-700 mb-1">
                            Upload Project Photo
                          </span>
                          <span className="text-sm text-gray-500 mb-2">
                            PNG, JPG, JPEG up to 5MB
                          </span>
                          <span className="text-xs text-orange-600">
                            Click to browse or drag and drop
                          </span>
                          <input
                            id="project-photo-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              field.onChange(e.target.files?.[0])
                            }
                          />

                          {/* ✅ Preview */}
                          {field.value && (
                            <div className="mt-4">
                              <img
                                src={
                                  typeof field.value === "string"
                                    ? field.value // existing URL (e.g. editing mode)
                                    : URL.createObjectURL(field.value) // new file
                                }
                                alt="Preview"
                                className="max-h-40 rounded-lg border border-gray-200 shadow-sm"
                              />
                            </div>
                          )}
                        </label>
                      </FormControl>
                      <p className="text-sm text-gray-500 mt-1">
                        A great project photo helps attract attention and
                        collaborators.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* URLs */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="githubURL"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                          <GitBranch className="w-4 h-4 mr-2 text-gray-600" />
                          GitHub Repository
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://github.com/username/repository"
                            {...field}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-11"
                          />
                        </FormControl>
                        <p className="text-sm text-gray-500 mt-1">
                          Link to your source code repository.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deploymentURL"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                          <Globe className="w-4 h-4 mr-2 text-gray-600" />
                          Live Demo URL
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://your-project.vercel.app"
                            {...field}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-11"
                          />
                        </FormControl>
                        <p className="text-sm text-gray-500 mt-1">
                          Where people can see your project in action.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="demoURL"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                          <Link className="w-4 h-4 mr-2 text-gray-600" />
                          Additional Demo URL
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://demo.example.com"
                            {...field}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-11"
                          />
                        </FormControl>
                        <p className="text-sm text-gray-500 mt-1">
                          Any other demo, documentation, or related links.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={mode === "edit" ? isUpdating : isCreating}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 h-12 text-base font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                {mode === "edit"
                  ? isUpdating
                    ? "Updating project..."
                    : "Update project"
                  : isCreating
                  ? "Creating project..."
                  : "Create project"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateProjectForm;
