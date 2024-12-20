import { ScrollView, Text, View, Platform, Linking } from "react-native";
import GradientBackground from "@/components/gradient-background";
import emailjs from "@emailjs/browser";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  ButtonIcon,
  ButtonText,
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  Textarea,
  TextareaInput,
} from "@/components/ui";
import { useState } from "react";
import { isValidEmail } from "@/lib/utils";
import ErrorAlert from "@/components/error-alert";
import SuccessAlert from "@/components/success-alert";
import MapView, { Marker } from "react-native-maps";
import { MapPin } from "lucide-react-native";

type FormData = {
  name: string;
  email: string;
  message: string;
};
type FormErrors = {
  name?: string;
  email?: string;
  message?: string;
};
const serviceId = process.env.EXPO_PUBLIC_SERVICE_ID;
const templateId = process.env.EXPO_PUBLIC_TEMPLATE_ID;
const userId = process.env.EXPO_PUBLIC_EMAIL_ID;

export default function Contact() {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [key]: value });
    if (errors[key]) setErrors({ ...errors, [key]: undefined });
  };
  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async () => {
    try {
      if (validateForm()) {
        console.log("Form is valid: ", formData);
        const { name, email, message } = formData;
        const params = {
          user_name: name,
          user_email: email,
          user_message: message,
        };
        const result = await emailjs.send(
          serviceId!,
          templateId!,
          params,
          userId,
        );
        if (result.status === 200) {
          setSuccess("Message has been sent successfully");
          setFormData({ name: "", email: "", message: "" });
          setTimeout(() => {
            setSuccess(null);
          }, 5000);
        } else {
          setError("Failed to send message. Please try again.");
          setTimeout(() => {
            setError(null);
          }, 5000);
        }
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setError("An unexpected error occurred");
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setIsSending(false);
    }
  };
  const openInMaps = () => {
    const latitude = "8.508888512667932";
    const longitude = "76.94919831630524";
    const label = "Association of Engineers Kerala";

    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${latitude},${longitude}`;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <GradientBackground>
        <ScrollView
          className="flex-1 px-4 pt-6 pb-0"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <View className="px-4 py-10 gap-8">
            {/* Header Section */}
            <View>
              <Text className="text-3xl font-pbold text-white text-center">
                Contact Us
              </Text>
              <Text className="text-base text-gray-200 font-pregular text-center mt-2">
                Let&apos;s get in touch
              </Text>
            </View>
            <View className=" gap-4 bg-white rounded-lg p-4">
              <FormControl isInvalid={!!errors.name}>
                <FormControlLabel>
                  <FormControlLabelText className="font-pmedium">
                    Name
                  </FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    value={formData.name}
                    onChangeText={(value) => handleChange("name", value)}
                    className="font-pregular"
                    placeholder="Enter your name"
                  />
                </Input>
                {errors.name && (
                  <FormControlError>
                    <FormControlErrorText className="font-pregular">
                      {errors.name}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.email}>
                <FormControlLabel>
                  <FormControlLabelText className="font-pmedium">
                    Email
                  </FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    value={formData.email}
                    onChangeText={(value) => handleChange("email", value)}
                    className="font-pregular"
                    placeholder="Enter your email"
                    keyboardType="email-address"
                  />
                </Input>
                {errors.email && (
                  <FormControlError>
                    <FormControlErrorText className="font-pregular">
                      {errors.email}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.message}>
                <FormControlLabel>
                  <FormControlLabelText className="font-pmedium">
                    Message
                  </FormControlLabelText>
                </FormControlLabel>
                <Textarea>
                  <TextareaInput
                    value={formData.message}
                    onChangeText={(value) => handleChange("message", value)}
                    className="font-pregular"
                    placeholder="Enter your message"
                  />
                </Textarea>
                {errors.message && (
                  <FormControlError>
                    <FormControlErrorText className="font-pregular">
                      {errors.message}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              {error && <ErrorAlert error={error} />}
              {success && <SuccessAlert message={success} />}
              <Button
                className="rounded-md"
                isDisabled={isSending}
                action="negative"
                onPress={handleSubmit}
              >
                <ButtonText className="font-psemibold">
                  {isSending ? "Sending..." : "Send Message"}
                </ButtonText>
              </Button>
            </View>
            <View className="mb-6">
              <View className="h-96 w-full rounded-lg overflow-hidden">
                <MapView
                  style={{ flex: 1 }}
                  region={{
                    latitude: 8.508888512667932,
                    longitude: 76.94919831630524,
                    latitudeDelta: 0.002,
                    longitudeDelta: 0.002,
                  }}
                  scrollEnabled={false}
                  pitchEnabled={false}
                  rotateEnabled={false}
                  zoomEnabled={true}
                  zoomControlEnabled={true}
                  loadingEnabled={true}
                  showsUserLocation={false}
                  toolbarEnabled={false}
                  moveOnMarkerPress={false}
                >
                  <Marker
                    coordinate={{
                      latitude: 8.508888512667932,
                      longitude: 76.94919831630524,
                    }}
                    title="Association of Engineers"
                    description="Association of Engineers Kerala"
                  />
                </MapView>
              </View>
              <Button
                onPress={openInMaps}
                className="mt-4 rounded-md bg-[#5386A4] w-full"
              >
                <ButtonIcon as={MapPin} color="white" />
                <ButtonText className="font-psemibold ml-2">
                  Open in Maps
                </ButtonText>
              </Button>
            </View>
          </View>
        </ScrollView>
      </GradientBackground>
    </SafeAreaView>
  );
}
