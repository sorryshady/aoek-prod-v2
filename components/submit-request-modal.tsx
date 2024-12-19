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
}

type RequestType = "PROMOTION" | "TRANSFER" | "RETIREMENT";

const SubmitRequestModal = ({ visible, onClose }: Props) => {
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
                <FormControlLabelText>New Work District</FormControlLabelText>
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
                <FormControlLabelText>New Office Address</FormControlLabelText>
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
                />
              </Input>
            </FormControl>
          </View>
        );

      case "PROMOTION":
        return (
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>New Position</FormControlLabelText>
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
              <FormControlLabelText>Retirement Date</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                value={retirementData.retirementDate}
                onChangeText={(text) =>
                  setRetirementData({ retirementDate: text })
                }
                placeholder="Enter retirement date in DD/MM/YYYY format"
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
            <Heading className="text-typography-950 font-semibold" size="md">
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
                      <FormControlLabelText>Request Type</FormControlLabelText>
                    </FormControlLabel>
                    <Select
                      selectedValue={changeTypeToText(requestType)}
                      onValueChange={(value) => {
                        setRequestType(value as RequestType);
                      }}
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

                  {error && <ErrorAlert error={error} />}
                  {successMessage && <SuccessAlert message={successMessage} />}

                  <View className="gap-4 mt-4">
                    <Button
                      className="bg-[#5386A4]"
                      isDisabled={isLoading}
                      onPress={handleSubmit}
                    >
                      <ButtonText>
                        {isLoading ? "Submitting..." : "Submit Request"}
                      </ButtonText>
                      {isLoading && <ButtonSpinner color="white" />}
                    </Button>
                    <Button onPress={onClose} action="secondary">
                      <ButtonText>Cancel</ButtonText>
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
