import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCheckUsername } from "@/api/authApi";
import { debounce } from "lodash";
import { UsernameInput } from "@/components/signup/UsernameInput";

const completeSignupSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers and underscore and hyphen"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
});

type CompleteSignupFormProps = {
  initialData: {
    name: string;
    email: string;
    idToken?: string | undefined;
  };
  onSubmit: (data: z.infer<typeof completeSignupSchema>) => void;
  isLoading?: boolean;
};

export const CompleteGoogleSignup = ({ initialData, onSubmit, isLoading }: CompleteSignupFormProps) => {
  const { mutateAsync: checkUsername } = useCheckUsername();
  
  const form = useForm<z.infer<typeof completeSignupSchema>>({
    resolver: zodResolver(completeSignupSchema),
    defaultValues: {
      username: "",
      name: initialData.name,
      email: initialData.email,
    },
  });

  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  const [wasUsernameChecked, setWasUsernameChecked] = useState(false);

  // Debounced username check
  const checkUsernameAvailability = debounce(async (username: string) => {
    if (username.length >= 3) {
      setIsCheckingUsername(true);
      try {
        const result = await checkUsername(username);
        setIsUsernameAvailable(result.available);
        setWasUsernameChecked(true);
        if (!result.available) {
          form.setError("username", {
            type: "manual",
            message: "Username is already taken",
          });
        }
      } catch (error) {
        console.error("Error checking username:", error);
      } finally {
        setIsCheckingUsername(false);
      }
    } else {
      setWasUsernameChecked(false);
    }
  }, 500);

  const handleSubmit = async (data: z.infer<typeof completeSignupSchema>) => {
    if (!isUsernameAvailable) {
      form.setError("username", {
        type: "manual",
        message: "Please choose an available username"
      });
      return;
    }

    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error completing signup:", error);
      // Let the parent component handle the error
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Choose a Username
                {wasUsernameChecked && isUsernameAvailable && (
                  <span className="ml-2 text-sm text-green-600">Available!</span>
                )}
              </FormLabel>
              <FormControl>
                <UsernameInput
                  field={field}
                  isChecking={isCheckingUsername}
                  isAvailable={isUsernameAvailable}
                  wasChecked={wasUsernameChecked}
                  onChangeWithCheck={(e) => {
                    field.onChange(e);
                    form.clearErrors("username");
                    setWasUsernameChecked(false);
                    checkUsernameAvailability(e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-blue-900 hover:bg-blue-800"
          disabled={isLoading}
        >
          {isLoading ? "Completing Signup..." : "Complete Signup"}
        </Button>
      </form>
    </Form>
  );
};