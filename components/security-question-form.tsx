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
}

const SecurityAnswerForm = ({
  userDetails,
  onBack,
  onSuccess,
}: {
  userDetails: { id: string; name: string; securityQuestion: string };
  onBack: () => void;
  onSuccess: () => void;
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
            <FormControlLabelText>
              {changeTypeToText(userDetails.securityQuestion)}
            </FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              value={answer}
              onChangeText={setAnswer}
              placeholder="Enter your answer"
            />
          </Input>
          <Button
            variant="link"
            className="justify-end w-fit"
            onPress={() => setShowModal(true)}
          >
            <ButtonText size={Platform.OS === "ios" ? "sm" : "xs"}>
              Forgot Security Question?
            </ButtonText>
          </Button>
          {formError && <ErrorAlert error={formError} />}
        </FormControl>

        <Button
          isDisabled={isLoading}
          onPress={continueHandler}
          className="bg-[#5386A4] w-full"
        >
          {isLoading ? (
            <>
              <ButtonSpinner color="#fff" />
              <ButtonText>Verifying...</ButtonText>
            </>
          ) : (
            <ButtonText>Continue</ButtonText>
          )}
        </Button>
        <Button variant="link" onPress={onBack}>
          <ButtonText>Back to Sign In</ButtonText>
        </Button>
      </VStack>
      <AlertDialog isOpen={showModal} onClose={() => setShowModal(false)}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading size="lg">Password Reset Instructions</Heading>
            <AlertDialogCloseButton />
          </AlertDialogHeader>
          <AlertDialogBody>
            <ScrollView
              className="max-h-[70vh]"
              showsVerticalScrollIndicator={false}
            >
              <VStack space="sm">
                <Text className="font-semibold">
                  Please follow these steps:
                </Text>

                <VStack space="xs">
                  <Text>1. Send an email to: aoekerala@gmail.com</Text>
                  <Text>2. Include the following information:</Text>
                  <VStack space="xs">
                    <Text>• Full Name</Text>
                    <Text>• Registered Email Address</Text>
                    <Text>• Membership ID</Text>
                    <Text>• Reason for password reset</Text>
                    <Text>• Any additional verification information</Text>
                  </VStack>
                  <Text>3. Subject line: "AOEK Password Reset Request"</Text>
                  <Text>4. The admin team will verify your identity</Text>
                  <Text>
                    5. Once verified, your password and security question will
                    be reset
                  </Text>
                  <Text>
                    6. You will receive an email after your request is processed
                  </Text>
                </VStack>

                <View className="bg-yellow-50 p-4 rounded-lg mt-4">
                  <Text className="font-semibold mb-2">Important Notes:</Text>
                  <VStack space="xs">
                    <Text>
                      • Password reset requests are typically processed within
                      24-48 hours
                    </Text>
                    <Text>
                      • Make sure to check your spam folder for responses
                    </Text>
                    <Text>
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
              className="mt-4"
              variant="outline"
              onPress={() => setShowModal(false)}
            >
              <ButtonText>Close</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const ResetPasswordForm = ({
  userDetails,
}: {
  userDetails: { id: string };
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
              <FormControlLabelText>New Password</FormControlLabelText>
            </FormControlLabel>
            <PasswordEntry
              placeholder="Enter your new password"
              value={password}
              setValue={setPassword}
              showPasswordStrength={true}
            />
          </FormControl>

          <FormControl isInvalid={!!formError}>
            <FormControlLabel>
              <FormControlLabelText>Confirm Password</FormControlLabelText>
            </FormControlLabel>
            <PasswordEntry
              placeholder="Confirm your new password"
              value={confirmPassword}
              setValue={setConfirmPassword}
              showPasswordStrength={false}
            />
            {formError && <ErrorAlert error={formError} />}
          </FormControl>
          <Button
            isDisabled={isLoading}
            onPress={resetPasswordHandler}
            className="bg-[#5386A4] w-full"
          >
            {isLoading ? (
              <>
                <ButtonSpinner color="#fff" />
                <ButtonText>Confirming...</ButtonText>
              </>
            ) : (
              <ButtonText>Reset Password</ButtonText>
            )}
          </Button>
        </>
      ) : (
        <SuccessAlert message="Password reset successful. Logging you in..." />
      )}
    </VStack>
  );
};

const SecurityQuestionForm = ({
  userDetails,
  onBack,
}: SecurityQuestionFormProps) => {
  const [step, setStep] = useState<"answer" | "reset">("answer");

  if (step === "answer") {
    return (
      <SecurityAnswerForm
        userDetails={userDetails}
        onBack={onBack}
        onSuccess={() => setStep("reset")}
      />
    );
  }
  return <ResetPasswordForm userDetails={userDetails} />;
};

export default SecurityQuestionForm;
