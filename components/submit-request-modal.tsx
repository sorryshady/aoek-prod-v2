import React, { useState, useEffect } from "react";
import { View, Platform, KeyboardAvoidingView } from "react-native";
import {
  District,
  Designation,
  TransferRequest,
  PromotionRequest,
  RetirementRequest,
  Request,
} from "@/constants/types";
import { changeTypeToText, isValidDate } from "@/lib/utils";
import { submitRequest } from "@/api/user";
import { useGlobalContext } from "@/context/global-provider";
import {
  FormControlLabel,
  FormControlLabelText,
  FormControl,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectContent,
  SelectBackdrop,
  SelectInput,
  Select,
  SelectTrigger,
  SelectPortal,
  SelectItem,
  Input,
  InputField,
  Button,
  ButtonText,
  ButtonSpinner,
  AlertDialogBackdrop,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  Heading,
  AlertDialogBody,
} from "./ui";
import ErrorAlert from "./error-alert";
import SuccessAlert from "./success-alert";
import { queryClient } from "@/app/_layout";

interface Props {
  visible: boolean;
  onClose: () => void;
  isTablet: boolean;
}

type RequestType = "PROMOTION" | "TRANSFER" | "RETIREMENT";

const SubmitRequestModal = ({ visible, onClose, isTablet }: Props) => {
  const { user } = useGlobalContext();
  const [requestType, setRequestType] = useState<RequestType>("PROMOTION");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Move initial state to useEffect
  const [transferData, setTransferData] = useState<TransferRequest>({
    newWorkDistrict: District.THIRUVANANTHAPURAM,
    newOfficeAddress: "",
  });

  const [promotionData, setPromotionData] = useState<PromotionRequest>({
    newPosition: Designation.ASSISTANT_ENGINEER,
  });

  const [retirementData, setRetirementData] = useState<RetirementRequest>({
    retirementDate: new Date().toLocaleDateString("en-GB"),
  });

  // Add useEffect to update form data when completeUserData changes
  useEffect(() => {
    if (user) {
      setTransferData({
        newWorkDistrict: user.workDistrict || District.THIRUVANANTHAPURAM,
        newOfficeAddress: user.officeAddress || "",
      });

      setPromotionData({
        newPosition: user.designation || Designation.ASSISTANT_ENGINEER,
      });

      setRetirementData({
        retirementDate: new Date().toLocaleDateString("en-GB"),
      });
    }
  }, [user]);

  const handleSubmit = async () => {
    try {
      setError(null);
      setSuccessMessage(null);
      setIsLoading(true);

      let requestData = {};

      // Validate and prepare data based on request type
      switch (requestType) {
        case "TRANSFER":
          if (!transferData.newWorkDistrict) {
            throw new Error("New work district is required");
          }
          requestData = {
            requestType: "TRANSFER",
            ...transferData,
          };
          break;

        case "PROMOTION":
          if (!promotionData.newPosition) {
            throw new Error("New position is required");
          }
          requestData = {
            requestType: "PROMOTION",
            ...promotionData,
          };
          break;

        case "RETIREMENT":
          if (
            !retirementData.retirementDate ||
            !isValidDate(retirementData.retirementDate)
          ) {
            throw new Error(
              "Retirement date is required and must be in DD/MM/YYYY format",
            );
          }
          requestData = {
            requestType: "RETIREMENT",
            ...retirementData,
          };
          break;
      }

      const response = await submitRequest(requestData as Request);

      if (response?.error) {
        setError(response.error);
        return;
      }

      // Reset form and close modal on success
      setTransferData({
        newWorkDistrict: user?.workDistrict || District.THIRUVANANTHAPURAM,
        newOfficeAddress: user?.officeAddress || "",
      });
      setPromotionData({
        newPosition: user?.designation || Designation.ASSISTANT_ENGINEER,
      });
      setRetirementData({
        retirementDate: new Date().toLocaleDateString("en-GB"),
      });

      setSuccessMessage("Request submitted successfully");
      setTimeout(() => {
        onClose();
        setSuccessMessage(null);
        queryClient.invalidateQueries({
          queryKey: ["latestRequest"],
        });
      }, 1000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => {
    switch (requestType) {
      case "TRANSFER":
        return (
          <View className="gap-4">
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText
                  className={`font-pmedium ${isTablet ? "text-lg" : ""}`}
                >
                  New Work District
                </FormControlLabelText>
              </FormControlLabel>
              <Select
                selectedValue={
                  transferData.newWorkDistrict
                    ? changeTypeToText(transferData.newWorkDistrict)
                    : ""
                }
                onValueChange={(value) => {
                  setTransferData({
                    ...transferData,
                    newWorkDistrict: value as District,
                  });
                }}
                className="font-pregular"
              >
                <SelectTrigger>
                  <SelectInput placeholder="Select district" />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {Object.values(District).map((district) => (
                      <SelectItem
                        key={district}
                        label={changeTypeToText(district)}
                        value={district}
                      />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            </FormControl>
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText
                  className={`font-pmedium ${isTablet ? "text-lg" : ""}`}
                >
                  New Office Address
                </FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  value={transferData.newOfficeAddress}
                  onChangeText={(text) =>
                    setTransferData((prev) => ({
                      ...prev,
                      newOfficeAddress: text,
                    }))
                  }
                  placeholder="Enter new office address"
                  className="font-pregular"
                />
              </Input>
            </FormControl>
          </View>
        );

      case "PROMOTION":
        return (
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText
                className={`font-pmedium ${isTablet ? "text-lg" : ""}`}
              >
                New Position
              </FormControlLabelText>
            </FormControlLabel>
            <Select
              selectedValue={
                promotionData.newPosition
                  ? changeTypeToText(promotionData.newPosition)
                  : ""
              }
              onValueChange={(value) => {
                setPromotionData({
                  ...promotionData,
                  newPosition: value as Designation,
                });
              }}
              className="font-pregular"
            >
              <SelectTrigger>
                <SelectInput placeholder="Select position" />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {Object.values(Designation).map((designation) => (
                    <SelectItem
                      key={designation}
                      label={changeTypeToText(designation)}
                      value={designation}
                    />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
          </FormControl>
        );

      case "RETIREMENT":
        return (
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText
                className={`font-pmedium ${isTablet ? "text-lg" : ""}`}
              >
                Retirement Date
              </FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                value={retirementData.retirementDate}
                onChangeText={(text) =>
                  setRetirementData({ retirementDate: text })
                }
                placeholder="Enter retirement date in DD/MM/YYYY format"
                className="font-pregular"
              />
            </Input>
          </FormControl>
        );

      default:
        return null;
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
              Submit Request
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
                        Request Type
                      </FormControlLabelText>
                    </FormControlLabel>
                    <Select
                      selectedValue={changeTypeToText(requestType)}
                      onValueChange={(value) => {
                        setRequestType(value as RequestType);
                      }}
                      className="font-pregular"
                    >
                      <SelectTrigger>
                        <SelectInput placeholder="Select request type" />
                      </SelectTrigger>
                      <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent>
                          <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                          </SelectDragIndicatorWrapper>
                          <SelectItem label="Promotion" value="PROMOTION" />
                          <SelectItem label="Transfer" value="TRANSFER" />
                          <SelectItem label="Retirement" value="RETIREMENT" />
                        </SelectContent>
                      </SelectPortal>
                    </Select>
                  </FormControl>

                  {renderForm()}

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
                        {isLoading ? "Submitting..." : "Submit Request"}
                      </ButtonText>
                      {isLoading && <ButtonSpinner color="white" />}
                    </Button>
                    <Button
                      className="rounded-md"
                      onPress={onClose}
                      action="secondary"
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

export default SubmitRequestModal;
