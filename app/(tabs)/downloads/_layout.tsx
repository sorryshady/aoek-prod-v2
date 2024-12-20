import { Stack } from "expo-router";

export default function DownloadsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Downloads",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[download]"
        options={{
          title: `Download`,
          headerShown: false,
        }}
      />
    </Stack>
  );
}
