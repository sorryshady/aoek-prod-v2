import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, ButtonText } from "@/components/ui";
import { useGlobalContext } from "@/context/global-provider";
import { router } from "expo-router";

const Profile = () => {
  const { user, logout } = useGlobalContext();
  const [formData, setFormData] = useState({
    personalAddress: "",
    phoneNumber: "",
    mobileNumber: "",
    homeDistrict: "",
  });
  useEffect(() => {
    if (user) {
      if (
        !user.dob ||
        !user.email ||
        !user.mobileNumber ||
        !user.gender ||
        !user.bloodGroup ||
        !user.personalAddress ||
        (user.userStatus === "WORKING" && !user.workDistrict) ||
        (user.userStatus === "RETIRED" && !user.retiredDepartment)
      ) {
        router.push("/complete-account");
      }
      setFormData({
        personalAddress: user.personalAddress || "",
        phoneNumber: user.phoneNumber || "",
        mobileNumber: user.mobileNumber || "",
        homeDistrict: user.homeDistrict || "",
      });
    }
  }, [user]);
  return (
    <SafeAreaView>
      <Text>Profile</Text>
      <Text>User:{user?.name}</Text>
      <Button onPress={logout}>
        <ButtonText>Logout</ButtonText>
      </Button>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({});
