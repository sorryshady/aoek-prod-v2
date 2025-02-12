import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  Dimensions,
} from "react-native";
import { urlFor } from "@/sanity";
import { formatDateRange } from "@/lib/utils";
import { getEvents, EventItem } from "@/lib/api/events";
import EventDetailModal from "@/components/event-detail-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientBackground from "@/components/gradient-background";
import { Spinner } from "@/components/ui";

export default function EventsScreen() {
  const width = Dimensions.get("window").width;
  const isTablet = width >= 768;
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState<{
    ongoingEvents: EventItem[];
    upcomingEvents: EventItem[];
    pastEvents: EventItem[];
  }>({
    ongoingEvents: [],
    upcomingEvents: [],
    pastEvents: [],
  });
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchEvents = async () => {
    const data = await getEvents();
    setEvents(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  }, []);

  const EventCard = ({ event }: { event: EventItem }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedEvent(event);
        setModalVisible(true);
      }}
    >
      <View className="bg-white/90 backdrop-blur-sm rounded-xl p-3 mb-4 shadow-sm">
        <View className="flex-row">
          {event.image ? (
            <Image
              source={{ uri: urlFor(event.image).url() }}
              className={`rounded-lg ${isTablet ? "w-40 h-40" : "w-28 h-28"}`}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={{ uri: "https://via.placeholder.com/400x300" }}
              className={`rounded-lg ${isTablet ? "w-40 h-40" : "w-28 h-28"}`}
              resizeMode="contain"
            />
          )}
          <View className="flex-1 ml-3">
            <Text
              className={`font-pmedium text-gray-500 ${isTablet ? "text-lg" : "text-sm"}`}
            >
              {formatDateRange(
                event.dateRange.startDate,
                event.dateRange.endDate,
              )}
            </Text>
            <Text
              className={`font-psemibold mt-1 ${isTablet ? "text-2xl" : "text-lg"}`}
              numberOfLines={2}
            >
              {event.title}
            </Text>
            <Text
              className={`font-pregular text-gray-600 mt-1 ${isTablet ? "text-xl" : "text-sm"}`}
              numberOfLines={2}
            >
              {event.description}
            </Text>
            <Text
              className={`text-blue-500 font-pregular mt-2 ${isTablet ? "text-lg" : "text-sm"}`}
            >
              Click to learn more
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const EventSection = ({
    title,
    events,
    emptyMessage,
  }: {
    title: string;
    events: EventItem[];
    emptyMessage: string;
  }) => (
    <View className="mb-6">
      <Text
        className={`text-center font-psemibold mb-4 text-white ${isTablet ? "text-4xl" : "text-xl"}`}
      >
        {title}
      </Text>
      {events.length > 0 ? (
        events.map((event) => <EventCard key={event._id} event={event} />)
      ) : (
        <View className="bg-white/30 backdrop-blur-md rounded-lg p-6">
          <Text
            className={`text-center text-white font-psemibold ${isTablet ? "text-2xl" : "text-lg"}`}
          >
            {emptyMessage}
          </Text>
        </View>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1">
        <GradientBackground>
          <View className="flex-1 px-3">
            <View className="flex-1 bg-transparent">
              <Text
                className={`font-psemibold text-center text-white pt-12 mb-4 ${isTablet ? "text-5xl" : "text-3xl"}`}
              >
                Events
              </Text>
              <View className="flex-1 justify-center items-center">
                <Spinner size="large" color="white" />
                <Text
                  className={`text-white font-psemibold ${isTablet ? "text-3xl" : "text-2xl"}`}
                >
                  Loading events...
                </Text>
              </View>
            </View>
          </View>
        </GradientBackground>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <GradientBackground>
        <View className="flex-1 px-3">
          <View
            className={`flex-1 bg-transparent ${isTablet ? "max-w-4xl w-full mx-auto" : ""}`}
          >
            <Text
              className={`font-psemibold text-center text-white pt-12 mb-4 ${isTablet ? "text-5xl" : "text-3xl"}`}
            >
              Events
            </Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingTop: 20,
                paddingHorizontal: 16,
                paddingBottom: 20,
                backgroundColor: "transparent",
              }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              <EventSection
                title="Ongoing Events"
                events={events.ongoingEvents}
                emptyMessage="No ongoing events"
              />

              <EventSection
                title="Upcoming Events"
                events={events.upcomingEvents}
                emptyMessage="No upcoming events"
              />

              <EventSection
                title="Past Events"
                events={events.pastEvents}
                emptyMessage="No past events"
              />
            </ScrollView>

            <EventDetailModal
              event={selectedEvent}
              visible={modalVisible}
              onClose={() => {
                setModalVisible(false);
                setSelectedEvent(null);
              }}
            />
          </View>
        </View>
      </GradientBackground>
    </SafeAreaView>
  );
}
