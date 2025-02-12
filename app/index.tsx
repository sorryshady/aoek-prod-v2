import { Link, Redirect } from "expo-router";
import { Dimensions, Image, Text, View } from "react-native";
import { images } from "../constants";
import { useGlobalContext } from "@/context/global-provider";
import GradientBackground from "@/components/gradient-background";
import { Button, ButtonText, ButtonSpinner } from "@/components/ui";

export default function App() {
  const { isLoading, isLoggedIn } = useGlobalContext();
  const width = Dimensions.get("window").width;
  const isTablet = width > 768;

  if (!isLoading && isLoggedIn) {
    return <Redirect href="/home" />;
  }

  return (
    <GradientBackground>
      <View
        className={`w-full min-h-[85vh] ${isTablet ? "max-w-4xl mx-auto" : ""} justify-center items-center px-4`}
      >
        <Image
          source={images.logo}
          className={`w-[200px] h-[200px] ${isTablet ? "w-[300px] h-[300px]" : ""}`}
          resizeMode="contain"
        />
        <View className=" mt-5">
          <Text
            className={`text-3xl text-white font-pbold text-center ${isTablet ? "text-4xl" : ""}`}
          >
            Association of Engineers Kerala
          </Text>
        </View>
        <Text
          className={`text-white mt-7 text-center font-pmedium ${isTablet ? "text-xl" : "text-base"}`}
        >
          A non-profit politically neutral organization.
        </Text>
        <Link href="/sign-in" replace asChild>
          <Button
            className="bg-red-500 w-full my-[3rem] rounded-md"
            size="xl"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <ButtonSpinner color={"white"} />
                <ButtonText className="font-psemibold">
                  Verifying user
                </ButtonText>
              </>
            ) : (
              <ButtonText className="font-psemibold">
                Continue to login
              </ButtonText>
            )}
          </Button>
        </Link>
      </View>
    </GradientBackground>
  );
}
