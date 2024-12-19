import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Verification } from "@/constants/types";
import {
  Alert,
  AlertIcon,
  AlertText,
  Button,
  ButtonIcon,
  HStack,
  VStack,
} from "./ui";
import { CircleCheck, Clock, EyeOff, TriangleAlert } from "lucide-react-native";
import { queryClient } from "@/app/_layout";

interface ShowRequestStatusProps {
  latestRequest: {
    status: Verification;
    adminComments?: string;
    id: string;
    showAgain: boolean;
  };
  hideUserRequest: (id: string) => Promise<void>;
}

const ShowRequestStatus: React.FC<ShowRequestStatusProps> = ({
  latestRequest,
  hideUserRequest,
}) => {
  return (
    <Alert
      action={
        latestRequest.status === "VERIFIED"
          ? "success"
          : latestRequest.status === "REJECTED"
            ? "error"
            : "info"
      }
    >
      <AlertIcon
        as={
          latestRequest.status === "VERIFIED"
            ? CircleCheck
            : latestRequest.status === "REJECTED"
              ? TriangleAlert
              : Clock
        }
      />
      <HStack className="justify-between flex-1 items-center gap-1 sm:gap-8">
        <VStack>
          <AlertText>{latestRequest.status} Request</AlertText>
          {latestRequest.adminComments && (
            <AlertText>{latestRequest.adminComments}</AlertText>
          )}
        </VStack>
        <Button
          onPress={async () => {
            try {
              if (latestRequest.status !== "PENDING") {
                await hideUserRequest(latestRequest.id);
                queryClient.invalidateQueries({
                  queryKey: ["latestRequest"],
                });
              }
            } catch (error) {
              console.error("Error hiding request:", error);
            }
          }}
          className="bg-white"
        >
          <ButtonIcon as={EyeOff} />
        </Button>
      </HStack>
    </Alert>
  );
};

export default ShowRequestStatus;
