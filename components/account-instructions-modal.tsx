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
            Account & Data Controls
          </Heading>
        </AlertDialogHeader>
        <AlertDialogBody className="mt-4">
          <Text
            className={`font-pmedium text-gray-700 mb-4 ${isTablet ? "text-lg" : "text-base"}`}
          >
            As a member of AOEK, you have a lifetime membership with our
            organization. Your account represents this permanent association.
          </Text>
          <Text
            className={`font-pmedium text-gray-700 mb-4 ${isTablet ? "text-lg" : "text-base"}`}
          >
            While account deletion is not available under normal circumstances,
            we understand there may be exceptional situations where this is
            needed.
          </Text>
          <Text
            className={`font-pmedium text-gray-700 mb-6 ${isTablet ? "text-lg" : "text-base"}`}
          >
            To request account deletion under such circumstances, please visit
            our Account Controls page.
          </Text>
          <Button
            onPress={() => Linking.openURL("https://aoek.org/account-data")}
            className={`bg-[#5386A4] rounded-md w-full ${isTablet ? "py-4" : ""}`}
          >
            <ButtonText
              className={`text-white font-psemibold ${isTablet ? "text-lg" : ""}`}
            >
              View Account Controls
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
