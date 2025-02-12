import { useState } from "react";
import PasswordEntry from "@/components/password-entry";
import { Platform } from "react-native";
import { ButtonSpinner } from "../ui";
import { ButtonText } from "../ui";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "../ui";
import { VStack } from "../ui";
import ErrorAlert from "../error-alert";

interface PasswordFormProps {
  onSubmit: (password: string, identifier: string) => Promise<void>;
  onForgotPassword: () => void;
  isLoading: boolean;
  error: string;
  identifier: string;
  isTablet: boolean;
}

export default function PasswordForm({
  onSubmit,
  onForgotPassword,
  isLoading,
  error,
  identifier,
  isTablet,
}: PasswordFormProps) {
  const [password, setPassword] = useState("");

  return (
    <VStack space="sm">
      <FormControl isInvalid={!!error}>
        <FormControlLabel>
          <FormControlLabelText className="font-pmedium">
            Password
          </FormControlLabelText>
        </FormControlLabel>
        <PasswordEntry
          value={password}
          setValue={setPassword}
          placeholder="Enter your password"
          showPasswordStrength={false}
          isTablet={isTablet}
        />
      </FormControl>

      <Button
        variant="link"
        size="xs"
        onPress={onForgotPassword}
        className="self-end"
      >
        <ButtonText
          size={Platform.OS === "ios" ? "sm" : "xs"}
          className="text-blue-500 font-psemibold"
        >
          Forgot Password?
        </ButtonText>
      </Button>
      {error && <ErrorAlert error={error} />}
      <Button
        size="lg"
        variant="solid"
        action="primary"
        isDisabled={isLoading}
        onPress={() => onSubmit(password, identifier)}
        className="bg-red-500 rounded-md"
      >
        {isLoading ? (
          <>
            <ButtonSpinner color={"white"} />
            <ButtonText className="font-psemibold">Logging in...</ButtonText>
          </>
        ) : (
          <ButtonText className="font-psemibold">Login</ButtonText>
        )}
      </Button>
    </VStack>
  );
}
