import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
// Import the new generic MultiSelect component
import { MultiSelect } from "@/components/ui/MultiSelect";
import { TECHNOLOGIES,DOMAINS } from "@/constants/projectConstants"; 

// Define your constant arrays (can be imported from a central file if you prefer)

export default function ProjectFilters({ onFilterChange }: { onFilterChange: (filters: any) => void }) {
  const [search, setSearch] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [domain, setDomain] = useState<string[]>([]);

  const handleApplyFilters = () => {
    onFilterChange({ 
      search, 
      techStack, 
      domain 
    });
  };

  const techSelectProps = {
    options: TECHNOLOGIES,
    placeholder: "Filter by Tech Stack...",
    chipColor: "bg-emerald-50",
    chipTextColor: "text-emerald-700",
  };

  const domainSelectProps = {
    options: DOMAINS,
    placeholder: "Filter by Domain...",
    chipColor: "bg-blue-50",
    chipTextColor: "text-blue-700",
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center p-4 bg-white shadow rounded-2xl">
      <Input 
        placeholder="Search projects..." 
        value={search} 
        onChange={(e) => setSearch(e.target.value)} 
        className="flex-grow md:w-auto"
      />
      
      <div className="w-full md:w-[250px]">
        <MultiSelect 
          value={techStack} 
          onChange={setTechStack} 
          {...techSelectProps} 
        />
      </div>

      <div className="w-full md:w-[250px]">
        <MultiSelect 
          value={domain} 
          onChange={setDomain} 
          {...domainSelectProps}
        />
      </div>

      <Button onClick={handleApplyFilters} className="w-full md:w-auto">
        Apply Filters
      </Button>
    </div>
  );
}