import {
  RefreshControl,
  ScrollView,
  Text,
  View,
  Image,
  Linking,
  Dimensions,
} from "react-native";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { sanityClient, urlFor } from "@/sanity";
import { images } from "@/constants";
import GradientBackground from "@/components/gradient-background";
import { Button, ButtonText, Spinner } from "@/components/ui";
import { router } from "expo-router";
import { changeTypeToText, formatDateRange } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Carousel from "react-native-reanimated-carousel";

type EventItem = {
  title: string;
  image: any;
  description: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  location: string;
  link: string;
};

type CommitteeData = {
  stateCommittee: any[]; // replace 'any' with proper type
  districtCommittee: any[]; // replace 'any' with proper type
};

const fetchCommitteeData = async (): Promise<CommitteeData> => {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/mobile/committee`,
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const SCREEN_WIDTH = Dimensions.get("window").width;

const Home = () => {
  const width = Dimensions.get("window").width;
  const [events, setEvents] = useState<EventItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const getEventData = async () => {
    try {
      const query = `*[_type == "upcomingEvent" && dateRange.startDate >= now()]{
          _id,
          title,
          dateRange,
          location,
          link,
          description,
          image,
        } | order(dateRange.startDate asc)[0]`;
      const data = await sanityClient.fetch(query);
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const { data: committeeData, isLoading: fetchingCommittee } = useQuery({
    queryKey: ["committee"],
    queryFn: fetchCommitteeData,
  });

  const { stateCommittee, districtCommittee } = committeeData || {};

  useEffect(() => {
    getEventData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getEventData();
    setRefreshing(false);
  }, []);

  const filteredCommittee =
    stateCommittee?.filter(
      (member) => member.positionState !== "EXECUTIVE_COMMITTEE_MEMBER",
    ) || [];

  return (
    <SafeAreaView className="flex-1">
      <GradientBackground>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#5386A4"
              colors={["#5386A4"]}
            />
          }
        >
          <View className="flex-1 bg-transparent px-4 py-8">
            <Image
              source={images.logo}
              className="rounded-lg mb-3 w-1/2 h-28 mx-auto"
              resizeMode="contain"
            />
            <Text className="text-center font-pbold text-4xl mb-6 text-white">
              Welcome to AOEK
            </Text>

            <Text className="text-center font-pregular text-base mb-8 leading-relaxed text-white">
              The Association of Engineers Kerala is a non-profit politically
              neutral organization representing working as well as retired
              engineers from the Public Works, Irrigation and Local Self
              Government Departments of the Government of Kerala.
            </Text>

            <View className="flex-row justify-center gap-4">
              <Button
                action="negative"
                className="flex-1 rounded-md shadow-lg"
                size="lg"
                onPress={() => router.push("/contact")}
              >
                <ButtonText className="font-psemibold">Contact Us</ButtonText>
              </Button>
              <Button
                action="default"
                className="flex-1 rounded-md shadow-lg bg-blue-500"
                size="lg"
                onPress={() => router.push("/about")}
              >
                <ButtonText className="font-psemibold">About Us</ButtonText>
              </Button>
            </View>

            <View className="mt-10">
              <Text className="text-center text-white text-3xl font-psemibold mb-6">
                Upcoming Event
              </Text>

              {isLoading ? (
                <View className="bg-slate-800/50 backdrop-blur-md rounded-xl p-4 shadow-lg items-center justify-center">
                  <Spinner color="white" size="small" />
                </View>
              ) : events ? (
                <View className="bg-white rounded-xl shadow-lg">
                  {events.image ? (
                    <Image
                      source={{ uri: urlFor(events.image).url() }}
                      className="w-full h-48 rounded-t-xl mb-2"
                      resizeMode="contain"
                    />
                  ) : (
                    <Image
                      source={{ uri: "https://via.placeholder.com/400x300" }}
                      className="w-full h-48 rounded-t-xl mb-2"
                      resizeMode="cover"
                    />
                  )}
                  <View className="p-4 pt-2 gap-1">
                    <Text className="text-black text-xl font-pbold mb-1">
                      {events.title}
                    </Text>
                    {events.link && (
                      <Button
                        variant="link"
                        size="xs"
                        className="items-start justify-start"
                        onPress={() => Linking.openURL(events.link)}
                      >
                        <ButtonText
                          className="text-blue-500 font-pmedium"
                          size="md"
                        >
                          {events.link}
                        </ButtonText>
                      </Button>
                    )}
                    <Text className="text-gray-600 mb-1 font-pmedium">
                      {events.description}
                    </Text>
                    <Text className="text-gray-600 mb-1 font-pregular">
                      <Text className="font-pbold text-gray-700">Date:</Text>{" "}
                      {formatDateRange(
                        events.dateRange.startDate,
                        events.dateRange.endDate,
                      )}
                    </Text>
                    <Text className="text-gray-600 font-pregular">
                      <Text className="font-pbold text-gray-700">
                        Location:
                      </Text>{" "}
                      {events.location || "TBA"}
                    </Text>
                  </View>
                </View>
              ) : (
                <View className="bg-slate-800/50 backdrop-blur-md rounded-xl p-4">
                  <Text className="text-base text-center font-pmedium text-white">
                    No upcoming events at the moment.
                  </Text>
                </View>
              )}
              <Text className="text-center text-white mt-4 font-pregular">
                See more events in the Events tab
              </Text>
            </View>

            <View className="mt-10">
              <Text className="text-center text-white text-3xl font-psemibold mb-6">
                State Committee
              </Text>
              {fetchingCommittee ? (
                <View className="backdrop-blur-md rounded-xl p-4 shadow-lg items-center justify-center">
                  <Spinner color="white" size="small" />
                </View>
              ) : filteredCommittee.length > 0 ? (
                <>
                  <Carousel
                    loop
                    width={width - 28}
                    height={width / 1.5}
                    autoPlay={true}
                    data={filteredCommittee}
                    scrollAnimationDuration={1000}
                    renderItem={({ item }) => (
                      <View className="bg-white rounded-md p-4 mx-2">
                        <View className="w-32 h-32 rounded-full overflow-hidden mb-4 mx-auto">
                          <Image
                            source={
                              item.photoUrl
                                ? { uri: item.photoUrl }
                                : images.member
                            }
                            className="w-full h-full"
                            resizeMode="cover"
                          />
                        </View>
                        <Text className="font-pbold text-xl text-center mb-2">
                          {item.name}
                        </Text>
                        <Text className="text-gray-700 text-center text-lg mb-1">
                          {changeTypeToText(item.positionState)}
                        </Text>
                        <Text className="text-gray-700 text-center">
                          {changeTypeToText(item.designation)}
                        </Text>
                      </View>
                    )}
                  />
                  <Button
                    className="bg-[#5386A4] rounded-md shadow-lg mx-2"
                    onPress={() => router.push("/committee")}
                  >
                    <ButtonText className="text-white font-pmedium">
                      View All
                    </ButtonText>
                  </Button>
                </>
              ) : (
                <View className="bg-slate-800/50 backdrop-blur-md rounded-xl p-4">
                  <Text className="text-base text-center font-pmedium text-white">
                    No state committee members at the moment.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </GradientBackground>
    </SafeAreaView>
  );
};

export default Home;
