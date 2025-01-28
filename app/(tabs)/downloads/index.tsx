import { Text, View, SafeAreaView } from "react-native";
import { router } from "expo-router";
import GradientBackground from "@/components/gradient-background";
import { Button, ButtonText } from "@/components/ui";

const Downloads = () => {
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
    <View className="w-[48%] bg-white rounded-lg p-4 m-1 shadow-lg justify-between">
      <Text
        className="text-black text-base font-psemibold text-center mb-2"
        numberOfLines={2}
      >
        {item.title}
      </Text>
      <View className="w-full flex-row justify-center">
        <Button
          onPress={() => router.push(`/downloads/${item.value}`)}
          className="bg-[#5386A4] mt-[1rem] rounded-md"
        >
          <ButtonText className="font-psemibold">View More</ButtonText>
        </Button>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1">
      <GradientBackground>
        <View className="flex-1">
          <View className="flex-1 bg-transparent pt-20">
            <Text className="text-3xl font-psemibold text-center text-white mb-4">
              Downloads
            </Text>
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
