import {
  resendOTP,
  sendOTP,
  setUpPassword,
  submitIdentifier,
  submitPassword,
  verifyOTP,
} from "@/api/login";
import GradientBackground from "@/components/gradient-background";
import { images } from "@/constants";
import { SecurityQuestionType, UserRole } from "@/constants/types";
import { useGlobalContext } from "@/context/global-provider";
import { setToken } from "@/lib/handle-session-tokens";
import { router } from "expo-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react-native";
import {
  View,
  Image,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, ButtonText, ButtonIcon, HStack, Text } from "@/components/ui";
import IdentifierForm from "@/components/auth/identifier-form";
import PasswordForm from "@/components/auth/password-form";
import OTPForm from "@/components/auth/otp-form";
import { ContactAdmin } from "@/components/auth/contact-admin";
import SetupForm from "@/components/auth/setup-form";
import UserProfile from "@/components/auth/user-profile";

export interface UserDetails {
  id: string;
  name: string;
  photoUrl: string | null;
  mobileNumber: string | null;
  userRole: UserRole;
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
  hasPassword: boolean;
}
interface SetupFormData {
  securityQuestion: SecurityQuestionType;
  securityAnswer: string;
  password: string;
  confirmPassword: string;
}
const SignIn = () => {
  const width = Dimensions.get("window").width;
  const isTablet = width > 768;
  const { refetchData } = useGlobalContext();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [step, setStep] = useState<
    "identifier" | "password" | "setup" | "otp" | "contact-admin"
  >("identifier");
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [identifier, setIdentifier] = useState<string>("");

  const handleBack = () => {
    switch (step) {
      case "otp":
        setStep("identifier");
        setError("");
        break;
      case "password":
        setStep("identifier");
        setError("");
        break;
      case "setup":
        setStep("identifier");
        setError("");
        break;
      case "contact-admin":
        setStep("identifier");
        setError("");
        break;
    }
  };

  const handleIdentifierSubmit = async (value: string) => {
    try {
      setIsLoading(true);
      setError("");
      if (value === "") {
        return;
      }
      setIdentifier(value);

      const response = await submitIdentifier(value);
      if (response?.error) {
        setError(response.error);
        return;
      }

      if (response.user.verificationStatus === "REJECTED") {
        setError("Your account has been rejected");
        return;
      } else if (response.user.verificationStatus === "PENDING") {
        setError("Your account is pending verification");
        return;
      }

      setUserDetails(response.user);

      // New flow logic
      if (!response.user.hasPassword) {
        if (response.user.mobileNumber) {
          // Send OTP and show OTP form
          const data = await sendOTP(response.user.mobileNumber);
          if (data?.error) {
            setError(data.error);
            return;
          } else if (data?.sent) {
            setStep("otp");
          }
        } else {
          setStep("contact-admin");
        }
      } else {
        setStep("password");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    const data = await resendOTP(userDetails?.mobileNumber ?? "");
    if (data?.error) {
      setError(data.error);
      return;
    }
  };

  const handleLogin = async (password: string, value: string) => {
    try {
      setIsLoading(true);
      setError("");
      if (password === "") {
        return;
      }
      const response = await submitPassword(value, password);
      if (response?.error) {
        setError(response.error);
        return;
      }
      if (response?.token) {
        await setToken({
          key: "session",
          value: response.token,
        });
        await refetchData();
        router.replace("/home");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetup = async (setupFormData: SetupFormData) => {
    try {
      setIsLoading(true);
      setError("");
      if (
        setupFormData.password === "" ||
        setupFormData.confirmPassword === ""
      ) {
        return;
      }
      if (setupFormData.password !== setupFormData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      const submitForm = {
        userId: userDetails?.id ?? "",
        securityQuestion: setupFormData.securityQuestion,
        securityAnswer: setupFormData.securityAnswer,
        password: setupFormData.password,
      };
      const response = await setUpPassword(submitForm);
      if (response?.error) {
        setError(response.error);
        return;
      }
      if (response?.token) {
        await setToken({
          key: "session",
          value: response.token,
        });
        await refetchData();
        router.replace("/home");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (otp: string) => {
    try {
      setIsLoading(true);
      setError("");
      const response = await verifyOTP(userDetails?.mobileNumber ?? "", otp);
      if (response?.error) {
        setError(response.error);
        return;
      }
      if (response?.verified) {
        setStep("setup");
      } else {
        setError("Invalid OTP");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <GradientBackground>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-1 px-4 items-center justify-center mt-10">
              <View className="w-full max-w-[400px]">
                <View className="bg-white rounded-2xl w-full gap-5 relative my-6">
                  <Image
                    source={images.background}
                    className="w-full h-full absolute opacity-10"
                    resizeMode="cover"
                  />
                  <View className="p-6">
                    <Text className="text-black text-center font-psemibold text-2xl mb-6">
                      Sign In
                    </Text>
                    {step !== "identifier" && step !== "setup" && (
                      <Button
                        variant="link"
                        size="sm"
                        className="justify-start"
                        onPress={handleBack}
                      >
                        <ButtonIcon as={ArrowLeft} />
                        <ButtonText className="text-black font-psemibold">
                          Back
                        </ButtonText>
                      </Button>
                    )}
                    {userDetails && step !== "identifier" && (
                      <UserProfile user={userDetails} />
                    )}

                    {step === "identifier" && (
                      <IdentifierForm
                        onSubmit={handleIdentifierSubmit}
                        isLoading={isLoading}
                        error={error}
                      />
                    )}

                    {step === "password" && (
                      <PasswordForm
                        onSubmit={handleLogin}
                        identifier={identifier}
                        onForgotPassword={() =>
                          router.replace(
                            `/forgot-password?userId=${userDetails?.id}`,
                          )
                        }
                        isLoading={isLoading}
                        error={error}
                        isTablet={isTablet}
                      />
                    )}

                    {step === "otp" && (
                      <OTPForm
                        onSubmit={handleOTPSubmit}
                        onResendOTP={handleResendOTP}
                        mobileNumber={userDetails?.mobileNumber ?? ""}
                        onContactAdmin={() => setStep("contact-admin")}
                        isLoading={isLoading}
                        error={error}
                      />
                    )}

                    {step === "contact-admin" && (
                      <ContactAdmin status="missing" />
                    )}

                    {step === "setup" && (
                      <SetupForm
                        onSubmit={handleSetup}
                        isLoading={isLoading}
                        error={error}
                      />
                    )}

                    {step === "identifier" && (
                      <HStack
                        space="sm"
                        className="justify-center items-center mt-6"
                      >
                        <Text className="font-pmedium">
                          Don't have an account?
                        </Text>
                        <Button
                          variant="link"
                          onPress={() => router.push("/sign-up")}
                        >
                          <ButtonText className="text-blue-500 font-psemibold">
                            Register
                          </ButtonText>
                        </Button>
                      </HStack>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </GradientBackground>
    </SafeAreaView>
  );
};

export default SignIn;
