import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import { urlFor } from "@/sanity";
import { formatDateRange } from "@/lib/utils";
import { getEvents, EventItem } from "@/lib/api/events";
import EventDetailModal from "@/components/event-detail-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientBackground from "@/components/gradient-background";
import { Spinner } from "@/components/ui";

export default function EventsScreen() {
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
              className="w-28 h-28 rounded-lg"
            />
          ) : (
            <Image
              source={{ uri: "https://via.placeholder.com/400x300" }}
              className="w-28 h-28 rounded-lg"
            />
          )}
          <View className="flex-1 ml-3">
            <Text className="text-sm font-pmedium text-gray-500">
              {formatDateRange(
                event.dateRange.startDate,
                event.dateRange.endDate,
              )}
            </Text>
            <Text className="text-lg font-psemibold mt-1" numberOfLines={2}>
              {event.title}
            </Text>
            <Text
              className="text-sm font-pregular text-gray-600 mt-1"
              numberOfLines={2}
            >
              {event.description}
            </Text>
            <Text className="text-blue-500 font-pregular text-sm mt-2">
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
      <Text className="text-xl font-semibold text-center mb-4 text-white">
        {title}
      </Text>
      {events.length > 0 ? (
        events.map((event) => <EventCard key={event._id} event={event} />)
      ) : (
        <View className="bg-white/30 backdrop-blur-md rounded-lg p-6">
          <Text className="text-center text-white text-lg">{emptyMessage}</Text>
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
              <Text className="text-3xl font-psemibold text-center text-white pt-12 mb-4">
                Events
              </Text>
              <View className="flex-1 justify-center items-center">
                <Spinner size="large" color="white" />
                <Text className="text-white text-2xl font-psemibold">
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
          <View className="flex-1 bg-transparent">
            <Text className="text-3xl font-psemibold text-center text-white pt-12 mb-4">
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
