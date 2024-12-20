import { Stack } from "expo-router";

export default function NewsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "News Feed",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[slug]"
        options={{
          title: "News Details",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
