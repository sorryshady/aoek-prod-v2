import {
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
} from "react-native";
import { EventItem } from "@/lib/api/events";
import { urlFor } from "@/sanity";
import { formatDateRange } from "@/lib/utils";
import { AntDesign } from "@expo/vector-icons";
import { X } from "lucide-react-native";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  Button,
  ButtonText,
  Heading,
} from "./ui";

type EventDetailModalProps = {
  event: EventItem | null;
  visible: boolean;
  onClose: () => void;
};

export default function EventDetailModal({
  event,
  visible,
  onClose,
}: EventDetailModalProps) {
  if (!event) return null;

  const CloseIcon = () => {
    if (Platform.OS === "ios") {
      return <X size={24} color="white" />;
    }
    return <AntDesign name="close" size={24} color="white" />;
  };

  return (
    <AlertDialog isOpen={visible} onClose={onClose} size="lg">
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Heading className="text-typography-950 font-psemibold" size="md">
            Event Details
          </Heading>
        </AlertDialogHeader>
        <AlertDialogBody>
          <View className="flex-1 justify-end mt-[1rem]">
            <View className="bg-white shadow-lg overflow-hidden">
              <ScrollView showsVerticalScrollIndicator={false}>
                {event.image ? (
                  <Image
                    source={{ uri: urlFor(event.image).url() }}
                    className="w-full h-64"
                    resizeMode="contain"
                  />
                ) : (
                  <Image
                    source={{ uri: "https://via.placeholder.com/400x300" }}
                    className="w-full h-64"
                    resizeMode="contain"
                  />
                )}
                <View className="py-2 gap-2">
                  <Text className="text-2xl font-pbold text-gray-900">
                    {event.title}
                  </Text>

                  <Text className="text-base text-gray-600">
                    <Text className="font-psemibold text-gray-900">Date: </Text>
                    {formatDateRange(
                      event.dateRange.startDate,
                      event.dateRange.endDate,
                    )}
                  </Text>

                  <Text className="text-base text-gray-600">
                    <Text className="font-psemibold text-gray-900">
                      Location:{" "}
                    </Text>
                    {event.location || "TBA"}
                  </Text>

                  {event.description && (
                    <Text className="text-base font-pmedium text-gray-600">
                      {event.description}
                    </Text>
                  )}

                  {event.link && (
                    <Button
                      variant="link"
                      size="xs"
                      onPress={() => Linking.openURL(event.link!)}
                      className="mt-2 justify-start"
                    >
                      <ButtonText
                        className="text-blue-500 font-pmedium"
                        size="md"
                      >
                        {event.link}
                      </ButtonText>
                    </Button>
                  )}
                </View>
              </ScrollView>
              <Button
                onPress={onClose}
                className="mt-4 rounded-md"
                action="secondary"
              >
                <ButtonText className="font-psemibold">Close</ButtonText>
              </Button>
            </View>
          </View>
        </AlertDialogBody>
      </AlertDialogContent>
    </AlertDialog>
  );
}
