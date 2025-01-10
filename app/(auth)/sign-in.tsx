import { resendOTP, sendOTP, setUpPassword, submitIdentifier, submitPassword, verifyOTP } from "@/api/login";
import GradientBackground from "@/components/gradient-background";
import { images } from "@/constants";
import { SecurityQuestionType, UserRole } from "@/constants/types";
import { useGlobalContext } from "@/context/global-provider";
import { setToken } from "@/lib/handle-session-tokens";
import { changeTypeToText } from "@/lib/utils";
import { router } from "expo-router";
import { useState } from "react";
import ErrorAlert from "@/components/error-alert";
import { ArrowLeft } from "lucide-react-native";
import {
  View,
  Image,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  ButtonText,
  ButtonIcon,
  ButtonSpinner,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  Select,
  SelectTrigger,
  SelectInput,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
  VStack,
  HStack,
  Text,
} from "@/components/ui";
import PasswordEntry from "@/components/password-entry";
import IdentifierForm from '@/components/auth/identifier-form'
import PasswordForm from '@/components/auth/password-form'
import OTPForm from '@/components/auth/otp-form'
import ContactAdmin from '@/components/auth/contact-admin'
import SetupForm from '@/components/auth/setup-form'

interface UserDetails {
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
  const { refetchData } = useGlobalContext();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [step, setStep] = useState<
    "identifier" | "password" | "setup" | "otp" | "contact-admin"
  >("identifier");
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [identifier, setIdentifier] = useState<string>("");

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
        if (response.user.phoneNumber) {
          // Send OTP and show OTP form
          await sendOTP(response.user.phoneNumber);
          setStep("otp");
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
        // await refetchData();
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
      if (response) {
        setStep("setup");
      } else {
        setError("Invalid OTP");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  // ... other handlers ...

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
                  onForgotPassword={() => router.replace(`/forgot-password?userId=${userDetails?.id}`)}
                  isLoading={isLoading}
                  error={error}
                />
              )}

              {step === "otp" && (
                <OTPForm
                  onSubmit={handleOTPSubmit}
                  onResendOTP={() => resendOTP(userDetails?.mobileNumber ?? "")}
                  onContactAdmin={() => setStep("contact-admin")}
                  isLoading={isLoading}
                  error={error}
                />
              )}

              {step === "contact-admin" && (
                <ContactAdmin
                  onBack={() => setStep("identifier")}
                />
              )}

              {step === "setup" && (
                <SetupForm
                  onSubmit={handleSetup}
                  isLoading={isLoading}
                  error={error}
                />
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

//   const handleNext = async () => {
//     try {
//       setIsLoading(true);
//       setError("");
//       if (value === "") {
//         return;
//       }
//       const response = await submitIdentifier(value);
//       if (response?.error) {
//         setError(response.error);
//         return;
//       }
//       if (response.user.verificationStatus === "REJECTED") {
//         setError("Your account has been rejected");
//         return;
//       } else if (response.user.verificationStatus === "PENDING") {
//         setError("Your account is pending verification");
//         return;
//       }
//       setUserDetails(response.user);
//       setStep(response.user.hasPassword ? "password" : "setup");
//     } catch (error) {
//       setError(error instanceof Error ? error.message : "Something went wrong");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleLogin = async () => {
//     try {
//       setIsLoading(true);
//       setError("");
//       if (password === "") {
//         return;
//       }
//       const response = await submitPassword(value, password);
//       if (response?.error) {
//         setError(response.error);
//         return;
//       }
//       if (response?.token) {
//         await setToken({
//           key: "session",
//           value: response.token,
//         });
//         await refetchData();
//         router.replace("/home");
//       }
//     } catch (error) {
//       setError(error instanceof Error ? error.message : "Something went wrong");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSetup = async () => {
//     try {
//       setIsLoading(true);
//       setError("");
//       if (
//         setupFormData.password === "" ||
//         setupFormData.confirmPassword === ""
//       ) {
//         return;
//       }
//       if (setupFormData.password !== setupFormData.confirmPassword) {
//         setError("Passwords do not match");
//         return;
//       }
//       const submitForm = {
//         userId: userDetails?.id ?? "",
//         securityQuestion: setupFormData.securityQuestion,
//         securityAnswer: setupFormData.securityAnswer,
//         password: setupFormData.password,
//       };
//       const response = await setUpPassword(submitForm);
//       if (response?.error) {
//         setError(response.error);
//         return;
//       }
//       if (response?.token) {
//         await setToken({
//           key: "session",
//           value: response.token,
//         });
//         // await refetchData();
//         router.replace("/home");
//       }
//     } catch (error) {
//       setError(error instanceof Error ? error.message : "Something went wrong");
//     } finally {
//       setIsLoading(false);
//     }
//   };
