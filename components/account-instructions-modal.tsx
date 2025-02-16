import { Linking, Text, View } from "react-native";
import React from "react";
import {
  AlertDialogContent,
  AlertDialog,
  AlertDialogHeader,
  AlertDialogBackdrop,
  Button,
  ButtonText,
  Heading,
  AlertDialogBody,
  AlertDialogFooter,
} from "./ui";

const AccountInstructionsModal = ({
  visible,
  onClose,
  isTablet,
}: {
  visible: boolean;
  onClose: () => void;
  isTablet: boolean;
}) => {
  return (
    <AlertDialog isOpen={visible} onClose={onClose} size="lg">
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Heading
            className={`text-typography-950 font-psemibold`}
            size={isTablet ? "xl" : "md"}
          >
            Account & Privacy Information
          </Heading>
        </AlertDialogHeader>
        <AlertDialogBody className="mt-4">
          <Text
            className={`font-pmedium text-gray-700 mb-4 ${isTablet ? "text-lg" : "text-base"}`}
          >
            As a member of AOEK, you have a lifetime membership with our
            organization. Your account represents this permanent association
            with AOEK.
          </Text>
          <Text
            className={`font-pmedium text-gray-700 mb-4 ${isTablet ? "text-lg" : "text-base"}`}
          >
            We are committed to protecting your privacy and ensuring you have
            control over your data. You can review our complete privacy policy
            to understand how we handle your information.
          </Text>
          <Text
            className={`font-pmedium text-gray-700 mb-6 ${isTablet ? "text-lg" : "text-base"}`}
          >
            While account deletion is not available under normal circumstances
            due to the lifetime nature of membership, we understand there may be
            exceptional situations. For such cases, please visit our Account
            Data Controls page.
          </Text>
          <Button
            onPress={() => Linking.openURL("https://aoek.org/account-data")}
            className={`bg-[#5386A4] rounded-md w-full ${isTablet ? "py-4" : ""}`}
          >
            <ButtonText
              className={`text-white font-psemibold ${isTablet ? "text-lg" : ""}`}
            >
              Account Data Controls
            </ButtonText>
          </Button>
          <Button
            onPress={() => Linking.openURL("https://aoek.org/privacy-policy")}
            className="mt-4 bg-white rounded-md border border-[#5386A4] w-full"
            size={isTablet ? "xl" : "md"}
          >
            <ButtonText className="text-[#5386A4] font-psemibold">
              View Privacy Policy
            </ButtonText>
          </Button>
        </AlertDialogBody>
        <AlertDialogFooter className="mt-4">
          <Button
            onPress={onClose}
            action="secondary"
            className="rounded-md w-full"
          >
            <ButtonText className="font-psemibold">Close</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AccountInstructionsModal;
