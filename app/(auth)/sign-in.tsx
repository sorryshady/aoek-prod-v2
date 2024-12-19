import { setUpPassword, submitIdentifier, submitPassword } from "@/api/login";
import GradientBackground from "@/components/gradient-background";
import { images } from "@/constants";
import { SecurityQuestionType } from "@/constants/types";
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

interface UserDetails {
  id: string;
  name: string;
  photoUrl: string | null;
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
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [step, setStep] = useState<"identifier" | "password" | "setup">(
    "identifier",
  );
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [password, setPassword] = useState<string>("");
  const [setupFormData, setSetupFormData] = useState<SetupFormData>({
    securityQuestion: SecurityQuestionType.MOTHERS_MAIDEN_NAME,
    securityAnswer: "",
    password: "",
    confirmPassword: "",
  });
  const handleNext = async () => {
    try {
      setIsLoading(true);
      setError("");
      if (value === "") {
        return;
      }
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
      setStep(response.user.hasPassword ? "password" : "setup");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
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
        // await refetchData();
        router.replace("/home");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetup = async () => {
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

  const renderIdentifierStep = () => (
    <VStack space="md">
      <FormControl isInvalid={!!error}>
        <FormControlLabel>
          <FormControlLabelText>Email or Membership ID</FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            value={value}
            onChangeText={setValue}
            placeholder="Enter your email or membership ID"
            keyboardType="email-address"
          />
        </Input>
        {error && <ErrorAlert error={error} />}
      </FormControl>
      <Button
        size="lg"
        variant="solid"
        action="primary"
        isDisabled={isLoading}
        onPress={handleNext}
        className="bg-red-500"
      >
        {isLoading ? (
          <>
            <ButtonSpinner color={"white"} />
            <ButtonText>Checking...</ButtonText>
          </>
        ) : (
          <ButtonText>Next</ButtonText>
        )}
      </Button>
    </VStack>
  );

  const renderPasswordStep = () => (
    <VStack space="sm">
      <FormControl isInvalid={!!error}>
        <FormControlLabel>
          <FormControlLabelText>Password</FormControlLabelText>
        </FormControlLabel>
        <PasswordEntry
          value={password}
          setValue={setPassword}
          placeholder="Enter your password"
          showPasswordStrength={false}
        />
        {error && <ErrorAlert error={error} />}
      </FormControl>

      <Button
        variant="link"
        size="xs"
        onPress={() =>
          router.replace(`/forgot-password?userId=${userDetails?.id}`)
        }
        className="self-end"
      >
        <ButtonText
          size={Platform.OS === "ios" ? "sm" : "xs"}
          className="text-blue-500"
        >
          Forgot Password?
        </ButtonText>
      </Button>

      <Button
        size="lg"
        variant="solid"
        action="primary"
        isDisabled={isLoading}
        onPress={handleLogin}
        className="bg-red-500"
      >
        {isLoading ? (
          <>
            <ButtonSpinner color={"white"} />
            <ButtonText>Logging in...</ButtonText>
          </>
        ) : (
          <ButtonText>Login</ButtonText>
        )}
      </Button>
    </VStack>
  );

  const renderSetupStep = () => (
    <VStack space="md">
      <FormControl>
        <FormControlLabel>
          <FormControlLabelText>Security Question</FormControlLabelText>
        </FormControlLabel>
        <Select
          selectedValue={setupFormData.securityQuestion}
          onValueChange={(value) =>
            setSetupFormData((prev) => ({
              ...prev,
              securityQuestion: value as SecurityQuestionType,
            }))
          }
        >
          <SelectTrigger>
            <SelectInput
              placeholder="Select a security question"
              value={changeTypeToText(setupFormData.securityQuestion)}
            />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              {Object.values(SecurityQuestionType).map((question) => (
                <SelectItem
                  key={question}
                  label={changeTypeToText(question)}
                  value={question}
                />
              ))}
            </SelectContent>
          </SelectPortal>
        </Select>
      </FormControl>

      <FormControl>
        <FormControlLabel>
          <FormControlLabelText>Security Answer</FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            value={setupFormData.securityAnswer}
            onChangeText={(value) =>
              setSetupFormData((prev) => ({
                ...prev,
                securityAnswer: value,
              }))
            }
            placeholder="Enter your security answer"
          />
        </Input>
      </FormControl>

      <FormControl isInvalid={!!error}>
        <FormControlLabel>
          <FormControlLabelText>Password</FormControlLabelText>
        </FormControlLabel>
        <PasswordEntry
          value={setupFormData.password}
          setValue={(value) =>
            setSetupFormData((prev) => ({
              ...prev,
              password: value,
            }))
          }
          placeholder="Enter your password"
          showPasswordStrength={true}
        />
      </FormControl>

      <FormControl isInvalid={!!error}>
        <FormControlLabel>
          <FormControlLabelText>Confirm Password</FormControlLabelText>
        </FormControlLabel>
        <PasswordEntry
          value={setupFormData.confirmPassword}
          setValue={(value) =>
            setSetupFormData((prev) => ({
              ...prev,
              confirmPassword: value,
            }))
          }
          placeholder="Confirm your password"
          showPasswordStrength={false}
        />
        {error && <ErrorAlert error={error} />}
      </FormControl>

      <Button
        size="lg"
        variant="solid"
        action="primary"
        isDisabled={isLoading}
        onPress={handleSetup}
        className="bg-red-500 mt-4"
      >
        {isLoading ? (
          <>
            <ButtonSpinner color={"white"} />
            <ButtonText>Setting up...</ButtonText>
          </>
        ) : (
          <ButtonText>Setup</ButtonText>
        )}
      </Button>
    </VStack>
  );

  return (
    <SafeAreaView className="flex-1">
      <GradientBackground>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 47 : 0}
          className="flex-1"
          style={{ position: "relative" }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-1 px-4 items-center mt-10">
              <View className="w-full max-w-[400px]">
                <Image
                  source={images.logo}
                  className="w-[150px] h-[150px] self-center"
                  resizeMode="contain"
                />
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

                    {step === "identifier" ? (
                      renderIdentifierStep()
                    ) : (
                      <VStack space="md">
                        <Button
                          variant="link"
                          size="sm"
                          className="justify-start"
                          onPress={() => {
                            setStep("identifier");
                            setError("");
                            setUserDetails(null);
                          }}
                        >
                          <ButtonIcon as={ArrowLeft} />

                          <ButtonText className="text-black font-psemibold">
                            Back
                          </ButtonText>
                        </Button>

                        {userDetails && (
                          <VStack space="sm" className="items-center mb-4">
                            <View className="text-center gap-4">
                              <View className="relative h-28 w-28 mx-auto rounded-full overflow-hidden bg-muted border border-black flex items-center justify-center">
                                {userDetails.photoUrl ? (
                                  <Image
                                    source={{ uri: userDetails.photoUrl }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                  />
                                ) : (
                                  <Text className="text-black text-2xl font-semibold">
                                    {userDetails.name[0].toUpperCase()}
                                  </Text>
                                )}
                              </View>
                              <Text className="font-psemibold text-lg text-center">
                                {userDetails.name}
                              </Text>
                            </View>
                          </VStack>
                        )}

                        {step === "password"
                          ? renderPasswordStep()
                          : renderSetupStep()}
                      </VStack>
                    )}
                    {step === "identifier" && (
                      <HStack
                        space="sm"
                        className="justify-center items-center mt-6"
                      >
                        <Text>Don't have an account? </Text>
                        <Button
                          variant="link"
                          onPress={() => router.push("/sign-up")}
                        >
                          <ButtonText className="text-blue-500">
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
