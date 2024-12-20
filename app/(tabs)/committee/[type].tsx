import { Text, View } from "react-native";
import React, { useState } from "react";
import { queryClient } from "@/app/_layout";
import GradientBackground from "@/components/gradient-background";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import StateCommittee from "@/components/state-committee";
type CommitteeData = {
  stateCommittee: any[];
  districtCommittee: any[];
};
const CommitteeType = () => {
  const type = useLocalSearchParams<{ type: "state" | "district" }>();
  const committee = queryClient.getQueryData<CommitteeData>(["committee"]);
  const { stateCommittee, districtCommittee } = committee || {};
  if (!committee) {
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
            <View className="flex-1 items-center justify-center">
              <Text className="text-red-500 text-lg font-psemibold">
                Error: Committee data could not be loaded.
              </Text>
              <Text className="text-gray-200 text-base font-pregular">
                Please try again later.
              </Text>
            </View>
          </View>
        </GradientBackground>
      </SafeAreaView>
    );
  }

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
          {type.type === "state" ? (
            <View>
              <StateCommittee members={stateCommittee || []} />
            </View>
          ) : (
            <View>
              <Text>District Committee Members</Text>
            </View>
          )}
        </View>
      </GradientBackground>
    </SafeAreaView>
  );
};

export default CommitteeType;
