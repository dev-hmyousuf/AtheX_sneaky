// app/(app)/index

import { View } from "react-native";
import { Text } from "@/components/Text";

import { Button } from "@/components/Button";
import { useUser } from "@clerk/clerk-expo";
import { Redirect, Link, router } from "expo-router";

import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Game from "../../components/Game";

export default function Index() {
  const { isSignedIn } = useUser();
  
  if (!isSignedIn) {
    return <Redirect href="/(auth)" />;
  }
  return (
   <>
    <Game />
    <Text style={{color : "#fff", alignSelf : "center" }}>
      Secured By AtheX Risk
    </Text>
   </>
  );
}