import { Text, View, SafeAreaView } from "react-native";
import { router } from "expo-router";
import GradientBackground from "@/components/gradient-background";
import { Button, ButtonText } from "@/components/ui";
import { Dimensions } from "react-native";

const Downloads = () => {
  const width = Dimensions.get("window").width;
  const isTablet = width >= 768;

  const categories = [
    {
      title: "Technical Writing",
      value: "technical-writing",
    },
    {
      title: "Circulars and Orders",
      value: "circulars-and-orders",
    },
    {
      title: "Election Nomination",
      value: "election-nomination",
    },
    {
      title: "IS Code",
      value: "is-code",
    },
    {
      title: "IRC Code",
      value: "irc-code",
    },
    {
      title: "Handbooks",
      value: "handbooks",
    },
    {
      title: "Draft Electoral Roll",
      value: "draft-electoral-roll",
    },
    {
      title: "Others",
      value: "others",
    },
  ];

  const DownloadCard = ({ item }: { item: (typeof categories)[0] }) => (
    <View
      className={`w-[48%] bg-white rounded-lg p-4 m-1 shadow-lg justify-between ${isTablet ? "p-6" : ""}`}
    >
      <Text
        className={`text-black font-psemibold text-center mb-2 ${isTablet ? "text-2xl" : "text-base"}`}
        numberOfLines={2}
      >
        {item.title}
      </Text>
      <View className="w-full flex-row justify-center">
        <Button
          onPress={() => router.push(`/downloads/${item.value}`)}
          className={`bg-[#5386A4] mt-[1rem] rounded-md ${isTablet ? "py-3 px-6" : ""}`}
          size={isTablet ? "xl" : "md"}
        >
          <ButtonText className={`font-psemibold ${isTablet ? "text-lg" : ""}`}>
            View More
          </ButtonText>
        </Button>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1">
      <GradientBackground>
        <View className={`flex-1 ${isTablet ? "max-w-4xl mx-auto" : ""}`}>
          <Text
            className={`font-psemibold text-center text-white pt-12 mb-4 ${isTablet ? "text-5xl pt-8" : "text-3xl"}`}
          >
            Downloads
          </Text>
          <View className="flex-1 bg-transparent">
            <View className="px-2 flex-row flex-wrap justify-between gap-y-1 mt-5">
              {categories.map((item) => (
                <DownloadCard key={item.title} item={item} />
              ))}
            </View>
          </View>
        </View>
      </GradientBackground>
    </SafeAreaView>
  );
};

export default Downloads;
