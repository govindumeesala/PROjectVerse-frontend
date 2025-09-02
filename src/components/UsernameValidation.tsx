type ValidationRule = {
  id: string;
  message: string;
  validator: (value: string) => boolean;
};

const usernameRules: ValidationRule[] = [
  {
    id: "length",
    message: "Username must be between 3-30 characters",
    validator: (value) => value.length >= 3 && value.length <= 30,
  },
  {
    id: "characters",
    message: "Username can only contain letters, numbers, and underscores",
    validator: (value) => /^[a-zA-Z0-9_]*$/.test(value),
  },
  {
    id: "start",
    message: "Username must start with a letter",
    validator: (value) => /^[a-zA-Z].*$/.test(value),
  },
];

export const validateUsername = (value: string): string[] => {
  if (!value) return [];
  return usernameRules
    .filter((rule) => !rule.validator(value))
    .map((rule) => rule.message);
};