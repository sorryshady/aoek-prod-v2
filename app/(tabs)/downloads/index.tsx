import {
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Link, router } from "expo-router";
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
      title: "Others",
      value: "others",
    },
  ];

  const DownloadCard = ({ item }: { item: (typeof categories)[0] }) => (
    <View className="w-[48%] bg-white rounded-lg p-4 m-1 shadow-lg">
      <Text
        className="text-black text-base font-pregular text-center mb-2"
        numberOfLines={2}
      >
        {item.title}
      </Text>
      <View className="w-full flex-row justify-center">
        <Button
          onPress={() => router.push(`/downloads/${item.value}`)}
          className="bg-[#5386A4] mt-[1rem] rounded-md"
        >
          <ButtonText>View More</ButtonText>
        </Button>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1">
      <GradientBackground>
        <View className="flex-1">
          <Text className="text-3xl font-pbold text-center text-white pt-12 mb-4 ">
            Downloads
          </Text>
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: 20,
            }}
          >
            <View className="px-2 flex-row flex-wrap justify-between gap-y-1 mt-10">
              {categories.map((item) => (
                <DownloadCard key={item.title} item={item} />
              ))}
            </View>
          </ScrollView>
        </View>
      </GradientBackground>
    </SafeAreaView>
  );
};

export default Downloads;
