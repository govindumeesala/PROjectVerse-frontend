import { useState } from "react";
import { Command, CommandInput, CommandItem, CommandList } from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Check, ChevronsUpDown } from "lucide-react";

type MultiSelectProps = {
  options: string[];
  selected: string[];
  onChange: (value: string[]) => void;
};

export const MultiSelect = ({ options, selected, onChange }: MultiSelectProps) => {
  const [open, setOpen] = useState(false);

  const toggleItem = (item: string) => {
    const newValue = selected.includes(item)
      ? selected.filter((i) => i !== item)
      : [...selected, item];
    onChange(newValue);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between"
        >
          {selected.length > 0
            ? selected.join(", ")
            : "Select technologies"}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search tech..." />
          <CommandList>
            {options.map((option) => (
              <CommandItem
                key={option}
                value={option}
                onSelect={() => toggleItem(option)}
              >
                <Check
                  className={`mr-2 h-4 w-4 ${selected.includes(option) ? "opacity-100" : "opacity-0"}`}
                />
                {option}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
