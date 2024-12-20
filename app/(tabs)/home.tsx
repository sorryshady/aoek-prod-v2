import {
  RefreshControl,
  Platform,
  ScrollView,
  Text,
  View,
  Image,
  Linking,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { sanityClient, urlFor } from "@/sanity";
import { images } from "@/constants";
import GradientBackground from "@/components/gradient-background";
import { Button, ButtonText, Spinner } from "@/components/ui";
import { router } from "expo-router";
import { formatDateRange } from "@/lib/utils";

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
const Home = () => {
  const [events, setEvents] = useState<EventItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getData = async () => {
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

  useEffect(() => {
    getData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getData();
    setRefreshing(false);
  }, []);
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
          <View className="flex-1 bg-transparent px-10 py-8">
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
          </View>
        </ScrollView>
      </GradientBackground>
    </SafeAreaView>
  );
};

export default Home;
