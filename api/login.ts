import { SecurityQuestionType } from "@/constants/types";

interface FormData {
  userId: string;
  password: string;
  securityQuestion: SecurityQuestionType;
  securityAnswer: string;
}

interface Login {
  membershipId: string;
  password: string;
}
export const loginUser = async (formData: Login) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/login/normal-login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      },
    );
    const data = await response.json();
    if (data.error) {
      return {
        error: data.error,
      };
    } else {
      return {
        user: data.userObject,
        session: data.session,
      };
    }
  } catch (error) {
    console.log(error);
  }
};

export const submitIdentifier = async (identifier: string) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/auth/check-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
        }),
      },
    );
    const data = await response.json();
    if (data.error) {
      return {
        error: data.error,
      };
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const submitPassword = async (identifier: string, password: string) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
          password,
        }),
      },
    );
    const data = await response.json();
    if (data.error) {
      return {
        error: data.error,
      };
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const setUpPassword = async (formData: FormData) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/auth/set-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      },
    );
    const data = await response.json();
    if (data.error) {
      return {
        error: data.error,
      };
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const sendOTP = async (phoneNumber: string) => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber }),
    });
    const { sent } = await response.json();
    if (!response.ok || !sent) {
        throw new Error("Failed to send OTP");
    }
    return sent;
  } catch (error) {
    console.log(error);
  }
}

export const resendOTP = async (mobileNumber: string) => {
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobileNumber: mobileNumber,
        }),
      });
      const { sent } = await response.json();
      if (!response.ok || !sent) {
        throw new Error("Failed to resend OTP");
      }
      return sent;
    } catch (error) {
      console.error(error)
    }
}

export const verifyOTP = async (mobileNumber: string, otp: string) => {
 try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobileNumber: mobileNumber,
          otp: otp,
        }),
      });

      const { verified } = await response.json();
      if (!response.ok || !verified) throw new Error("Invalid OTP");
      return verified;
 } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error; // rethrow the error for further handling if needed
 }
}
