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
  Dimensions,
} from "react-native";
import { Search } from "lucide-react-native";
import { sanityClient, urlFor } from "@/sanity";
import { router } from "expo-router";
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
  const width = Dimensions.get("window").width;
  const isTablet = width >= 768;
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

  return (
    <SafeAreaView className="flex-1">
      <GradientBackground>
        <View
          className={`flex-1 ${isTablet ? "max-w-4xl w-full mx-auto" : ""}`}
        >
          <Text
            className={`text-3xl font-psemibold text-center text-white pt-12 mb-4 ${isTablet ? "text-5xl pt-8" : ""}`}
          >
            News
          </Text>
          <View className="flex-1 bg-transparent px-4">
            <View className="flex-row items-center bg-white/90 rounded-full mb-6 px-4 py-3 shadow-sm">
              <Search size={isTablet ? 24 : 20} color="#4A90B9" />
              <TextInput
                className={`flex-1 ml-2 font-pregular ${isTablet ? "text-xl" : "text-base"}`}
                placeholder="Search news..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#666"
              />
            </View>

            {filteredNews.length === 0 ? (
              <View className="flex-1 justify-center items-center">
                <Text
                  className={`text-white font-pmedium text-center ${isTablet ? "text-2xl" : "text-lg"}`}
                >
                  No news articles match your search.
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredNews}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="bg-white rounded-xl mb-4 shadow-lg w-full"
                    onPress={() => router.push(`/news/${item.currentSlug}`)}
                  >
                    {item.image ? (
                      <Image
                        source={{ uri: urlFor(item.image).url() }}
                        className={`w-full rounded-t-xl ${isTablet ? "h-72" : "h-48"}`}
                        resizeMode="cover"
                      />
                    ) : (
                      <Image
                        source={{
                          uri: "https://via.placeholder.com/400x300",
                        }}
                        className={`w-full rounded-t-xl ${isTablet ? "h-72" : "h-48"}`}
                        resizeMode="cover"
                      />
                    )}
                    <View className="p-4">
                      <Text
                        className={`text-gray-500 mb-2 font-pmedium ${isTablet ? "text-lg" : "text-sm"}`}
                      >
                        {formatDate(item.date)}
                      </Text>
                      <Text
                        className={`font-psemibold mb-2 leading-6 ${isTablet ? "text-2xl" : "text-lg"}`}
                        numberOfLines={2}
                      >
                        {item.title}
                      </Text>
                      <Text
                        className={`text-gray-600 font-pmedium ${isTablet ? "text-lg" : "text-sm"}`}
                        numberOfLines={3}
                      >
                        {item.description}
                      </Text>
                      <Text
                        className={`text-blue-500 mt-2 font-psemibold ${isTablet ? "text-lg" : "text-sm"}`}
                      >
                        Read More
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
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
