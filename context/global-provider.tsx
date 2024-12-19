import { getLatestUserRequest, getCompleteUser } from "@/api/user";
import { RequestResponse, CompleteUser } from "@/constants/types";
import { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getToken, removeToken } from "@/lib/handle-session-tokens";
import { router } from "expo-router";

interface GlobalContextType {
  isLoggedIn: boolean;
  user: CompleteUser | null;
  isLoading: boolean;
  error: string | null;
  latestRequest: RequestResponse | null;
  refetchData: () => Promise<void>;
  logout: () => Promise<void>;
}

const GlobalContext = createContext<GlobalContextType>({
  isLoggedIn: false,
  user: null,
  isLoading: true,
  error: null,
  latestRequest: null,
  refetchData: async () => {},
  logout: async () => {},
});

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  // Basic user query with error handling
  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isUserError,
    error: userError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const token = await getToken({ key: "session" });
      if (!token) {
        throw new Error("User is not logged in");
      }
      const response = await getCompleteUser();

      // Handle API error responses
      if ("error" in response) {
        throw new Error(response.error);
      }

      // Handle null or undefined response
      if (!response) {
        throw new Error("Failed to fetch user data");
      }

      return response;
    },
    retry: 1,
    staleTime: Infinity,
  });

  // Latest request query - depends on basic user
  const { data: latestRequest, isLoading: isLoadingRequest } = useQuery({
    queryKey: ["latestRequest", user?.membershipId],
    queryFn: async () => {
      const token = await getToken({ key: "session" });
      if (!token) {
        throw new Error("User is not logged in");
      }
      const response = await getLatestUserRequest(user?.membershipId!);

      if ("error" in response) {
        throw new Error(response.error);
      }

      return response;
    },
    enabled: !!user?.membershipId && !isUserError,
    staleTime: Infinity,
  });

  const isLoggedIn = !!user && !isUserError;
  const isLoading = isLoadingUser || isLoadingRequest;

  // Get error message from userError
  const error = userError instanceof Error ? userError.message : null;

  const refetchData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["user"] }),
      queryClient.invalidateQueries({ queryKey: ["latestRequest"] }),
    ]);
  };

  const logout = async () => {
    queryClient.clear();
    await removeToken({ key: "session" });
    router.replace("/sign-in");
  };

  const contextValue = {
    isLoggedIn,
    user: user ?? null,
    isLoading,
    error,
    latestRequest: latestRequest ?? null,
    refetchData,
    logout,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
