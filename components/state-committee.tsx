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
} from "./ui";
import { changeTypeToText } from "@/lib/utils";

const StateCommittee = ({ members }: { members: any[] }) => {
  const [visible, setVisible] = useState(false);
  const [member, setMember] = useState<any>(null);
  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      <ScrollView
        className="p-4 mt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex flex-row flex-wrap justify-between mb-10">
          {members.map((member, index) => (
            <View
              key={index}
              className="w-[48%] bg-white rounded-lg shadow-md p-4 mb-4 justify-between"
            >
              {/* Avatar Container */}
              <View className="items-center">
                <View className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#5386A4] mb-3">
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
                <Text className="text-center text-base font-pbold mb-1">
                  {member.name}
                </Text>
                <Text className="text-center text-sm font-pmedium text-gray-600 mb-2">
                  {changeTypeToText(member.positionState)}
                </Text>
                <Text className="text-center text-xs font-pmedium text-gray-500 mb-3">
                  {member.designation
                    ? changeTypeToText(member.designation)
                    : "N/A"}
                </Text>
              </View>
              <Button
                className="bg-[#5386A4] rounded-md w-full"
                onPress={() => {
                  setMember(member);
                  setVisible(true);
                }}
              >
                <ButtonText className="text-white text-center text-sm">
                  Details
                </ButtonText>
              </Button>
            </View>
          ))}
        </View>
      </ScrollView>
      {member && (
        <AlertDialog isOpen={visible} onClose={onClose} size="lg">
          <AlertDialogBackdrop />
          <AlertDialogContent>
            <AlertDialogHeader>
              <Heading className="text-typography-950 font-psemibold" size="md">
                Member Details
              </Heading>
            </AlertDialogHeader>
            <AlertDialogBody>
              <View className="p-4 items-center">
                <View className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#5386A4] mb-3">
                  <Image
                    source={
                      member.photoUrl ? { uri: member.photoUrl } : images.member
                    }
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
                <Text className="text-base font-pregular mb-1 text-center">
                  Name: {member.name}
                </Text>
                <Text className="text-base font-pregular mb-1 text-center">
                  Position: {changeTypeToText(member.positionState)}
                </Text>
                <Text className="text-base font-pregular mb-1 text-center">
                  Designation:{" "}
                  {member.designation
                    ? changeTypeToText(member.designation)
                    : "N/A"}
                </Text>
                <Text className="text-base font-pregular mb-1 text-center">
                  Email: {member.email || "N/A"}
                </Text>
                <Text className="text-base font-pregular mb-1 text-center">
                  Mobile: {member.mobileNumber || "N/A"}
                </Text>
              </View>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                className="bg-[#5386A4] rounded-md w-full"
                onPress={onClose}
              >
                <ButtonText className="text-white text-center text-sm">
                  Close
                </ButtonText>
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default StateCommittee;
