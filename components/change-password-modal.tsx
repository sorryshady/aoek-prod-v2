import React, { useState } from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";

import { changePassword } from "@/api/user";
import {
  AlertDialogContent,
  AlertDialog,
  AlertDialogHeader,
  AlertDialogBackdrop,
  Button,
  ButtonSpinner,
  Heading,
  ButtonText,
  FormControl,
  FormControlLabelText,
  Input,
  InputField,
  FormControlLabel,
  AlertDialogBody,
} from "./ui";
import PasswordEntry from "./password-entry";
import ErrorAlert from "./error-alert";
import SuccessAlert from "./success-alert";

interface Props {
  visible: boolean;
  onClose: () => void;
  isTablet: boolean;
}

const ChangePasswordModal = ({ visible, onClose, isTablet }: Props) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setError(null);
      setIsLoading(true);
      setSuccessMessage(null);

      // Validate passwords match
      if (formData.newPassword !== formData.confirmPassword) {
        setError("Passwords don't match");
        return;
      }

      // Validate all fields are filled
      if (!formData.currentPassword || !formData.newPassword) {
        setError("All fields are required");
        return;
      }

      const response = await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (response?.error) {
        setError(response.error);
        return;
      }

      // Reset form and close modal on success
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSuccessMessage("Password changed successfully");
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AlertDialog isOpen={visible} onClose={onClose} size="lg">
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading
              className="text-typography-950 font-psemibold"
              size={isTablet ? "xl" : "md"}
            >
              Change Password
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              className="flex-1 justify-end bg-black/50"
            >
              <View className="bg-white pt-6">
                <View className="gap-4">
                  <FormControl>
                    <FormControlLabel>
                      <FormControlLabelText
                        className={`font-pmedium ${isTablet ? "text-lg" : ""}`}
                      >
                        Current Password
                      </FormControlLabelText>
                    </FormControlLabel>

                    <PasswordEntry
                      value={formData.currentPassword}
                      setValue={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          currentPassword: value,
                        }))
                      }
                      placeholder="Enter current password"
                      showPasswordStrength={false}
                      isTablet={isTablet}
                    />
                  </FormControl>

                  <FormControl>
                    <FormControlLabel>
                      <FormControlLabelText
                        className={`font-pmedium ${isTablet ? "text-lg" : ""}`}
                      >
                        New Password
                      </FormControlLabelText>
                    </FormControlLabel>
                    <PasswordEntry
                      value={formData.newPassword}
                      setValue={(value) =>
                        setFormData((prev) => ({ ...prev, newPassword: value }))
                      }
                      placeholder="Enter new password"
                      showPasswordStrength={true}
                      isTablet={isTablet}
                    />
                  </FormControl>

                  <FormControl>
                    <FormControlLabel>
                      <FormControlLabelText
                        className={`font-pmedium ${isTablet ? "text-lg" : ""}`}
                      >
                        Confirm New Password
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
                      placeholder="Confirm new password"
                      showPasswordStrength={false}
                      isTablet={isTablet}
                    />
                  </FormControl>

                  {error && <ErrorAlert error={error} isTablet={isTablet} />}
                  {successMessage && (
                    <SuccessAlert
                      message={successMessage}
                      isTablet={isTablet}
                    />
                  )}
                  <View className="gap-4 mt-4">
                    <Button
                      className="bg-[#5386A4] rounded-md"
                      isDisabled={isLoading}
                      onPress={handleSubmit}
                      size={isTablet ? "xl" : "md"}
                    >
                      <ButtonText className="font-psemibold">
                        {isLoading ? "Changing Password..." : "Change Password"}
                      </ButtonText>
                      {isLoading && <ButtonSpinner color="white" />}
                    </Button>
                    <Button
                      action="secondary"
                      className="rounded-md"
                      onPress={onClose}
                      size={isTablet ? "xl" : "md"}
                    >
                      <ButtonText className="font-psemibold">Cancel</ButtonText>
                    </Button>
                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ChangePasswordModal;
