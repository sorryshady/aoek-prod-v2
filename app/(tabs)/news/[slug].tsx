import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Linking,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { sanityClient, urlFor } from "@/sanity";
import { PortableText } from "@portabletext/react-native";
import { ArrowLeft } from "lucide-react-native";
import { formatDate } from "@/lib/utils";
import GradientBackground from "@/components/gradient-background";
import { Button, ButtonText } from '@/components/ui'

type NewsItem = {
  title: string;
  image: any; // Changed from string to any to match Sanity image type
  description: string;
  content: any; // Changed from string to any to match PortableText content type
  date: string;
  fileUrl?: string;
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
        "fileUrl": file.asset->url,
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
            <Text className="text-white text-lg font-psemibold">
              Loading...
            </Text>
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
              <Text className="text-2xl font-psemibold">{news.title}</Text>

              {news.description && (
                <Text className="text-base font-pmedium text-gray-600 mt-2">
                  {news.description}
                </Text>
              )}

              {news.date && (
                <Text className="text-base font-pmedium text-gray-500 mt-2">
                  {formatDate(news.date)}
                </Text>
              )}

              {news.fileUrl && (
                <Button
                  variant="link"
                  onPress={() => Linking.openURL(news.fileUrl!)}
                >
                  <ButtonText className="text-blue-500 font-pmedium"
                    size="md">Open File</ButtonText>
                </Button>
              )}

              {news.content && <PortableText value={news.content} />}
            </View>
          </View>
        </ScrollView>
      </GradientBackground>
    </SafeAreaView>
  );
}
