import { Link, Redirect } from "expo-router";
import { Image, Text, View } from "react-native";
import { images } from "../constants";
import { useGlobalContext } from "@/context/global-provider";
import GradientBackground from "@/components/gradient-background";
import { Button, ButtonText, ButtonSpinner } from "@/components/ui";

export default function App() {
  const { isLoading, isLoggedIn } = useGlobalContext();

  if (!isLoading && isLoggedIn) {
    return <Redirect href="/home" />;
  }

  return (
    <GradientBackground>
      <View className="w-full min-h-[85vh] justify-center items-center px-4">
        <Image
          source={images.logo}
          className="w-[200px] h-[200px]"
          resizeMode="contain"
        />
        <View className=" mt-5">
          <Text className="text-3xl text-white font-pbold text-center">
            Association of Engineers Kerala
          </Text>
        </View>
        <Text className="text-white mt-7 text-center font-pmedium text-base ">
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
