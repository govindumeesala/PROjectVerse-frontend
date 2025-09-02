import { useState } from "react";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

type MultiSelectProps = {
  options: string[];
  value: string[];
  onChange: (val: string[]) => void;
  placeholder?: string;
  chipColor?: string;
  chipTextColor?: string;
  borderColor?: string;
};

export const MultiSelect = ({
  options,
  value,
  onChange,
  placeholder = "Type to select...",
  chipColor = "bg-gray-100",
  chipTextColor = "text-gray-800",
  borderColor = "border-gray-300",
}: MultiSelectProps) => {
  const [input, setInput] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const filtered = options.filter(
    (option) =>
      option.toLowerCase().includes(input.toLowerCase()) && !value.includes(option)
  );

  const addOption = (option: string) => {
    if (option.trim() && !value.includes(option.trim())) {
      onChange([...value, option.trim()]);
      setInput("");
      setShowOptions(false);
    }
  };

  const removeOption = (option: string) => {
    onChange(value.filter((o) => o !== option));
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((option) => (
          <span
            key={option}
            className={`${chipColor} ${chipTextColor} px-3 py-1.5 rounded-full flex items-center text-sm font-medium border border-gray-200`}
          >
            {option}
            <button
              type="button"
              className="ml-2 text-red-600 hover:text-red-800 transition-colors"
              onClick={() => removeOption(option)}
            >
              <X className="w-4 h-4" />
            </button>
          </span>
        ))}
      </div>
      <Input
        placeholder={placeholder}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setShowOptions(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addOption(input);
          }
        }}
        onFocus={() => setShowOptions(true)}
        onBlur={() => setTimeout(() => setShowOptions(false), 100)}
        className={`${borderColor} focus:border-blue-500 focus:ring-blue-500 h-11`}
      />
      {showOptions && filtered.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-200 w-full mt-1 rounded-lg shadow-lg max-h-40 overflow-auto">
          {filtered.map((option) => (
            <li
              key={option}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
              onMouseDown={() => addOption(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};