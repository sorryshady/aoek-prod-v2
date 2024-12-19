import { RegisterFormData } from "@/constants/types";
import { getToken } from "@/lib/handle-session-tokens";

export const completeAccount = async (formData: RegisterFormData) => {
  try {
    const token = await getToken({ key: "session" });
    if(!token) {
        return null
    }
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/user/complete-profile`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.error) {
        return data;
      }
      return data;
    } catch (error: any) {
      console.error(
        "Error updating user:",
        error.response?.data || error.message
      );
      return { error: error.response?.data?.message || "Failed to update user" };
    }
  };
