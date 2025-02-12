import { UserDetails } from "@/app/(auth)/sign-in";
import { View, Image, Text } from "react-native";

interface UserProfileProps {
  user: UserDetails;
  isTablet: boolean;
}

export default function UserProfile({ user, isTablet }: UserProfileProps) {
  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <View className="items-center mb-6">
      <View className="mb-4">
        {user.photoUrl ? (
          <Image
            source={{ uri: user.photoUrl }}
            className={`w-24 h-24 rounded-full ${isTablet ? "w-28 h-28" : ""} border-2 border-[#000]`}
            resizeMode="cover"
          />
        ) : (
          <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center">
            <Text
              className={`text-2xl font-psemibold text-gray-600 ${isTablet ? "text-3xl" : ""}`}
            >
              {getInitial(user.name)}
            </Text>
          </View>
        )}
      </View>
      <Text
        className={`text-lg font-pmedium text-gray-800 ${isTablet ? "text-xl" : ""}`}
      >
        {user.name}
      </Text>
    </View>
  );
}
