import { useState } from "react";
import { SecurityQuestionType } from "@/constants/types";
import { changeTypeToText } from "@/lib/utils";
import PasswordEntry from "@/components/password-entry";
import ErrorAlert from "@/components/error-alert";
import {
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
  Button,
  ButtonText,
  ButtonSpinner,
  VStack,
} from "@/components/ui";

interface SetupFormData {
  securityQuestion: SecurityQuestionType;
  securityAnswer: string;
  password: string;
  confirmPassword: string;
}

interface SetupFormProps {
  onSubmit: (data: SetupFormData) => Promise<void>;
  isLoading: boolean;
  error: string;
}

export default function SetupForm({ onSubmit, isLoading, error }: SetupFormProps) {
  const [formData, setFormData] = useState<SetupFormData>({
    securityQuestion: SecurityQuestionType.MOTHERS_MAIDEN_NAME,
    securityAnswer: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <VStack space="md">
      <FormControl>
        <FormControlLabel>
          <FormControlLabelText className="font-pmedium">
            Security Question
          </FormControlLabelText>
        </FormControlLabel>
        <Select
          selectedValue={formData.securityQuestion}
          onValueChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              securityQuestion: value as SecurityQuestionType,
            }))
          }
        >
          <SelectTrigger>
            <SelectInput
              placeholder="Select a security question"
              value={changeTypeToText(formData.securityQuestion)}
              className="font-pregular"
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
                  className="font-pregular"
                />
              ))}
            </SelectContent>
          </SelectPortal>
        </Select>
      </FormControl>

      <FormControl>
        <FormControlLabel>
          <FormControlLabelText className="font-pmedium">
            Security Answer
          </FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            value={formData.securityAnswer}
            onChangeText={(value) =>
              setFormData((prev) => ({
                ...prev,
                securityAnswer: value,
              }))
            }
            placeholder="Enter your security answer"
            className="font-pregular"
          />
        </Input>
      </FormControl>

      <FormControl isInvalid={!!error}>
        <FormControlLabel>
          <FormControlLabelText className="font-pmedium">
            Password
          </FormControlLabelText>
        </FormControlLabel>
        <PasswordEntry
          value={formData.password}
          setValue={(value) =>
            setFormData((prev) => ({
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
          <FormControlLabelText className="font-pmedium">
            Confirm Password
          </FormControlLabelText>
        </FormControlLabel>
        <PasswordEntry
          value={formData.confirmPassword}
          setValue={(value) =>
            setFormData((prev) => ({
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
        onPress={handleSubmit}
        className="bg-red-500 mt-4 rounded-md"
      >
        {isLoading ? (
          <>
            <ButtonSpinner color={"white"} />
            <ButtonText className="font-psemibold">Setting up...</ButtonText>
          </>
        ) : (
          <ButtonText className="font-psemibold">Setup</ButtonText>
        )}
      </Button>
    </VStack>
  );
}
