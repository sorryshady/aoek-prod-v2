import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientBackground from "@/components/gradient-background";
import { images } from "@/constants";
import { router, useLocalSearchParams } from "expo-router";
import { fetchSecurityQuestion } from "@/api/forgot-password";
import ErrorAlert from "@/components/error-alert";
import SecurityQuestionForm from "@/components/security-question-form";

const ForgotPassword = () => {
  const { userId }: { userId: string } = useLocalSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<{
    id: string;
    name: string;
    securityQuestion: string;
  } | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (userId) {
          const response = await fetchSecurityQuestion(userId);
          if (response?.error) {
            setError(response.error);
          } else {
            setUserDetails(response?.user);
          }
        } else {
          setError("User ID is required");
        }
      } catch (error) {
        setError("Something went wrong");
      }
    };
    fetchUserDetails();
  }, [userId]);

  return (
    <SafeAreaView className="flex-1 h-full relative">
      <GradientBackground>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 47 : 0}
          className="flex-1"
          style={{ position: "relative" }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-1 px-4 items-center mt-10">
              <View className="w-full max-w-[400px]">
                <View className="bg-white rounded-2xl w-full gap-5 relative mb-[5rem]">
                  <Image
                    source={images.background}
                    className="w-full h-full absolute opacity-10"
                    resizeMode="cover"
                  />
                  <View className="p-6">
                    <Text className="text-black text-center font-psemibold text-2xl mb-6">
                      Forgot Password
                    </Text>
                    <View className="text-center gap-4">
                      {userDetails ? (
                        <Text className="text-black text-base font-psemibold">
                          Hi{" "}
                          <Text className="text-primary font-psemibold">
                            {userDetails.name}
                          </Text>
                          , please answer your security question to reset your
                          password.
                        </Text>
                      ) : (
                        <Text className="text-black text-base font-psemibold text-center">
                          Loading user details, please wait...
                        </Text>
                      )}
                      {error && <ErrorAlert error={error} />}
                      {userDetails && (
                        <SecurityQuestionForm
                          userDetails={userDetails}
                          onBack={() => router.push("/sign-in")}
                        />
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </GradientBackground>
    </SafeAreaView>
  );
};

export default ForgotPassword;
