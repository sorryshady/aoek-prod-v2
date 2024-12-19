import { RegisterFormData } from '@/constants/types'
import { CustomFormData } from '@/lib/custom-form-data'
import axios from 'axios'



export const registerUser = async (formData: RegisterFormData) => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    // const response = await fetch('https://dummyjson.com/users/1')
    const data = await response.json();
    if (data.error) {
      return data;
    }
    return data;
  } catch (error: any) {
    console.error(
      "Error registering user:",
      error.response?.data || error.message
    );
    return { error: error.response?.data?.message || "Failed to register user" };
  }
};
export const uploadProfilePhoto = async (imageUri: string, name: string) => {
    try {
      const formData = new CustomFormData();
      formData.append("profile-photo", {
        uri: imageUri,
        type: "image/webp",
        name: `${name}.webp`,
      } as any);

      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/mobile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (response.status !== 200) {
        throw new Error("Failed to upload profile photo");
      }

      return response.data;
    } catch (error) {
      console.error("Error updating profile photo:", error);
      throw error;
    }
  };
