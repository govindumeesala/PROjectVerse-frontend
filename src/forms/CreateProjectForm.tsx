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

// Technologies for autocomplete
const TECHNOLOGIES = [
  "React",
  "Node.js",
  "MongoDB",
  "Express",
  "Tailwind",
  "TypeScript",
  "Next.js",
  "Python",
  "Django",
  "Flask",
  "Angular",
  "Vue.js",
];

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  domain: z.string().min(1, "Domain is required"),
  techStack: z.array(z.string()).min(1, "Select at least one tech"),
  projectPhoto: z.string().url("Enter a valid image URL").optional().or(z.literal("")),
  githubURL: z.string().url("Enter a valid GitHub URL").optional(),
  deploymentURL: z.string().url("Enter a valid Deployment URL").optional().or(z.literal("")),
  demoURL: z.string().url("Enter a valid Demo URL").optional().or(z.literal("")),
});

function getUserIdFromToken(): string | undefined {
  const token = localStorage.getItem("token");
  if (!token) return undefined;
  try {
    // JWT: header.payload.signature
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log("Decoded payload:", payload);
    return payload.userId;
  } catch {
    return undefined;
  }
}

// Simple MultiSelect Autocomplete
function TechMultiSelect({
  value,
  onChange,
}: {
  value: string[];
  onChange: (val: string[]) => void;
}) {
  const [input, setInput] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const filtered = TECHNOLOGIES.filter(
    (tech) =>
      tech.toLowerCase().includes(input.toLowerCase()) &&
      !value.includes(tech)
  );

  const addTech = (tech: string) => {
    onChange([...value, tech]);
    setInput("");
    setShowOptions(false);
  };

  const removeTech = (tech: string) => {
    onChange(value.filter((t) => t !== tech));
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 mb-1">
        {value.map((tech) => (
          <span
            key={tech}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center text-sm"
          >
            {tech}
            <button
              type="button"
              className="ml-1 text-blue-600 hover:text-red-600"
              onClick={() => removeTech(tech)}
              aria-label={`Remove ${tech}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <Input
        placeholder="Type to search tech..."
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setShowOptions(true);
        }}
        onFocus={() => setShowOptions(true)}
        onBlur={() => setTimeout(() => setShowOptions(false), 100)}
      />
      {showOptions && filtered.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full mt-1 rounded shadow max-h-40 overflow-auto">
          {filtered.map((tech) => (
            <li
              key={tech}
              className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
              onMouseDown={() => addTech(tech)}
            >
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

  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      domain: "",
      techStack: [],
      projectPhoto: "",
      githubURL: "",
      deploymentURL: "",
      demoURL: "",
    },
  });

  const onSubmit = async (data: any) => {
    await createProject({ ...data, owner: getUserIdFromToken() });
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
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your project title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Briefly describe your project" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="domain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Domain</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Web Development, AI" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="techStack"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tech Stack</FormLabel>
                <FormControl>
                  <TechMultiSelect value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="projectPhoto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://image.com/project.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="githubURL"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/user/project" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deploymentURL"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Live Deployment URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://project.live" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="demoURL"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Demo Video URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://youtube.com/demo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white"
          >
            {isPending ? "Creating..." : "Create Project"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateProjectForm;
