import { ScrollView, View, Image, Text } from "react-native";
import React, { useState } from "react";
import { images } from "@/constants";
import {
  AlertDialogBody,
  AlertDialogHeader,
  Heading,
  AlertDialogContent,
  AlertDialogBackdrop,
  AlertDialog,
  Button,
  ButtonText,
  AlertDialogFooter,
  SelectItem,
  SelectContent,
  SelectTrigger,
  Select,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectPortal,
  SelectInput,
  SelectBackdrop,
} from "./ui";
import { changeTypeToText } from "@/lib/utils";
import { District } from "@/constants/types";

const DistrictCommittee = ({
  members,
  isTablet,
}: {
  members: any[];
  isTablet: boolean;
}) => {
  const [visible, setVisible] = useState(false);
  const [district, setDistrict] = useState<District>(District.KASARAGOD);
  const [member, setMember] = useState<any>(null);
  const [filteredMembers, setFilteredMembers] = useState<any[]>(
    members.filter((member) => member.workDistrict === district),
  );
  const onClose = () => setVisible(false);

  return (
    <View className="p-4 mt-4">
      <Text
        className={`font-psemibold text-white ${isTablet ? "text-xl" : "text-base"}`}
      >
        Select District
      </Text>
      <Select
        selectedValue={district ? changeTypeToText(district) : ""}
        onValueChange={(value) => {
          setDistrict(value as District);
          setFilteredMembers(
            members.filter((member) => member.workDistrict === value),
          );
        }}
        className={`font-pregular mb-4 mt-2 ${isTablet ? "text-lg" : ""}`}
      >
        <SelectTrigger>
          <SelectInput
            placeholder="Select district"
            className={isTablet ? "text-lg py-4" : ""}
          />
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
      <View className="flex flex-row flex-wrap justify-between mb-10">
        {filteredMembers.map((member, index) => (
          <View
            key={index}
            className={`w-[48%] bg-white rounded-lg shadow-md ${isTablet ? "p-6" : "p-4"} mb-4 justify-between`}
          >
            {/* Avatar Container */}
            <View className="items-center">
              <View
                className={`${isTablet ? "w-32 h-32" : "w-24 h-24"} rounded-full overflow-hidden border-2 border-[#5386A4] mb-3`}
              >
                <Image
                  source={
                    member.photoUrl ? { uri: member.photoUrl } : images.member
                  }
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            </View>

            {/* Member Details */}
            <View className="items-center">
              <Text
                className={`text-center font-pbold mb-1 ${isTablet ? "text-xl" : "text-base"}`}
              >
                {member.name}
              </Text>
              <Text
                className={`text-center font-pmedium text-gray-600 mb-2 ${isTablet ? "text-lg" : "text-sm"}`}
              >
                {changeTypeToText(member.positionDistrict)}
              </Text>
              <Text
                className={`text-center font-pmedium text-gray-500 mb-3 ${isTablet ? "text-base" : "text-xs"}`}
              >
                {member.designation
                  ? changeTypeToText(member.designation)
                  : "N/A"}
              </Text>
            </View>
            <Button
              className={`bg-[#5386A4] rounded-md w-full ${isTablet ? "py-3" : ""}`}
              onPress={() => {
                setMember(member);
                setVisible(true);
              }}
              size={isTablet ? "xl" : "md"}
            >
              <ButtonText
                className={`text-white text-center font-psemibold ${isTablet ? "text-lg" : "text-sm"}`}
              >
                Details
              </ButtonText>
            </Button>
          </View>
        ))}
      </View>

      {member && (
        <AlertDialog
          isOpen={visible}
          onClose={onClose}
          size={isTablet ? "lg" : "md"}
        >
          <AlertDialogBackdrop />
          <AlertDialogContent>
            <AlertDialogHeader>
              <Heading
                className={`text-typography-950 font-psemibold ${isTablet ? "text-2xl" : ""}`}
                size="md"
              >
                Member Details
              </Heading>
            </AlertDialogHeader>
            <AlertDialogBody>
              <View className="p-4 items-center">
                <View
                  className={`${isTablet ? "w-32 h-32" : "w-24 h-24"} rounded-full overflow-hidden border-2 border-[#5386A4] mb-3`}
                >
                  <Image
                    source={
                      member.photoUrl ? { uri: member.photoUrl } : images.member
                    }
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
                <Text
                  className={`font-pregular mb-1 text-center ${isTablet ? "text-xl" : "text-base"}`}
                >
                  Name: {member.name}
                </Text>
                <Text
                  className={`font-pregular mb-1 text-center ${isTablet ? "text-xl" : "text-base"}`}
                >
                  Position: {changeTypeToText(member.positionDistrict)}
                </Text>
                <Text
                  className={`font-pregular mb-1 text-center ${isTablet ? "text-xl" : "text-base"}`}
                >
                  Designation:{" "}
                  {member.designation
                    ? changeTypeToText(member.designation)
                    : "N/A"}
                </Text>
                <Text
                  className={`font-pregular mb-1 text-center ${isTablet ? "text-xl" : "text-base"}`}
                >
                  Email: {member.email || "N/A"}
                </Text>
                <Text
                  className={`font-pregular mb-1 text-center ${isTablet ? "text-xl" : "text-base"}`}
                >
                  Mobile: {member.mobileNumber || "N/A"}
                </Text>
              </View>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                className={`bg-[#5386A4] rounded-md w-full ${isTablet ? "py-3" : ""}`}
                onPress={onClose}
                size={isTablet ? "xl" : "md"}
              >
                <ButtonText
                  className={`text-white text-center font-psemibold ${isTablet ? "text-lg" : "text-sm"}`}
                >
                  Close
                </ButtonText>
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </View>
  );
};

export default DistrictCommittee;
