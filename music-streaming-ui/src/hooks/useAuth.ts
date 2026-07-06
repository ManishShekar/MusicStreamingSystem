import { useAppSelector } from "@/redux/hooks";

export const useAuth = () => {
  const auth = useAppSelector((state) => state.auth);
  const isAdmin = auth.role === "Admin";
  return { ...auth, isAdmin };
};
