import { Stack } from "expo-router";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../global.css";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { SplashScreen } from "expo-router";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import GlobalProvider from "@/context/global-provider";
import { Platform } from "react-native";
export const unstable_settings = {
  initialRouteName: "index",
};

SplashScreen.preventAutoHideAsync();
// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      gcTime: Infinity,
    },
  },
});

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalProvider>
        <GluestackUIProvider mode="light">
          <Slot />
          <StatusBar
            style={Platform.OS === "ios" ? "dark" : "light"}
            backgroundColor="#1F333E"
          />
        </GluestackUIProvider>
      </GlobalProvider>
    </QueryClientProvider>
  );
}
