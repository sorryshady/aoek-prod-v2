import { Stack } from "expo-router";

export default function CommitteeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Committee",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[type]"
        options={{
          title: `Committee`,
          headerShown: false,
        }}
      />
    </Stack>
  );
}
