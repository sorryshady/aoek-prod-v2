import React from "react";
import { CheckCircle } from "lucide-react-native";
import { Alert, AlertIcon, AlertText } from "@/components/ui";

const SuccessAlert = ({
  message,
  isTablet,
}: {
  message: string;
  isTablet?: boolean;
}) => {
  return (
    <Alert action="success" className="my-2">
      <AlertIcon as={CheckCircle} size={isTablet ? "xl" : "md"} />
      <AlertText className="font-pmedium">{message}</AlertText>
    </Alert>
  );
};

export default SuccessAlert;
