import GradientBackground from "@/components/gradient-background";
import React from "react";
import { Dimensions, View, Text, Linking, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, ButtonText, HStack } from "@/components/ui";
import { images } from "@/constants";
import { router } from "expo-router";

const Register = () => {
  const width = Dimensions.get("window").width;
  const isTablet = width >= 768;

  const handleOpenWebsite = () => {
    Linking.openURL("https://aoek.org/register");
  };

  return (
    <SafeAreaView className="flex-1">
      <GradientBackground>
        <View className="flex-1 px-4 items-center justify-center">
          <View
            className={`w-full ${isTablet ? "max-w-[500px]" : "max-w-[400px]"}`}
          >
            <View className="bg-white rounded-2xl w-full gap-5 relative my-6">
              <Image
                source={images.background}
                className="w-full h-full absolute opacity-10"
                resizeMode="cover"
              />
              <View className="p-6">
                <Text
                  className={`text-black text-center font-psemibold ${isTablet ? "text-4xl" : "text-xl"} mb-6`}
                >
                  Registration Information
                </Text>

                <Text
                  className={`font-pmedium text-black text-center ${isTablet ? "text-xl" : "text-base"}`}
                >
                  Registration is currently only available through our website.
                </Text>

                <Text
                  className={`font-pmedium text-black text-center mt-4 mb-8 ${isTablet ? "text-xl" : "text-base"}`}
                >
                  Once you complete the registration process, our admin team
                  will verify your details. After verification, you'll be able
                  to login to the mobile app.
                </Text>

                <Button
                  onPress={handleOpenWebsite}
                  className={`bg-[#5386A4] rounded-md w-full items-center justify-center ${isTablet ? "py-4" : ""}`}
                >
                  <ButtonText
                    className={`text-white font-psemibold text-center mx-auto ${isTablet ? "text-xl" : ""}`}
                  >
                    Register on Website
                  </ButtonText>
                </Button>

                <HStack space="sm" className="justify-center items-center mt-6">
                  <Text
                    className={`font-pmedium ${isTablet ? "text-xl" : "text-base"}`}
                  >
                    Already have an account?
                  </Text>
                  <Button
                    variant="link"
                    onPress={() => router.push("/sign-in")}
                    size={isTablet ? "lg" : "md"}
                  >
                    <ButtonText className="text-blue-500 font-psemibold">
                      Sign in
                    </ButtonText>
                  </Button>
                </HStack>
              </View>
            </View>
          </View>
        </View>
      </GradientBackground>
    </SafeAreaView>
  );
};

export default Register;
