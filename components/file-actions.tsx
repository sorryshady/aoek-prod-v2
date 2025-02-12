import { Alert, Platform, View } from "react-native";
import React from "react";
import * as FileSystem from "expo-file-system";
import * as Linking from "expo-linking";
import { shareAsync } from "expo-sharing";
import { Eye, Download, Share } from "lucide-react-native";
import { Button, ButtonIcon, ButtonText } from "./ui";

interface Props {
  fileUrl: string;
  title: string;
  containerStyle?: string;
  isTablet?: boolean;
}

const FileActions = ({ fileUrl, title, containerStyle, isTablet }: Props) => {
  const handleDownload = async () => {
    try {
      const result = await FileSystem.downloadAsync(
        fileUrl,
        FileSystem.documentDirectory + title + ".pdf",
      );
      await saveFile(result.uri, title);
    } catch (error) {
      console.error("Download failed:", error);
      Alert.alert("Error", "Failed to download file. Please try again.");
    }
  };

  const saveFile = async (uri: string, filename: string) => {
    try {
      if (Platform.OS === "android") {
        const permissions =
          await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

        if (permissions.granted) {
          const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          try {
            const fileUri =
              await FileSystem.StorageAccessFramework.createFileAsync(
                permissions.directoryUri,
                filename,
                "application/pdf",
              );

            await FileSystem.writeAsStringAsync(fileUri, base64, {
              encoding: FileSystem.EncodingType.Base64,
            });

            Alert.alert(
              "Success",
              "File saved successfully",
              [{ text: "OK", onPress: () => {} }],
              { cancelable: false },
            );
          } catch (e) {
            console.error("Error saving file:", e);
            await shareAsync(uri);
          }
        } else {
          await shareAsync(uri);
        }
      } else {
        await shareAsync(uri);
      }
    } catch (error) {
      console.error("Save failed:", error);
      Alert.alert("Error", "Failed to save file. Please try again.");
    }
  };

  const handleShare = async () => {
    try {
      const result = await FileSystem.downloadAsync(
        fileUrl,
        FileSystem.documentDirectory + title + ".pdf",
      );
      await shareAsync(result.uri);
    } catch (error) {
      console.error("Share failed:", error);
      Alert.alert("Error", "Failed to share file. Please try again.");
    }
  };

  return (
    <View className={`flex-row justify-between gap-2 ${containerStyle}`}>
      <Button
        variant="outline"
        size={isTablet ? "xl" : "sm"}
        className="border-[#5386A4] rounded-md"
        onPress={() => Linking.openURL(fileUrl)}
      >
        <ButtonText className="text-[#5386A4] font-psemibold">View</ButtonText>
        <ButtonIcon as={Eye} color="#5386A4" size={isTablet ? "xl" : "sm"} />
      </Button>
      <Button
        size={isTablet ? "xl" : "sm"}
        onPress={handleDownload}
        className="bg-[#5386A4] rounded-md"
      >
        <ButtonText className="font-psemibold">Download</ButtonText>
        <ButtonIcon as={Download} size={isTablet ? "xl" : "sm"} />
      </Button>

      <Button
        variant="outline"
        size={isTablet ? "xl" : "sm"}
        onPress={handleShare}
        className="border-[#5386A4] rounded-md"
      >
        <ButtonText className="text-[#5386A4] font-psemibold">Share</ButtonText>
        <ButtonIcon as={Share} color="#5386A4" size={isTablet ? "xl" : "sm"} />
      </Button>
    </View>
  );
};

export default FileActions;
