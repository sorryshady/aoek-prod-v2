import {
  ScrollView,
  Text,
  View,
  Platform,
  Linking,
  Dimensions,
} from "react-native";
import GradientBackground from "@/components/gradient-background";
import { send } from "@emailjs/react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
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
  const width = Dimensions.get("window").width;
  const isTablet = width >= 768;

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
      setIsSending(true);
      if (validateForm()) {
        console.log("Form is valid: ", formData);
        const { name, email, message } = formData;
        const params = {
          user_name: name,
          user_email: email,
          user_message: message,
        };
        const result = await send(serviceId!, templateId!, params, {
          publicKey: userId,
        });
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
          <View
            className={`flex-1 ${isTablet ? "max-w-4xl mx-auto w-full" : ""}`}
          >
            {/* Header Section */}
            <View className="pt-8">
              <Text
                className={`text-3xl font-pbold text-white text-center ${isTablet ? "text-5xl" : ""}`}
              >
                Contact Us
              </Text>
              <Text
                className={`text-base text-gray-200 font-pmedium text-center mt-2 ${isTablet ? "text-xl" : ""}`}
              >
                Let&apos;s get in touch
              </Text>
            </View>

            <View className="gap-4 bg-white rounded-lg p-4 mt-8">
              <FormControl isInvalid={!!errors.name}>
                <FormControlLabel>
                  <FormControlLabelText
                    className={`font-pmedium ${isTablet ? "text-xl" : ""}`}
                  >
                    Name
                  </FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    value={formData.name}
                    onChangeText={(value) => handleChange("name", value)}
                    className={`font-pregular ${isTablet ? "text-lg py-4" : ""}`}
                    placeholder="Enter your name"
                  />
                </Input>
                {errors.name && (
                  <FormControlError>
                    <FormControlErrorText
                      className={`font-pregular ${isTablet ? "text-lg" : ""}`}
                    >
                      {errors.name}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.email}>
                <FormControlLabel>
                  <FormControlLabelText
                    className={`font-pmedium ${isTablet ? "text-xl" : ""}`}
                  >
                    Email
                  </FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    value={formData.email}
                    onChangeText={(value) => handleChange("email", value)}
                    className={`font-pregular ${isTablet ? "text-lg py-4" : ""}`}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                  />
                </Input>
                {errors.email && (
                  <FormControlError>
                    <FormControlErrorText
                      className={`font-pregular ${isTablet ? "text-lg" : ""}`}
                    >
                      {errors.email}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.message}>
                <FormControlLabel>
                  <FormControlLabelText
                    className={`font-pmedium ${isTablet ? "text-xl" : ""}`}
                  >
                    Message
                  </FormControlLabelText>
                </FormControlLabel>
                <Textarea>
                  <TextareaInput
                    value={formData.message}
                    onChangeText={(value) => handleChange("message", value)}
                    className={`font-pregular ${isTablet ? "text-lg py-4" : ""}`}
                    placeholder="Enter your message"
                  />
                </Textarea>
                {errors.message && (
                  <FormControlError>
                    <FormControlErrorText
                      className={`font-pregular ${isTablet ? "text-lg" : ""}`}
                    >
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
                size={isTablet ? "xl" : "md"}
                onPress={handleSubmit}
              >
                <ButtonText
                  className={`font-psemibold ml-2 ${isTablet ? "text-xl" : ""}`}
                >
                  {isSending ? "Sending..." : "Send Message"}
                </ButtonText>
                {isSending && (
                  <ButtonSpinner
                    size={isTablet ? "large" : "small"}
                    color="white"
                  />
                )}
              </Button>
            </View>
            <View className="my-6">
              <Text className="text-white text-center text-base font-psemibold">
                Get Directions
              </Text>
              <Button
                onPress={openInMaps}
                className="mt-4 rounded-md bg-[#5386A4] w-full"
                size={isTablet ? "xl" : "md"}
              >
                <ButtonIcon
                  as={MapPin}
                  color="white"
                  size={isTablet ? "lg" : "sm"}
                />
                <ButtonText
                  className={`font-psemibold ml-2 ${isTablet ? "text-xl" : ""}`}
                >
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
