import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { images } from "@/constants";
import { updateProfilePhoto } from "@/api/user";
import { pickImage, takePhoto } from "@/lib/image-uploads";
import { Camera } from "lucide-react-native";
import { Button, ButtonText } from "./ui";

interface ProfileImagePickerProps {
  currentPhotoUrl: string | null;
  onImageSelected: (imageUri: string) => void;
  name: string;
  createdAt: string;
  isTablet?: boolean;
}

const ProfileImagePicker = ({
  currentPhotoUrl,
  onImageSelected,
  name,
  createdAt,
  isTablet,
}: ProfileImagePickerProps) => {
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const closeModal = () => {
    setImageModalVisible(false);
    setSelectedImage(null);
  };

  const confirmImage = async () => {
    if (selectedImage) {
      try {
        setIsLoading(true);
        const result = await updateProfilePhoto(selectedImage, name || "user");
        if (result.error) {
          Alert.alert("Error", result.error);
        }
        onImageSelected(result?.photoUrl);
        setImageModalVisible(false);
        setSelectedImage(null);
      } catch (error) {
        Alert.alert("Error", "Failed to update profile picture");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <View className="items-center mb-8">
      <View className="relative">
        <Image
          source={
            selectedImage
              ? { uri: selectedImage }
              : currentPhotoUrl
                ? { uri: currentPhotoUrl }
                : images.member
          }
          className={`rounded-full bg-gray-300 ${
            isTablet ? "w-40 h-40" : "w-32 h-32"
          }`}
        />
        <TouchableOpacity
          className="absolute bottom-0 right-0 bg-white p-2 rounded-full "
          onPress={() => setImageModalVisible(true)}
        >
          <Camera color="black" size={isTablet ? 24 : 20} />
        </TouchableOpacity>
      </View>
      <Text
        className={`text-white font-pbold mt-4 ${isTablet ? "text-3xl" : "text-2xl"}`}
      >
        {name}
      </Text>
      <Text
        className={`text-gray-300 font-pregular ${isTablet ? "text-lg" : "text-sm"}`}
      >
        Member since {new Date(createdAt).getFullYear()}
      </Text>

      {/* Image Picker Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={imageModalVisible}
        onRequestClose={closeModal}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <Text
              className={`${isTablet ? "text-3xl" : "text-xl"} font-pbold text-center mb-6`}
            >
              Select Image
            </Text>
            <View className="gap-4">
              <Button
                className="bg-[#5386A4] w-full rounded-md"
                onPress={() => takePhoto(setSelectedImage)}
                size={isTablet ? "xl" : "md"}
              >
                <ButtonText className="font-psemibold">Take Photo</ButtonText>
              </Button>
              <Button
                className="bg-[#5386A4] w-full rounded-md"
                onPress={() => pickImage(setSelectedImage)}
                size={isTablet ? "xl" : "md"}
              >
                <ButtonText className="font-psemibold">
                  Select from Gallery
                </ButtonText>
              </Button>
              {selectedImage && (
                <Button
                  isDisabled={isLoading}
                  className="bg-green-500 w-full rounded-md"
                  onPress={confirmImage}
                  size={isTablet ? "xl" : "md"}
                >
                  <ButtonText className="font-psemibold">
                    {isLoading ? "Updating..." : "Confirm"}
                  </ButtonText>
                </Button>
              )}
              <Button
                className="rounded-md"
                action="secondary"
                onPress={closeModal}
                size={isTablet ? "xl" : "md"}
              >
                <ButtonText className="font-psemibold">Cancel</ButtonText>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileImagePicker;
