import React from "react";
import { View } from "react-native";
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
import { changeTypeToText } from "@/lib/utils";
import { useGlobalContext } from "@/context/global-provider";

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
  const { user } = useGlobalContext();

  const handleHideRequest = async () => {
    try {
      if (latestRequest.status === "PENDING") {
        queryClient.setQueryData(["latestRequest", user?.membershipId], {
          ...latestRequest,
          showAgain: false,
        });
      } else {
        await hideUserRequest(latestRequest.id);
        queryClient.invalidateQueries({
          queryKey: ["latestRequest", user?.membershipId],
        });
      }
    } catch (error) {
      console.error("Error hiding request:", error);
    }
  };

  return (
    <Alert
      action={
        latestRequest.status === "VERIFIED"
          ? "success"
          : latestRequest.status === "REJECTED"
            ? "error"
            : "info"
      }
      className="mb-[1rem]"
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
      <View className="justify-between flex-row flex-1">
        <VStack className="items-center justify-center flex-1">
          {latestRequest.adminComments && (
            <AlertText>Admin Comments: {latestRequest.adminComments}</AlertText>
          )}
          <AlertText>
            {changeTypeToText(latestRequest.status)} Request
          </AlertText>
        </VStack>
        <Button
          className={`p-3.5 rounded-full ${latestRequest.status === "PENDING" ? "bg-blue-200/60" : latestRequest.status === "VERIFIED" ? "bg-emerald-200/60" : "bg-red-200/60"}`}
          onPress={handleHideRequest}
        >
          <ButtonIcon as={EyeOff} color="black" />
        </Button>
      </View>
    </Alert>
  );
};

export default ShowRequestStatus;
