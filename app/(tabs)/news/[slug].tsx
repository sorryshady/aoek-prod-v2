import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { sanityClient, urlFor } from "@/sanity";
import { PortableText } from "@portabletext/react-native";
import { ArrowLeft } from "lucide-react-native";
import { formatDate } from "@/lib/utils";
import GradientBackground from "@/components/gradient-background";

type NewsItem = {
  title: string;
  image: any; // Changed from string to any to match Sanity image type
  description: string;
  content: any; // Changed from string to any to match PortableText content type
  date: string;
  currentSlug: string;
};

export default function NewsDetailScreen() {
  const { slug } = useLocalSearchParams();
  const [news, setNews] = useState<NewsItem | null>(null);
  const router = useRouter();

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const query = `*[_type == "news" && slug.current == "${slug}"] {
        title,
        image,
        description,
        content,
        date,
        "currentSlug": slug.current
      }[0]`;
      const data = await sanityClient.fetch(query);
      setNews(data);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  }

  if (!news) {
    return (
      <SafeAreaView className="flex-1">
        <GradientBackground>
          <View className="flex-1 items-center justify-center">
            <Text className="text-white text-lg">Loading...</Text>
          </View>
        </GradientBackground>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <GradientBackground>
        <View className="flex-row items-center justify-between mb-5 px-5 py-5">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="px-5">
          <View className="bg-white rounded-lg space-y-4 mb-4">
            {news.image && (
              <Image
                source={{ uri: urlFor(news.image).url() }}
                className="w-full h-[20rem] rounded-t-lg"
                resizeMode="cover"
              />
            )}
            <View className="p-4">
              <Text className="text-3xl font-pbold">{news.title}</Text>

              {news.description && (
                <Text className="text-base font-medium text-gray-600 mt-2">
                  {news.description}
                </Text>
              )}

              {news.date && (
                <Text className="text-base font-medium text-gray-500 mt-2">
                  {formatDate(news.date)}
                </Text>
              )}

              {news.content && <PortableText value={news.content} />}
            </View>
          </View>
        </ScrollView>
      </GradientBackground>
    </SafeAreaView>
  );
}
