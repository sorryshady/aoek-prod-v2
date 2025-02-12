import { useState } from "react";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  Button,
  ButtonText,
  ButtonSpinner,
  VStack,
} from "@/components/ui";
import ErrorAlert from "@/components/error-alert";

interface IdentifierFormProps {
  onSubmit: (identifier: string) => Promise<void>;
  isLoading: boolean;
  error: string;
  isTablet: boolean;
}

export default function IdentifierForm({
  onSubmit,
  isLoading,
  error,
  isTablet,
}: IdentifierFormProps) {
  const [value, setValue] = useState("");

  return (
    <VStack space={isTablet ? "lg" : "md"}>
      <FormControl isInvalid={!!error}>
        <FormControlLabel>
          <FormControlLabelText
            className={`font-pmedium ${isTablet ? "text-xl" : "text-base"}`}
          >
            Email or Membership ID
          </FormControlLabelText>
        </FormControlLabel>
        <Input size={isTablet ? "xl" : "md"}>
          <InputField
            value={value}
            onChangeText={setValue}
            placeholder="Enter your email or membership ID"
            keyboardType="email-address"
            className="font-pregular"
          />
        </Input>
        {error && <ErrorAlert error={error} isTablet={isTablet} />}
      </FormControl>
      <Button
        size={isTablet ? "xl" : "lg"}
        action="primary"
        isDisabled={isLoading}
        onPress={() => onSubmit(value)}
        className="bg-red-500 rounded-md"
      >
        {isLoading ? (
          <>
            <ButtonSpinner color={"white"} />
            <ButtonText className="font-psemibold">Checking...</ButtonText>
          </>
        ) : (
          <ButtonText className="font-psemibold">Next</ButtonText>
        )}
      </Button>
    </VStack>
  );
}
