import { Alert, Linking, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

export const requestCameraPermission = async () => {
  if (Platform.OS !== "ios") return true;

  const { status: existingStatus } =
    await ImagePicker.getCameraPermissionsAsync();

  if (existingStatus === "granted") return true;

  return new Promise((resolve) => {
    Alert.alert(
      "Camera Permission Required",
      "AOEK needs access to your camera to capture your profile photo. This photo is required for membership verification and helps ensure the authenticity of our members.",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => resolve(false),
        },
        {
          text: "Allow Camera",
          onPress: async () => {
            const { status } =
              await ImagePicker.requestCameraPermissionsAsync();
            if (status !== "granted") {
              Alert.alert(
                "Permission Denied",
                "You need to enable camera permissions in your device settings to continue with photo capture.",
                [
                  {
                    text: "Open Settings",
                    onPress: () => Linking.openSettings(),
                  },
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                ],
              );
              resolve(false);
            }
            resolve(true);
          },
        },
      ],
    );
  });
};

export const requestGalleryPermission = async () => {
  if (Platform.OS !== "ios") return true;

  const { status: existingStatus } =
    await ImagePicker.getMediaLibraryPermissionsAsync();

  if (existingStatus === "granted") return true;

  return new Promise((resolve) => {
    Alert.alert(
      "Photo Library Access Required",
      "AOEK needs access to your photo library to select your profile photo. This photo is required for membership verification and helps ensure the authenticity of our members.",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => resolve(false),
        },
        {
          text: "Allow Access",
          onPress: async () => {
            const { status } =
              await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
              Alert.alert(
                "Permission Denied",
                "You need to enable photo library access in your device settings to continue.",
                [
                  {
                    text: "Open Settings",
                    onPress: () => Linking.openSettings(),
                  },
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                ],
              );
              resolve(false);
            }
            resolve(true);
          },
        },
      ],
    );
  });
};

const resizeImage = async (uri: string) => {
  const context = await ImageManipulator.manipulate(uri)
    .resize({ width: 800, height: 800 })
    .renderAsync();
  const image = await context.saveAsync({
    base64: true,
    compress: 1,
    format: SaveFormat.WEBP,
  });
  return image.uri;
};

export const pickImage = async (setSelectedImage: (uri: string) => void) => {
  try {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const resizedUri = await resizeImage(result.assets[0].uri);
      setSelectedImage(resizedUri);
    }
  } catch (error) {
    console.error("Error picking image:", error);
    Alert.alert("Error", "Failed to pick image from gallery");
  }
};

export const takePhoto = async (setSelectedImage: (uri: string) => void) => {
  try {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      cameraType: ImagePicker.CameraType.front,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const resizedUri = await resizeImage(result.assets[0].uri);
      setSelectedImage(resizedUri);
    }
  } catch (error) {
    console.error("Error taking photo:", error);
    Alert.alert("Error", "Failed to take photo");
  }
};
