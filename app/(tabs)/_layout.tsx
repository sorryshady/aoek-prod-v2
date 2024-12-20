import { Image, ImageSourcePropType, Platform, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import {
  Home,
  User,
  Newspaper,
  Download,
  CalendarDays,
} from "lucide-react-native";
import { StatusBar } from "expo-status-bar";

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontFamily: "Poppins-Regular",
          },
          tabBarActiveTintColor: "#FACE30",
          tabBarInactiveTintColor: "white",
          tabBarStyle: {
            backgroundColor: "#1F333E",
            paddingTop: 10,
            height: 84,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color }) => <Home color={color} />,
          }}
        />
        <Tabs.Screen
          name="news"
          options={{
            title: "News",
            headerShown: false,
            tabBarIcon: ({ color }) => <Newspaper color={color} />,
          }}
        />
        <Tabs.Screen
          name="events"
          options={{
            title: "Events",
            headerShown: false,
            tabBarIcon: ({ color }) => <CalendarDays color={color} />,
          }}
        />
        {/* <Tabs.Screen
          name="downloads"
          options={{
            title: "Downloads",
            headerShown: false,
            // tabBarIcon: ({ color }) => (
            //   <TabIcon icon={icons.downloads} color={color} />
            // ),
          }}
        /> */}
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color }) => <User color={color} />,
          }}
        />
        <Tabs.Screen
          name="about"
          options={{ href: null, headerShown: false }}
        />
      </Tabs>
      <StatusBar
        style={Platform.OS === "ios" ? "dark" : "light"}
        backgroundColor="#1F333E"
      />
    </>
  );
};

export default TabsLayout;
