import React from "react";
import { CheckCircle } from "lucide-react-native";
import { Alert, AlertIcon, AlertText } from "@/components/ui";

const SuccessAlert = ({ message }: { message: string }) => {
  return (
    <Alert action="success" className="my-2">
      <AlertIcon as={CheckCircle} />
      <AlertText>{message}</AlertText>
    </Alert>
  );
};

export default SuccessAlert;
