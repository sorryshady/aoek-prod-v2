import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { changePassword } from "@/api/user";
import {
  Button,
  ButtonSpinner,
  ButtonText,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
} from "./ui";
import PasswordEntry from "./password-entry";
import ErrorAlert from "./error-alert";
import SuccessAlert from "./success-alert";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const ChangePasswordModal = ({ visible, onClose }: Props) => {
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
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      statusBarTranslucent={true}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-end bg-black/50"
      >
        <View className="bg-white rounded-t-3xl p-6">
          <Text className="text-xl font-pbold text-center mb-6">
            Change Password
          </Text>

          <View className="gap-4">
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>Current Password</FormControlLabelText>
              </FormControlLabel>

              <PasswordEntry
                value={formData.currentPassword}
                setValue={(value) =>
                  setFormData((prev) => ({ ...prev, currentPassword: value }))
                }
                placeholder="Enter current password"
                showPasswordStrength={false}
              />
            </FormControl>

            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>New Password</FormControlLabelText>
              </FormControlLabel>
              <PasswordEntry
                value={formData.newPassword}
                setValue={(value) =>
                  setFormData((prev) => ({ ...prev, newPassword: value }))
                }
                placeholder="Enter new password"
                showPasswordStrength={true}
              />
            </FormControl>

            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>
                  Confirm New Password
                </FormControlLabelText>
              </FormControlLabel>
              <PasswordEntry
                value={formData.confirmPassword}
                setValue={(value) =>
                  setFormData((prev) => ({ ...prev, confirmPassword: value }))
                }
                placeholder="Confirm new password"
                showPasswordStrength={false}
              />
            </FormControl>

            {error && <ErrorAlert error={error} />}
            {successMessage && <SuccessAlert message={successMessage} />}
            <View className="gap-4 mt-4">
              <Button
                className="bg-[#5386A4]"
                isDisabled={isLoading}
                onPress={handleSubmit}
              >
                <ButtonText>
                  {isLoading ? "Changing Password..." : "Change Password"}
                </ButtonText>
                {isLoading && <ButtonSpinner color="white" />}
              </Button>
              <Button action="secondary" onPress={onClose}>
                <ButtonText>Cancel</ButtonText>
              </Button>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ChangePasswordModal;