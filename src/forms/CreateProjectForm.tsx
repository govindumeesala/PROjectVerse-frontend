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
import { useCreateProject } from "../api/projectApi";
import { useState } from "react";
import { toast } from "sonner";

import { getUserIdFromToken } from "@/lib/utils"; // utility to extract user ID from toke
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllUsers } from "@/api/userApi"; // you'll create this next
import { useAuthStore } from "@/store/useAuthStore";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  domain: z.string().min(1, "Domain is required"),
  techStack: z.array(z.string()).min(1, "Select at least one tech"),
  status: z.enum(["ongoing", "completed"]),
  lookingForCollaborators: z.boolean(),
  contributors: z.array(z.string()).optional(),
  projectPhoto: z.string().url("Enter a valid image URL").optional().or(z.literal("")),
  githubURL: z.string().url("Enter a valid GitHub URL").optional(),
  deploymentURL: z.string().url("Enter a valid Deployment URL").optional().or(z.literal("")),
  demoURL: z.string().url("Enter a valid Demo URL").optional().or(z.literal("")),
});

// Example tech stack options, you can customize this list as needed
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

  const addTech = (tech: string) => {
    if (tech.trim()) {
      onChange([...value, tech.trim()]);
      setInput("");
      setShowOptions(false);
    }
  };

  const removeTech = (tech: string) => {
    onChange(value.filter((t) => t !== tech));
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 mb-1">
        {value.map((tech) => (
          <span key={tech} className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center text-sm">
            {tech}
            <button type="button" className="ml-1 text-blue-600 hover:text-red-600" onClick={() => removeTech(tech)}>
              ×
            </button>
          </span>
        ))}
      </div>
      <Input
        placeholder="Type to add or select tech..."
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setShowOptions(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTech(input);
          }
        }}
        onFocus={() => setShowOptions(true)}
        onBlur={() => setTimeout(() => setShowOptions(false), 100)}
      />
      {showOptions && filtered.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full mt-1 rounded shadow max-h-40 overflow-auto">
          {filtered.map((tech) => (
            <li key={tech} className="px-3 py-2 hover:bg-blue-100 cursor-pointer" onMouseDown={() => addTech(tech)}>
              {tech}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export const CreateProjectForm = () => {
  const { createProject, isPending } = useCreateProject();
  const { data: users = [] } = useGetAllUsers();
  const token = useAuthStore((state) => state.token);

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

  const lookingForCollaborators = form.watch("lookingForCollaborators");

  const onSubmit = async (data: any) => {
    if (!token) {
      toast.error("You must be logged in to create a project.");
      return;
    }
    await createProject({ ...data, owner: getUserIdFromToken(token) });
    form.reset();
    toast.success("Project created successfully!");
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center text-blue-900 dark:text-white">
        Create New Project
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {[
            { name: "title", label: "Project Title", placeholder: "Enter your project title" },
            { name: "description", label: "Description", component: Textarea, placeholder: "Describe your project" },
            { name: "domain", label: "Domain", placeholder: "e.g. Web, AI, ML" },
          ].map(({ name, label, placeholder, component: Comp = Input }) => (
            <FormField
              key={name}
              control={form.control}
              name={name as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label} *</FormLabel>
                  <FormControl>
                    <Comp placeholder={placeholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <FormField
            control={form.control}
            name="techStack"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tech Stack *</FormLabel>
                <FormControl>
                  <TechMultiSelect value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lookingForCollaborators"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>Looking for Collaborators</FormLabel>
              </FormItem>
            )}
          />

          {!lookingForCollaborators && (
            <FormField
              control={form.control}
              name="contributors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Contributors</FormLabel>
                  <FormControl>
                    <select
                      multiple
                      className="w-full border rounded p-2 dark:bg-gray-800"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(Array.from(e.target.selectedOptions, (option) => option.value))
                      }
                    >
                      {users.map((user: any) => (
                        <option key={user._id} value={user._id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Links */}
          {["projectPhoto", "githubURL", "deploymentURL", "demoURL"].map((fieldName) => (
            <FormField
              key={fieldName}
              control={form.control}
              name={fieldName as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{fieldName.replace(/URL/, " URL")}</FormLabel>
                  <FormControl>
                    <Input placeholder={`https://...`} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button type="submit" disabled={isPending} className="w-full bg-blue-900 text-white">
            {isPending ? "Creating..." : "Create Project"}
          </Button>
        </form>
      </Form>
    </div>
  );
};


