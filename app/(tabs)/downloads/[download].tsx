import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { sanityClient } from "@/sanity";
import FileActions from "@/components/file-actions";
import GradientBackground from "@/components/gradient-background";
import { Spinner } from "@/components/ui";

export interface DownloadItem {
  _id: string;
  title: string;
  fileUrl: string;
  description?: string;
  dateUploaded?: string;
  fileSize?: string;
}

export default function Downloads() {
  const { download } = useLocalSearchParams<{ download: string }>();
  const [downloads, setDownloads] = useState<DownloadItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert route param to title case for display
  const categoryTitle = download
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const fetchDownloads = useCallback(async () => {
    try {
      setIsLoading(true);
      const query = `*[_type == "downloads" && category == $category] {
        _id,
        title,
        "fileUrl": file.asset->url,
        description,
        _createdAt,
        "fileSize": file.asset->size
      }`;
      const data = await sanityClient.fetch(query, { category: download });
      setDownloads(data);
    } catch (error) {
      console.error("Error fetching downloads:", error);
      setError("Failed to load downloads. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [download]);

  useEffect(() => {
    fetchDownloads();
  }, [fetchDownloads]);

  const onRefresh = useCallback(() => {
    fetchDownloads();
  }, [fetchDownloads]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1">
        <GradientBackground>
          <View className="flex-1 justify-center items-center">
            <Spinner size="large" color="white" />
            <Text className="text-white text-center font-psemibold">
              Loading...
            </Text>
          </View>
        </GradientBackground>
      </SafeAreaView>
    );
  }

  if (downloads?.length === 0) {
    return (
      <SafeAreaView className="flex-1">
        <GradientBackground>
          <ScrollView
            className="flex-1 px-3"
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
            }
          >
            <View className="flex-1 bg-transparent pt-20">
              <Text className="text-3xl font-psemibold text-center text-white mb-4">
                {categoryTitle}
              </Text>
              <View className="bg-white/10 backdrop-blur-md rounded-lg p-6">
                <Text className="text-center text-white text-lg font-psemibold">
                  No downloads available at the moment.
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
        <ScrollView
          className="flex-1 px-3"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
          }
        >
          <View className="px-4 bg-transparent pt-20">
            <Text className="text-3xl font-psemibold text-center mb-6 text-white">
              {categoryTitle}
            </Text>

            {error ? (
              <View className="bg-red-500/20 p-4 rounded-lg">
                <Text className="text-white text-center font-psemibold">
                  {error}
                </Text>
              </View>
            ) : (
              downloads?.length && (
                <View className="space-y-4">
                  {downloads.map((item) => (
                    <View
                      key={item._id}
                      className="bg-white rounded-lg p-4 shadow-lg mb-5"
                    >
                      <Text className="text-xl font-psemibold text-gray-800 mb-2">
                        {item.title}
                      </Text>

                      {item.description && (
                        <Text className="text-gray-600 font-pmedium mb-3 text-sm">
                          {item.description}
                        </Text>
                      )}

                      <View className="flex-row justify-between items-center mb-3">
                        {item.dateUploaded && (
                          <Text className="text-xs text-gray-500 font-pmedium">
                            Uploaded:{" "}
                            {new Date(item.dateUploaded).toLocaleDateString()}
                          </Text>
                        )}
                        {item.fileSize && (
                          <Text className="text-sm text-gray-500 font-pmedium">
                            Size: {Math.round(parseInt(item.fileSize) / 1024)}{" "}
                            KB
                          </Text>
                        )}
                      </View>

                      <FileActions
                        fileUrl={item.fileUrl}
                        title={item.title}
                        containerStyle="bg-primary/10 p-3 rounded-lg"
                      />
                    </View>
                  ))}
                </View>
              )
            )}
          </View>
        </ScrollView>
      </GradientBackground>
    </SafeAreaView>
  );
}
