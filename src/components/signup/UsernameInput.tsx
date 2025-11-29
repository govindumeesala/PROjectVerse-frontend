import { Input } from "@/components/ui/input";
import { Check, Loader2, X, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { validateUsername } from "./UsernameValidation";
import { FormMessage } from "@/components/ui/form";

type UsernameInputProps = {
  field: any;
  isChecking: boolean;
  isAvailable: boolean;
  wasChecked: boolean;
  onChangeWithCheck: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const UsernameInput = ({
  field,
  isChecking,
  isAvailable,
  wasChecked,
  onChangeWithCheck,
}: UsernameInputProps) => {
  const errors = validateUsername(field.value);
  const showValidation = field.value.length > 0 && errors.length > 0;

  return (
    <div className="space-y-1">
      <div className="relative">
        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
        <Input
          {...field}
          placeholder="Choose a unique username"
          onChange={onChangeWithCheck}
          className={cn(
            "pl-10 pr-10 h-11 bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all",
            wasChecked &&
              !showValidation &&
              (isAvailable ? "border-green-500 focus:border-green-500" : "border-red-500 focus:border-red-500")
          )}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isChecking ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
          ) : wasChecked && !showValidation ? (
            isAvailable ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-red-500" />
            )
          ) : null}
        </div>
      </div>

      {/* Show validation messages only when there are errors */}
      {showValidation &&
        errors.map((error, index) => (
          <FormMessage key={index} className="text-xs">{error}</FormMessage>
        ))}
    </div>
  );
};