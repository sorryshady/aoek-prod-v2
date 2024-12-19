import { Request } from "@/constants/types";
import { CustomFormData } from "@/lib/custom-form-data";
import { getToken } from "@/lib/handle-session-tokens";
import axios from "axios";

export const getCurrentUser = async () => {
  try {
    const token = await getToken({ key: "session" });
    if (!token) {
      return null;
    }
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status !== 200) {
      return null;
    }
    const data = await response.json();
    if (data?.error) {
      return { error: data.error };
    } else {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getCompleteUser = async () => {
  try {
    const token = await getToken({ key: "session" });
    if (!token) {
      return null;
    }
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/mobile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (data?.error) {
      return { error: data.error };
    } else {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    const token = await getToken({ key: "session" });
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/user/password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      },
    );
    const responseData = await response.json();
    if (responseData?.error) {
      return { error: responseData.error };
    } else {
      return responseData;
    }
  } catch (error) {
    console.log(error);
  }
};

export const submitRequest = async (data: Request) => {
  try {
    const token = await getToken({ key: "session" });
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/user/request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      },
    );
    const responseData = await response.json();
    if (responseData?.error) {
      return { error: responseData.error };
    } else {
      return responseData;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getLatestUserRequest = async (membershipId: number) => {
  try {
    const token = await getToken({ key: "session" });
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/user/request?membershipId=${membershipId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch latest request");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getLatestUserRequest:", error);
    throw error;
  }
};

export const hideUserRequest = async (requestId: string) => {
  try {
    const token = await getToken({ key: "session" });
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/user/request?requestId=${requestId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const responseData = await response.json();
    if (responseData?.error) {
      console.log(responseData.error);
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateProfilePhoto = async (imageUri: string, name: string) => {
  try {
    // Create form data
    const formData = new CustomFormData();
    formData.append("photo", {
      uri: imageUri,
      type: "image/webp",
      name: `${name}.webp`,
    } as any);

    const token = await getToken({ key: "session" });
    const response = await axios.patch(
      `${process.env.EXPO_PUBLIC_API_URL}/mobile`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (response.status !== 200) {
      throw new Error("Failed to update profile photo");
    }

    return response.data; // This should return the new photo URL and ID
  } catch (error) {
    console.error("Error updating profile photo:", error);
    throw error;
  }
};
