import { ScrollView, Text, View, Dimensions } from "react-native";
import React from "react";
import GradientBackground from "@/components/gradient-background";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, ButtonText } from "@/components/ui";
import { router } from "expo-router";

const Committee = () => {
  const width = Dimensions.get("window").width;
  const isTablet = width >= 768;

  return (
    <SafeAreaView className="flex-1">
      <GradientBackground>
        <View
          className={`flex-1 ${isTablet ? "max-w-4xl w-full mx-auto" : ""}`}
        >
          <Text
            className={`font-psemibold text-center text-white pt-12 ${isTablet ? "text-5xl pt-8" : "text-3xl"}`}
          >
            Committee Page
          </Text>
          <Text
            className={`text-gray-200 font-pregular text-center mt-2 ${isTablet ? "text-xl" : "text-base"}`}
          >
            Learn more about our committee members
          </Text>
          <View className={`mt-10 p-4 ${isTablet ? "px-8" : ""}`}>
            <View
              className={`bg-white rounded-lg p-8 mb-4 shadow-lg ${isTablet ? "h-64" : "h-48"} flex items-center justify-center`}
            >
              <Text
                className={`font-pbold text-center mb-4 ${isTablet ? "text-3xl" : "text-xl"}`} // Increased margin bottom for more space
              >
                State Committee Members
              </Text>
              <View className="flex-row justify-center">
                <Button
                  className={`bg-[#5386A4] rounded-md ${isTablet ? "py-3 px-6" : ""}`}
                  size={isTablet ? "xl" : "md"}
                  onPress={() => router.push("/committee/state")}
                >
                  <ButtonText
                    className={`text-white font-psemibold ${isTablet ? "text-xl" : ""}`}
                  >
                    View State Committee
                  </ButtonText>
                </Button>
              </View>
            </View>
            <View
              className={`bg-white rounded-lg p-8 mb-4 shadow-lg ${isTablet ? "h-64" : "h-48"} flex items-center justify-center`}
            >
              <Text
                className={`font-pbold text-center mb-4 ${isTablet ? "text-3xl" : "text-xl"}`} // Increased margin bottom for more space
              >
                District Committee Members
              </Text>
              <View className="flex-row justify-center">
                <Button
                  className={`bg-[#5386A4] rounded-md ${isTablet ? "py-3 px-6" : ""}`}
                  size={isTablet ? "xl" : "md"}
                  onPress={() => router.push("/committee/district")}
                >
                  <ButtonText
                    className={`text-white font-psemibold ${isTablet ? "text-xl" : ""}`}
                  >
                    View District Committee
                  </ButtonText>
                </Button>
              </View>
            </View>
          </View>
        </View>
      </GradientBackground>
    </SafeAreaView>
  );
};

export default Committee;
