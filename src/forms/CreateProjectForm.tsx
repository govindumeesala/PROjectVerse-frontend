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
import { useCreateProject } from "@/api/projectApi";
import { useState } from "react";
// import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllUsers } from "@/api/userApi";
import { UploadCloud } from "lucide-react";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  domain: z.string().min(1, "Domain is required"),
  techStack: z.array(z.string()).min(1, "Select at least one tech"),
  status: z.enum(["ongoing", "completed"]),
  lookingForCollaborators: z.boolean().optional(),
  contributors: z.array(z.string()).optional(),
  projectPhoto: z.any().optional(), // file handled separately
  githubURL: z.string().url("Enter a valid GitHub URL").optional(),
  deploymentURL: z.string().url("Enter a valid Deployment URL").optional().or(z.literal("")),
  demoURL: z.string().url("Enter a valid Demo URL").optional().or(z.literal("")),
});

const TECHNOLOGIES = [
  "React",
  "Angular",
  "Vue",
  "Node.js",
  "Express",
  "MongoDB",
  "TypeScript",
  "JavaScript",
  "Python",
  "Django",
  "Flask",
  "Java",
  "Spring Boot",
  "C#",
  "ASP.NET",
  "Ruby on Rails",
  "PHP",
  "Laravel",
  "Go",
  "Rust",
  "C++",
  "Next.js",
  "Tailwind CSS",
  "Bootstrap",
  "Sass",
  "GraphQL",
  "Redux",
  "Firebase",
  "AWS",
  "Docker",
  "Kubernetes"
];

function TechMultiSelect({ value, onChange }: { value: string[]; onChange: (val: string[]) => void }) {
  const [input, setInput] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const filtered = TECHNOLOGIES.filter(
    (tech) => tech.toLowerCase().includes(input.toLowerCase()) && !value.includes(tech)
  );
  const addTech = (tech: string) => { if (tech.trim()) { onChange([...value, tech.trim()]); setInput(""); setShowOptions(false); } };
  const removeTech = (tech: string) => { onChange(value.filter((t) => t !== tech)); };
  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 mb-1">
        {value.map((tech) => (
          <span key={tech} className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center text-sm">
            {tech}
            <button type="button" className="ml-1 text-blue-600 hover:text-red-600" onClick={() => removeTech(tech)}>×</button>
          </span>
        ))}
      </div>
      <Input
        placeholder="Type to add or select tech..."
        value={input}
        onChange={(e) => { setInput(e.target.value); setShowOptions(true); }}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTech(input); } }}
        onFocus={() => setShowOptions(true)}
        onBlur={() => setTimeout(() => setShowOptions(false), 100)}
      />
      {showOptions && filtered.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full mt-1 rounded shadow max-h-40 overflow-auto">
          {filtered.map((tech) => (
            <li key={tech} className="px-3 py-2 hover:bg-blue-100 cursor-pointer" onMouseDown={() => addTech(tech)}>{tech}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export const CreateProjectForm = () => {
  const { createProject, isPending } = useCreateProject();
  const { users = [], isPending: isUsersLoading } = useGetAllUsers(); 

  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      domain: "",
      techStack: [],
      status: "ongoing",
      lookingForCollaborators: false,
      contributors: [],
      projectPhoto: "",
      githubURL: "",
      deploymentURL: "",
      demoURL: "",
    },
  });

  // const status = form.watch("status");
  const contributors = form.watch("contributors") || [];
  const [contributorInput, setContributorInput] = useState("");
  const [showContributorOptions, setShowContributorOptions] = useState(false);

  // be defensive: ensure users is an array
  const usersList = Array.isArray(users) ? users : [];

  const matchingUsers = usersList
    .filter((u: any) =>
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
    form.setValue("contributors", contributors.filter((c) => c !== id));
  };

  const onSubmit = async (data: any) => {
    try {
      // if projectPhoto is a File object (user uploaded), build FormData
      if (data.projectPhoto && typeof data.projectPhoto !== "string") {
        const fd = new FormData();
        fd.append("title", data.title);
        fd.append("description", data.description);
        fd.append("domain", data.domain);
        (data.techStack || []).forEach((t: string) => fd.append("techStack[]", t));
        fd.append("status", data.status);
        fd.append("lookingForCollaborators", data.lookingForCollaborators ? "true" : "false");
        (data.contributors || []).forEach((c: string) => fd.append("contributors[]", c));
        fd.append("projectPhoto", data.projectPhoto);
        if (data.githubURL) fd.append("githubURL", data.githubURL);
        if (data.deploymentURL) fd.append("deploymentURL", data.deploymentURL);
        if (data.demoURL) fd.append("demoURL", data.demoURL);

        await createProject(fd);
      } else {
        // JSON payload (no file)
        await createProject({
          ...data,
        });
      }

      form.reset();
      setContributorInput("");
      // toast.success("Project created successfully!");
    } catch (err) {
      console.error("Create project error:", err);
      // toast.error("Failed to create project");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center text-blue-900 dark:text-white">Create New Project</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Title, Description, Domain */}
          {[ 
            { name: "title", label: "Project Title", placeholder: "Enter your project title" },
            { name: "description", label: "Description", component: Textarea, placeholder: "Describe your project" },
            { name: "domain", label: "Domain", placeholder: "e.g. Web, AI, ML" },
          ].map(({ name, label, placeholder, component: Comp = Input }) => (
            <FormField key={name} control={form.control} name={name as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}<span className="text-red-600 ml-1">*</span></FormLabel>
                  <FormControl><Comp placeholder={placeholder} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          {/* Tech stack */}
          <FormField control={form.control} name="techStack" render={({ field }) => (
            <FormItem>
              <FormLabel>Tech Stack <span className="text-red-600">*</span></FormLabel>
              <FormControl><TechMultiSelect value={field.value} onChange={field.onChange} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Status */}
          <FormField control={form.control} name="status" render={({ field }) => (
            <FormItem>
              <FormLabel><span className="text-red-600">*</span> Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select project status" /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          {/* Looking for collaborators (only show if status !== completed) */}
          {form.watch("status") !== "completed" && (
            <FormField control={form.control} name="lookingForCollaborators" render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <FormLabel>Looking for Collaborators</FormLabel>
              </FormItem>
            )} />
          )}

          {/* Contributors */}
          <FormItem>
            <FormLabel>Select Contributors</FormLabel>
            <div className="flex flex-wrap gap-2 mb-2">
              {(form.watch("contributors") || []).map((id: string) => {
                const user = usersList.find((u: any) => u._id === id);
                return (
                  <span key={id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center text-sm">
                    {user?.name || user?.email}
                    <button type="button" className="ml-1 text-blue-600 hover:text-red-600" onClick={() => removeContributor(id)}>×</button>
                  </span>
                );
              })}
            </div>

            <Input
              placeholder={isUsersLoading ? "Loading users..." : "Search contributors by name or email..."}
              value={contributorInput}
              onChange={(e) => setContributorInput(e.target.value)}
              onFocus={() => setShowContributorOptions(true)}
              onBlur={() => setTimeout(() => setShowContributorOptions(false), 120)}
              disabled={isUsersLoading || usersList.length === 0}
            />

            {showContributorOptions && matchingUsers.length > 0 && (
              <ul className="border rounded bg-white shadow max-h-40 overflow-auto mt-1">
                {matchingUsers.map((user: any) => (
                  <li key={user._id} className="p-2 hover:bg-blue-100 cursor-pointer" onMouseDown={() => addContributor(user._id)}>
                    {user.name} ({user.email})
                  </li>
                ))}
              </ul>
            )}
          </FormItem>

          {/* Project photo */}
          <FormField control={form.control} name="projectPhoto" render={({ field }) => (
            <FormItem>
              <FormLabel>Project Photo</FormLabel>
              <FormControl>
                <label htmlFor="project-photo-upload" className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer p-8 bg-white hover:bg-blue-100 transition-colors text-blue-900">
                  <UploadCloud className="w-10 h-10 mb-2 text-blue-400" />
                  <span className="font-medium">Upload Project Photo</span>
                  <span className="text-xs text-blue-500 mb-2">PNG, JPG, JPEG up to 5MB</span>
                  <input id="project-photo-upload" type="file" accept="image/*" className="hidden" onChange={(e) => field.onChange(e.target.files?.[0])} />
                  {field.value && typeof field.value !== "string" && <span className="mt-2 text-sm text-green-600">{field.value.name}</span>}
                </label>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* URLs */}
          {["githubURL", "deploymentURL", "demoURL"].map(fieldName => (
            <FormField key={fieldName} control={form.control} name={fieldName as any} render={({ field }) => (
              <FormItem>
                <FormLabel>{fieldName.replace(/URL/, " URL")}</FormLabel>
                <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          ))}

          <Button type="submit" disabled={isPending} className="w-full bg-blue-900 text-white">
            {isPending ? "Creating..." : "Create Project"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateProjectForm;
