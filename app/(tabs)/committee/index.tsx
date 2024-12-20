import { ScrollView, Text, View } from "react-native";
import React from "react";
import GradientBackground from "@/components/gradient-background";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, ButtonText } from "@/components/ui";
import { router } from "expo-router";

const Committee = () => {
  return (
    <SafeAreaView className="flex-1">
      <GradientBackground>
        <View className="flex-1">
          <Text className="text-3xl font-psemibold text-center text-white pt-12 ">
            Committee Page
          </Text>
          <Text className="text-base text-gray-200 font-pregular text-center mt-2">
            Learn more about our committee members
          </Text>
          <View className="mt-10 p-4">
            <View className="bg-white rounded-lg p-4 mb-4 shadow-lg">
              <Text className="text-xl font-pbold text-center mb-2">
                State Committee Members
              </Text>
              <View className="flex-row justify-center">
                <Button
                  className="bg-[#5386A4] rounded-md"
                  onPress={() => router.push("/committee/state")}
                >
                  <ButtonText className="text-white font-psemibold">
                    View State Committee
                  </ButtonText>
                </Button>
              </View>
            </View>
            <View className="bg-white rounded-lg p-4 shadow-lg">
              <Text className="text-xl font-pbold text-center mb-2">
                District Committee Members
              </Text>
              <View className="flex-row justify-center">
                <Button
                  className="bg-[#5386A4] rounded-md"
                  onPress={() => router.push("/committee/district")}
                >
                  <ButtonText className="text-white font-psemibold">
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
