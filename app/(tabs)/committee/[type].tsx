import { Text, View, Dimensions } from "react-native";
import React, { useState } from "react";
import { queryClient } from "@/app/_layout";
import GradientBackground from "@/components/gradient-background";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import StateCommittee from "@/components/state-committee";
import DistrictCommittee from "@/components/district-committee";

type CommitteeData = {
  stateCommittee: any[];
  districtCommittee: any[];
};

const CommitteeType = () => {
  const width = Dimensions.get("window").width;
  const isTablet = width >= 768;
  const type = useLocalSearchParams<{ type: "state" | "district" }>();
  const committee = queryClient.getQueryData<CommitteeData>(["committee"]);
  const { stateCommittee, districtCommittee } = committee || {};

  if (!committee) {
    return (
      <SafeAreaView className="flex-1">
        <GradientBackground>
          <View className={`flex-1 ${isTablet ? "max-w-4xl mx-auto" : ""}`}>
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
            <View className="flex-1 items-center justify-center">
              <Text
                className={`text-red-500 font-psemibold ${isTablet ? "text-2xl" : "text-lg"}`}
              >
                Error: Committee data could not be loaded.
              </Text>
              <Text
                className={`text-gray-200 font-pregular ${isTablet ? "text-xl" : "text-base"}`}
              >
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
        <View
          className={`flex-1 ${isTablet ? "max-w-4xl w-full mx-auto" : ""}`}
        >
          <Text
            className={`font-psemibold text-center text-white pt-12 ${isTablet ? "text-5xl pt-8" : "text-3xl"}`}
          >
            {type.type === "state" ? "State" : "District"} Committee Page
          </Text>
          <Text
            className={`text-gray-200 font-pregular text-center mt-2 ${isTablet ? "text-xl" : "text-base"}`}
          >
            Learn more about our {type.type === "state" ? "State" : "District"}{" "}
            committee members
          </Text>
          {type.type === "state" ? (
            <View className={isTablet ? "px-4" : ""}>
              <StateCommittee members={stateCommittee || []} isTablet={isTablet} />
            </View>
          ) : (
            <View className={isTablet ? "px-4" : ""}>
              <DistrictCommittee
                members={districtCommittee || []}
                isTablet={isTablet}
              />
            </View>
          )}
        </View>
      </GradientBackground>
    </SafeAreaView>
  );
};

export default CommitteeType;
