import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "@/context/global-provider";

const Home = () => {
  const { logout } = useGlobalContext();
  //   useEffect(() => {
  //     logout();
  //   }, []);
  return (
    <SafeAreaView className="flex-1">
      <Text>Home</Text>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({});
