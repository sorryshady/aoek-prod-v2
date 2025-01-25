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

const API_KEY = process.env.EXPO_PUBLIC_TWO_FA_API_KEY;
const TEMPLATE = process.env.EXPO_PUBLIC_TWO_FA_TEMPLATE;

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

export const sendOTP = async (mobileNumber: string) => {
  try {
    const response = await fetch(
      `https://2factor.in/API/V1/${API_KEY}/SMS/${mobileNumber}/AUTOGEN/${TEMPLATE}`,
    );
    const data = await response.json();
    if (data.Status !== "Success") {
      throw new Error(data.Details);
    }
    return {
      sent: true,
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to send OTP",
    };
  }
};

export const resendOTP = async (mobileNumber: string) => {
  try {
    const response = await fetch(
      `https://2factor.in/API/V1/${API_KEY}/SMS/${mobileNumber}/AUTOGEN/${TEMPLATE}`,
    );
    const data = await response.json();
    if (data.Status !== "Success") {
      throw new Error(data.Details);
    }
    return {
      sent: true,
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to resend OTP",
    };
  }
};

export const verifyOTP = async (mobileNumber: string, otp: string) => {
  try {
    const response = await fetch(
      `https://2factor.in/API/V1/${API_KEY}/SMS/VERIFY3/${mobileNumber}/${otp}`,
    );
    const result = await response.json();
    if (result.Status !== "Success") {
      throw new Error(result.Details || "Invalid OTP");
    }

    return {
      verified: true,
    };
  } catch (error) {
    console.log("Error verifying OTP:", error);
    return {
      error: "Failed to verify OTP",
    };
  }
};
