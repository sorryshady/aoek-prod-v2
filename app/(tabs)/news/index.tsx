import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Search } from "lucide-react-native";
import { sanityClient, urlFor } from "@/sanity";
import { Link, router } from "expo-router";
import { formatDate } from "@/lib/utils";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientBackground from "@/components/gradient-background";

type NewsItem = {
  title: string;
  image: any;
  description: string;
  content: string;
  date: string;
  currentSlug: string;
};

export default function NewsScreen() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const onRefresh = async () => {
    setRefreshing(true);
    await getData();
    setRefreshing(false);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const filtered = news.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredNews(filtered);
  }, [searchQuery, news]);

  async function getData() {
    try {
      const query = `*[_type == "news"]| order(_createdAt desc){
        title,
        image,
        description,
        content,
        date,
        "currentSlug": slug.current
      }`;
      const data = await sanityClient.fetch(query);
      setNews(data);
      setFilteredNews(data);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  }

  const renderNewsItem = ({ item }: { item: NewsItem }) => (
    <TouchableOpacity
      className="bg-white rounded-xl mb-4 shadow-lg w-full"
      onPress={() => router.push(`/news/${item.currentSlug}`)}
    >
      {item.image ? (
        <Image
          source={{ uri: urlFor(item.image).url() }}
          className="w-full h-48 rounded-t-xl"
          resizeMode="cover"
        />
      ) : (
        <Image
          source={{
            uri: "https://via.placeholder.com/400x300",
          }}
          className="w-full h-48 rounded-t-xl"
          resizeMode="cover"
        />
      )}
      <View className="p-4">
        <Text className="text-sm text-gray-500 mb-2 font-pmedium">
          {formatDate(item.date)}
        </Text>
        <Text
          className="text-lg font-psemibold mb-2 leading-6"
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text className="text-sm text-gray-600 font-pmedium" numberOfLines={3}>
          {item.description}
        </Text>
        <Text className="text-blue-500 text-sm mt-2 font-psemibold">
          Read More
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (news.length === 0) {
    return (
      <SafeAreaView className="flex-1">
        <GradientBackground>
          <ScrollView
            className="flex-1 px-3"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View className="flex-1 bg-transparent ">
              <Text className="text-3xl font-psemibold text-center text-white pt-12 mb-4">
                News
              </Text>
              <View className="bg-white/10 backdrop-blur-md rounded-lg p-6">
                <Text className="text-center text-white text-lg font-pregular">
                  No news articles available at the moment.
                </Text>
              </View>
            </View>
          </ScrollView>
        </GradientBackground>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <GradientBackground>
        <View className="flex-1 px-3">
          <Text className="text-3xl font-psemibold text-center text-white pt-12 mb-4">
            News
          </Text>
          <View className="flex-1 bg-transparent p-4">
            <View className="flex-row items-center bg-white/90 rounded-full mb-6 px-4 py-3 shadow-sm">
              <Search size={20} color="#4A90B9" />
              <TextInput
                className="flex-1 ml-2 text-base font-pregular"
                placeholder="Search news..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#666"
              />
            </View>

            {filteredNews.length === 0 ? (
              <View className="flex-1 justify-center items-center">
                <Text className="text-white text-lg font-pmedium text-center">
                  No news articles match your search.
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredNews}
                renderItem={renderNewsItem}
                keyExtractor={(item) => item.currentSlug}
                refreshing={refreshing}
                onRefresh={onRefresh}
                showsVerticalScrollIndicator={false}
                contentContainerClassName="pb-6"
              />
            )}
          </View>
        </View>
      </GradientBackground>
    </SafeAreaView>
  );
}
