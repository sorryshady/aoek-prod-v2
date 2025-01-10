import { useState, useEffect } from "react";
import { ButtonSpinner, ButtonText, Button, HStack, InputField, Input, FormControlLabelText, FormControlLabel, FormControl, VStack } from '../ui'
import ErrorAlert from '../error-alert'

interface OTPFormProps {
  onSubmit: (otp: string) => Promise<void>;
  onResendOTP: () => Promise<void>;
  onContactAdmin: () => void;
  isLoading: boolean;
  error: string;
  resendTimeout?: number;
}

export default function OTPForm({
  onSubmit,
  onResendOTP,
  onContactAdmin,
  isLoading,
  error,
  resendTimeout = 30
}: OTPFormProps) {
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(resendTimeout);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <VStack space="md">
      <FormControl isInvalid={!!error}>
        <FormControlLabel>
          <FormControlLabelText className="font-pmedium">
            Enter OTP
          </FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            value={otp}
            onChangeText={setOtp}
            placeholder="Enter OTP sent to your mobile"
            keyboardType="number-pad"
            maxLength={6}
            className="font-pregular"
          />
        </Input>
        {error && <ErrorAlert error={error} />}
      </FormControl>

      <HStack space="sm">
        <Button
          variant="link"
          size="xs"
          onPress={onContactAdmin}
        >
          <ButtonText className="text-blue-500 font-psemibold">
            Haven't received OTP?
          </ButtonText>
        </Button>

        <Button
          variant="link"
          size="xs"
          isDisabled={countdown > 0}
          onPress={onResendOTP}
        >
          <ButtonText className="text-blue-500 font-psemibold">
            {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
          </ButtonText>
        </Button>
      </HStack>

      <Button
        size="lg"
        action="primary"
        isDisabled={isLoading || otp.length !== 6}
        onPress={() => onSubmit(otp)}
        className="bg-red-500 rounded-md"
      >
        {isLoading ? (
          <>
            <ButtonSpinner color={"white"} />
            <ButtonText className="font-psemibold">Verifying...</ButtonText>
          </>
        ) : (
          <ButtonText className="font-psemibold">Verify OTP</ButtonText>
        )}
      </Button>
    </VStack>
  );
}
