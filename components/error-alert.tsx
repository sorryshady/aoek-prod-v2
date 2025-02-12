import React from "react";
import { TriangleAlert } from "lucide-react-native";
import { Alert, AlertIcon, AlertText } from "@/components/ui";
interface ErrorAlertProps {
  error: string;
  isTablet?: boolean;
}
const ErrorAlert = ({ error, isTablet }: ErrorAlertProps) => {
  return (
    <Alert action="warning" className="my-2">
      <AlertIcon as={TriangleAlert} size={isTablet ? "xl" : "md"} />
      <AlertText className="font-pregular" size={isTablet ? "lg" : "md"}>
        {error}
      </AlertText>
    </Alert>
  );
};

export default ErrorAlert;
