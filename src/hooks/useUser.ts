import { useEffect, useState } from "react";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "student" | "faculty";
};

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return { user };
};
