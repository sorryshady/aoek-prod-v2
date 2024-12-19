export const fetchSecurityQuestion = async (userId: string) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/auth/security-question?userId=${userId}`,
    );
    const data = await response.json();
    if (data.error) {
      return {
        error: data.error,
      };
    }
    return {
      user: data.user,
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to fetch security question",
    };
  }
};

export const verifySecurityAnswer = async (userId: string, answer: string) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/auth/forgot-password/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, answer }),
      },
    );
    const data = await response.json();
    if (data.error) {
      return { error: data.error };
    }
    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: "Failed to verify security answer" };
  }
};

export const resetPassword = async (userId: string, password: string) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/auth/forgot-password/reset`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, password }),
      },
    );
    const data = await response.json();
    if (data.error) {
      return { error: data.error };
    }
    return data;
  } catch (error) {
    console.log(error);
    return { error: "Failed to reset password" };
  }
};
