import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, ButtonText } from "@/components/ui";
import { useGlobalContext } from "@/context/global-provider";

const Profile = () => {
  const { logout } = useGlobalContext();
  return (
    <SafeAreaView>
      <Text>Profile</Text>
      <Button onPress={logout}>
        <ButtonText>Logout</ButtonText>
      </Button>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({});
