import { VStack, Button, ButtonText, ButtonSpinner } from "./ui";
import { Alert, Modal, Text } from "react-native";
import { View } from "react-native";
import React, { useState } from "react";
import { uploadProfilePhoto } from "@/api/register";
import { RegisterFormData } from "@/constants/types";
import { Image } from "react-native";
import { pickImage, takePhoto } from "@/lib/image-uploads";
import ErrorAlert from "./error-alert";
import SuccessAlert from "./success-alert";
interface PhotoFormProps {
  formData: RegisterFormData;
  setFormData: (data: RegisterFormData) => void;
  error: string;
}
const PhotoForm = ({ formData, setFormData, error }: PhotoFormProps) => {
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleImageSelect = async (
    imageFunction: () => Promise<string | null>,
  ) => {
    try {
      const result = await imageFunction();
      if (result) {
        setSelectedImage(result);
        setImageModalVisible(false);
      }
    } catch (error) {
      console.error("Error selecting image:", error);
      Alert.alert("Error", "Failed to select image");
    }
  };

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      if (selectedImage) {
        const response = await uploadProfilePhoto(selectedImage, formData.name);
        setFormData({
          ...formData,
          photoUrl: response.photoUrl,
          photoId: response.photoId,
        });
        // After successful upload:
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error confirming image:", error);
      Alert.alert("Error", "Failed to upload image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedImage(null);
  };
  return (
    <View className="gap-4">
      <Text className="mb-[1rem] font-pregular">
        Upload your photo (optional)
      </Text>
      {selectedImage ? (
        <View className="items-center gap-4">
          <Image
            source={{ uri: selectedImage }}
            className="w-32 h-32 rounded-full mb-[1rem]"
            resizeMode="cover"
          />
          {!formData.photoUrl && (
            <View className="flex-row gap-4 w-full justify-center">
              <Button
                action="negative"
                onPress={handleCancel}
                className="rounded-md"
              >
                <ButtonText className="font-psemibold">Cancel</ButtonText>
              </Button>
              <Button
                action="positive"
                onPress={handleConfirm}
                className="rounded-md"
              >
                <ButtonText className="font-psemibold">
                  {isLoading ? "Uploading..." : "Confirm"}
                </ButtonText>
                {isLoading && <ButtonSpinner color="#fff" />}
              </Button>
            </View>
          )}
        </View>
      ) : (
        <View className="w-full items-center justify-center">
          <Button
            className="bg-[#5386A4] w-full rounded-md"
            onPress={() => setImageModalVisible(true)}
          >
            <ButtonText className="font-psemibold">Upload Photo</ButtonText>
          </Button>
        </View>
      )}
      {error && <ErrorAlert error={error} />}
      {success && <SuccessAlert message={"Photo uploaded successfully"} />}
      <Modal
        animationType="slide"
        transparent={true}
        visible={imageModalVisible}
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-xl font-pbold text-center mb-6">
              Select Image
            </Text>
            <View className="gap-4">
              <Button
                className="bg-[#5386A4] w-full rounded-md"
                onPress={() =>
                  handleImageSelect(async () => {
                    let uri = null;
                    await takePhoto((selectedUri) => {
                      uri = selectedUri;
                    });
                    return uri;
                  })
                }
              >
                <ButtonText className="font-psemibold">Take Photo</ButtonText>
              </Button>
              <Button
                className="bg-[#5386A4] w-full rounded-md"
                onPress={() =>
                  handleImageSelect(async () => {
                    let uri = null;
                    await pickImage((selectedUri) => {
                      uri = selectedUri;
                    });
                    return uri;
                  })
                }
              >
                <ButtonText className="font-psemibold">
                  Select from Gallery
                </ButtonText>
              </Button>
              <Button
                action="secondary"
                className="rounded-md"
                onPress={() => setImageModalVisible(false)}
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

export default PhotoForm;
