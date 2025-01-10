import { View, Linking } from "react-native";
import { Text } from "@/components/ui";

interface ContactAdminMessageProps {
  status: "missing" | "corrupt";
}

export function ContactAdmin({ status }: ContactAdminMessageProps) {
  const handleEmailPress = () => {
    Linking.openURL("mailto:aoekerala@gmail.com");
  };

  return (
    <View className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
      <Text className="text-lg font-psemibold text-center text-gray-800">
        Contact Admin
      </Text>
      <View>
        <Text className="text-sm text-gray-500 font-pregular mb-4">
          {status === "missing"
            ? "It seems you do not have a mobile number added to your account."
            : "Your mobile number is likely not able to receive OTP for verification."}
        </Text>
        <View className="pl-4 space-y-2">
          <Text className="text-sm font-pregular text-gray-800">
            1. Send an email to{" "}
            <Text
              className="text-blue-500 font-pmedium"
              onPress={handleEmailPress}
            >
              aoekerala@gmail.com
            </Text>
          </Text>
          <Text className="text-sm font-pregular text-gray-800">
            2. Include the following in your email:
          </Text>
          <View className="pl-4 space-y-1 mt-2">
            <Text className="text-sm font-pregular text-gray-800">
              • Full Name
            </Text>
            <Text className="text-sm font-pregular text-gray-800">
              • Membership ID
            </Text>
            <Text className="text-sm font-pregular text-gray-800">
              • Email Address
            </Text>
            <Text className="text-sm font-pregular text-gray-800">
              • Mobile Number
            </Text>
          </View>
          <Text className="text-sm font-pregular text-gray-800">
            3. Use subject line: "Update Profile for OTP Verification"
          </Text>
        </View>
      </View>
    </View>
  );
}
