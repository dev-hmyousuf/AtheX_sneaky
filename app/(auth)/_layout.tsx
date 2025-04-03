// app/(auth)/_layout 

import { useUser } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";

export default function RootChatLayout() {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return <Redirect href="/(app)" />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}