import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import {
  Button,
  ButtonText,
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  CheckboxLabel,
} from "./ui";
import { Check } from "lucide-react-native";

interface TermsConditionsProps {
  onAccept: () => void;
  onDecline: () => void;
  isTablet: boolean;
}

const TermsConditions = ({
  onAccept,
  onDecline,
  isTablet,
}: TermsConditionsProps) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <View
      className={`flex-1 mx-auto mt-10 ${isTablet ? "max-w-4xl  w-full" : "w-[90%]"}`}
    >
      <View className="flex-1 max-h-[80vh] bg-gray-50 rounded-lg p-4">
        <Text
          className={`text-black font-psemibold text-center ${isTablet ? "text-4xl" : "text-2xl"} mb-4`}
        >
          Terms and Conditions
        </Text>
        <ScrollView
          className={`flex-1 bg-gray-50 rounded-lg p-4 ${!isTablet ? "max-h-[60vh]" : ""} border-b border-gray-400`}
          showsVerticalScrollIndicator={true}
        >
          <View className="space-y-4">
            <Text className="font-psemibold text-black">
              Terms & Conditions for Membership Registration
            </Text>
            <Text className="font-pmedium text-gray-700">
              By proceeding with registration, you acknowledge and agree to the
              following:
            </Text>

            <View>
              <Text className="font-psemibold text-black mt-4 mb-2">
                Personal Information Collection:
              </Text>
              <View className="ml-4 space-y-2">
                <Text className="font-pmedium text-gray-700">
                  • We collect your Date of Birth (DOB), Gender, and Blood Group
                  as part of your membership profile.
                </Text>
                <Text className="font-pmedium text-gray-700">
                  • DOB is required to determine eligibility for different
                  retirement schemes and to plan future events, benefits, and
                  age-specific initiatives.
                </Text>
                <Text className="font-pmedium text-gray-700">
                  • Gender helps us promote diversity and representation in
                  association activities.
                </Text>
                <Text className="font-pmedium text-gray-700">
                  • Blood Group is collected to facilitate blood donation drives
                  and medical assistance initiatives.
                </Text>
              </View>
            </View>

            <View>
              <Text className="font-psemibold text-black mt-4 mb-2">
                Employment & Contact Details:
              </Text>
              <View className="ml-4 space-y-2">
                <Text className="font-pmedium text-gray-700">
                  • Your department, designation, and work location are required
                  to verify eligibility for membership.
                </Text>
                <Text className="font-pmedium text-gray-700">
                  • Your personal address, phone number, and email allow us to
                  communicate important updates.
                </Text>
              </View>
            </View>

            <View>
              <Text className="font-psemibold text-black mt-4 mb-2">
                Privacy & Data Security:
              </Text>
              <View className="ml-4 space-y-2">
                <Text className="font-pmedium text-gray-700">
                  • Your personal data is only visible to you and the authorized
                  admin.
                </Text>
                <Text className="font-pmedium text-gray-700">
                  • No data will be shared with third parties without your
                  consent.
                </Text>
              </View>
            </View>

            <View>
              <Text className="font-psemibold text-black mt-4 mb-2">
                Verification & Approval:
              </Text>
              <View className="ml-4 space-y-2">
                <Text className="font-pmedium text-gray-700">
                  • Membership is subject to verification and approval by the
                  admin.
                </Text>
                <Text className="font-pmedium text-gray-700">
                  • Inaccurate or false information may lead to rejection or
                  removal of membership.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View className="space-y-6 mt-5">
          <Checkbox
            value="agree"
            isChecked={isChecked}
            onChange={setIsChecked}
            size={isTablet ? "lg" : "md"}
          >
            <CheckboxIndicator>
              <CheckboxIcon as={Check} />
            </CheckboxIndicator>
            <CheckboxLabel
              className={`font-pmedium ${isTablet ? "text-lg" : "text-base"}`}
            >
              I agree to the terms and conditions
            </CheckboxLabel>
          </Checkbox>

          <View className="flex-row justify-end space-x-4 gap-4 mt-5">
            <Button
              variant="outline"
              onPress={onDecline}
              size={isTablet ? "xl" : "md"}
              className="flex-1"
            >
              <ButtonText className="font-psemibold">Decline</ButtonText>
            </Button>
            <Button
              onPress={onAccept}
              isDisabled={!isChecked}
              size={isTablet ? "xl" : "md"}
              className="flex-1 bg-[#5386A4]"
            >
              <ButtonText className="font-psemibold text-white">
                Continue
              </ButtonText>
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TermsConditions;
