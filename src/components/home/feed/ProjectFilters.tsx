
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ProjectFilters({ onFilterChange }: { onFilterChange: (filters: any) => void }) {
  const [search, setSearch] = useState("");
  const [techStack, setTechStack] = useState("");
  const [domain, setDomain] = useState("");

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center p-4 bg-white shadow rounded-2xl">
      <Input placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} />
      
      <Select onValueChange={(val) => setTechStack(val)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Tech Stack" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="React">React</SelectItem>
          <SelectItem value="Node.js">Node.js</SelectItem>
          <SelectItem value="Python">Python</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(val) => setDomain(val)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Domain" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="AI">AI</SelectItem>
          <SelectItem value="Web Dev">Web Dev</SelectItem>
          <SelectItem value="IoT">IoT</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={() => onFilterChange({ search, techStack, domain })}>
        Apply
      </Button>
    </div>
  );
}
