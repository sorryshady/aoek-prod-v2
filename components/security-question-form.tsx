import React, { useState } from "react";
import { router } from "expo-router";
import { resetPassword, verifySecurityAnswer } from "@/api/forgot-password";
import { setToken } from "@/lib/handle-session-tokens";
import { useGlobalContext } from "@/context/global-provider";
import ErrorAlert from "./error-alert";
import SuccessAlert from "./success-alert";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Button,
  ButtonSpinner,
  ButtonText,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Heading,
  Input,
  InputField,
  VStack,
} from "./ui";
import PasswordEntry from "./password-entry";
import { changeTypeToText } from "@/lib/utils";
import { Platform, ScrollView, Text, View } from "react-native";

interface SecurityQuestionFormProps {
  userDetails: {
    id: string;
    name: string;
    securityQuestion: string;
  };
  onBack: () => void;
  isTablet: boolean;
}

const SecurityAnswerForm = ({
  userDetails,
  onBack,
  onSuccess,
  isTablet,
}: {
  userDetails: { id: string; name: string; securityQuestion: string };
  onBack: () => void;
  onSuccess: () => void;
  isTablet: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [answer, setAnswer] = useState("");
  const [showModal, setShowModal] = useState(false);

  const continueHandler = async () => {
    try {
      setFormError("");
      if (!answer) {
        setFormError("Please enter your security answer");
        return;
      }
      setIsLoading(true);
      const response = await verifySecurityAnswer(userDetails.id, answer);
      if (response.error) {
        setFormError(response.error);
      } else {
        onSuccess();
      }
    } catch (error) {
      console.log(error);
      setFormError("Failed to verify security answer");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <VStack>
        <FormControl isInvalid={!!formError}>
          <FormControlLabel>
            <FormControlLabelText
              className={`font-pmedium ${isTablet ? "text-xl" : "text-base"}`}
            >
              {changeTypeToText(userDetails.securityQuestion)}
            </FormControlLabelText>
          </FormControlLabel>
          <Input size={isTablet ? "xl" : "md"}>
            <InputField
              value={answer}
              onChangeText={setAnswer}
              placeholder="Enter your answer"
              className="font-pregular"
            />
          </Input>
          <Button
            variant="link"
            className="justify-end w-fit rounded-md"
            size={isTablet ? "lg" : "md"}
            onPress={() => setShowModal(true)}
          >
            <ButtonText
              className="font-psemibold text-blue-500"
              size={Platform.OS === "ios" ? "sm" : "xs"}
            >
              Forgot Security Question?
            </ButtonText>
          </Button>
          {formError && <ErrorAlert error={formError} />}
        </FormControl>

        <Button
          isDisabled={isLoading}
          onPress={continueHandler}
          className="bg-[#5386A4] w-full rounded-md"
        >
          {isLoading ? (
            <>
              <ButtonSpinner color="#fff" />
              <ButtonText className="font-psemibold">Verifying...</ButtonText>
            </>
          ) : (
            <ButtonText className="font-psemibold">Continue</ButtonText>
          )}
        </Button>
        <Button variant="link" onPress={onBack}>
          <ButtonText className="font-psemibold text-blue-500">
            Back to Sign In
          </ButtonText>
        </Button>
      </VStack>
      <AlertDialog isOpen={showModal} onClose={() => setShowModal(false)}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading size={isTablet ? "xl" : "md"} className="font-psemibold">
              Password Reset Instructions
            </Heading>
            <AlertDialogCloseButton />
          </AlertDialogHeader>
          <AlertDialogBody>
            <ScrollView
              className="max-h-[70vh]"
              showsVerticalScrollIndicator={false}
            >
              <VStack space="sm">
                <Text
                  className={`font-psemibold ${isTablet ? "text-xl" : "text-base"}`}
                >
                  Please follow these steps:
                </Text>

                <VStack space="xs">
                  <Text
                    className={`font-pregular ${isTablet ? "text-lg" : "text-base"}`}
                  >
                    1. Send an email to: aoekerala@gmail.com
                  </Text>
                  <Text
                    className={`font-pregular ${isTablet ? "text-lg" : "text-base"}`}
                  >
                    2. Include the following information:
                  </Text>
                  <VStack space="xs">
                    <Text
                      className={`font-pregular ${isTablet ? "text-lg" : "text-base"}`}
                    >
                      • Full Name
                    </Text>
                    <Text
                      className={`font-pregular ${isTablet ? "text-lg" : "text-base"}`}
                    >
                      • Registered Email Address
                    </Text>
                    <Text
                      className={`font-pregular ${isTablet ? "text-lg" : "text-base"}`}
                    >
                      • Membership ID
                    </Text>
                    <Text
                      className={`font-pregular ${isTablet ? "text-lg" : "text-base"}`}
                    >
                      • Reason for password reset
                    </Text>
                    <Text
                      className={`font-pregular ${isTablet ? "text-lg" : "text-base"}`}
                    >
                      • Any additional verification information
                    </Text>
                  </VStack>
                  <Text
                    className={`font-pregular ${isTablet ? "text-lg" : "text-base"}`}
                  >
                    3. Subject line: "AOEK Password Reset Request"
                  </Text>
                  <Text
                    className={`font-pregular ${isTablet ? "text-lg" : "text-base"}`}
                  >
                    4. The admin team will verify your identity
                  </Text>
                  <Text
                    className={`font-pregular ${isTablet ? "text-lg" : "text-base"}`}
                  >
                    5. Once verified, your password and security question will
                    be reset
                  </Text>
                  <Text
                    className={`font-pregular ${isTablet ? "text-lg" : "text-base"}`}
                  >
                    6. You will receive an email after your request is processed
                  </Text>
                </VStack>

                <View className="bg-yellow-50 p-4 rounded-lg mt-4">
                  <Text className="font-psemibold mb-2">Important Notes:</Text>
                  <VStack space="xs">
                    <Text
                      className={`font-pregular ${isTablet ? "text-lg" : "text-base"}`}
                    >
                      • Password reset requests are typically processed within
                      24-48 hours
                    </Text>
                    <Text
                      className={`font-pregular ${isTablet ? "text-lg" : "text-base"}`}
                    >
                      • Make sure to check your spam folder for responses
                    </Text>
                    <Text
                      className={`font-pregular ${isTablet ? "text-lg" : "text-base"}`}
                    >
                      • Always use a strong password and remember your security
                      answer
                    </Text>
                  </VStack>
                </View>
              </VStack>
            </ScrollView>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              className="mt-4 rounded-md"
              variant="outline"
              onPress={() => setShowModal(false)}
            >
              <ButtonText className="font-psemibold">Close</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const ResetPasswordForm = ({
  userDetails,
  isTablet,
}: {
  userDetails: { id: string };
  isTablet: boolean;
}) => {
  const { refetchData } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const resetPasswordHandler = async () => {
    try {
      setFormError("");
      if (!password || !confirmPassword) {
        setFormError("Please enter your new password and confirm it");
        return;
      }
      if (password !== confirmPassword) {
        setFormError("Passwords do not match");
        return;
      }
      setIsLoading(true);
      const response = await resetPassword(userDetails.id, password);
      if (response.error) {
        setFormError(response.error);
      } else {
        if (response?.token) {
          await setToken({
            key: "session",
            value: response.token,
          });
        }
        await refetchData();
        setSuccess(true);
        setTimeout(() => {
          router.replace("/home");
        }, 1500);
      }
    } catch (error) {
      console.log(error);
      setFormError("Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack space="md">
      {!success ? (
        <>
          <FormControl isInvalid={!!formError}>
            <FormControlLabel>
              <FormControlLabelText
                className={`font-pmedium ${isTablet ? "text-xl" : "text-base"}`}
              >
                New Password
              </FormControlLabelText>
            </FormControlLabel>
            <PasswordEntry
              placeholder="Enter your new password"
              value={password}
              setValue={setPassword}
              showPasswordStrength={true}
              isTablet={isTablet}
            />
          </FormControl>

          <FormControl isInvalid={!!formError}>
            <FormControlLabel>
              <FormControlLabelText
                className={`font-pmedium ${isTablet ? "text-xl" : "text-base"}`}
              >
                Confirm Password
              </FormControlLabelText>
            </FormControlLabel>
            <PasswordEntry
              placeholder="Confirm your new password"
              value={confirmPassword}
              setValue={setConfirmPassword}
              showPasswordStrength={false}
              isTablet={isTablet}
            />
            {formError && <ErrorAlert error={formError} isTablet={isTablet} />}
          </FormControl>
          <Button
            isDisabled={isLoading}
            onPress={resetPasswordHandler}
            className="bg-[#5386A4] w-full rounded-md"
            size={isTablet ? "xl" : "lg"}
          >
            {isLoading ? (
              <>
                <ButtonSpinner color="#fff" />
                <ButtonText className="font-psemibold">
                  Confirming...
                </ButtonText>
              </>
            ) : (
              <ButtonText className="font-psemibold">Reset Password</ButtonText>
            )}
          </Button>
        </>
      ) : (
        <SuccessAlert
          message="Password reset successful. Logging you in..."
          isTablet={isTablet}
        />
      )}
    </VStack>
  );
};

const SecurityQuestionForm = ({
  userDetails,
  onBack,
  isTablet,
}: SecurityQuestionFormProps) => {
  const [step, setStep] = useState<"answer" | "reset">("answer");

  if (step === "answer") {
    return (
      <SecurityAnswerForm
        userDetails={userDetails}
        onBack={onBack}
        onSuccess={() => setStep("reset")}
        isTablet={isTablet}
      />
    );
  }
  return <ResetPasswordForm userDetails={userDetails} isTablet={isTablet} />;
};

export default SecurityQuestionForm;
