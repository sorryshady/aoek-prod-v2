import React from "react";
import { TriangleAlert } from "lucide-react-native";
import { Alert, AlertIcon, AlertText } from "@/components/ui";
const ErrorAlert = ({ error }: { error: string }) => {
  return (
    <Alert action="warning" className="my-2">
      <AlertIcon as={TriangleAlert} />
      <AlertText className="font-pregular">{error}</AlertText>
    </Alert>
  );
};

export default ErrorAlert;
