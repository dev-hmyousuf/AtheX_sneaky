import * as React from "react";
import { View, SafeAreaView, TouchableOpacity, ActivityIndicator } from "react-native";
import * as AuthSession from "expo-auth-session";
import { useSignIn, useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"
import { Text } from "@/components/Text";
import { useRouter } from "expo-router";

const AuthButton = ({ provider, icon, onPress, loading }) => {
  const isDiscord = provider.toLowerCase() === 'discord';

  const RenderIcon = isDiscord ? FontAwesome5 : FontAwesome6;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        paddingVertical: 12,
        paddingHorizontal: 20,
        gap: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        width: "90%",
        alignSelf: "center",
      }}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="black" />
      ) : (
        <>
          <RenderIcon name={icon} size={24} color="black" />
          <Text style={{ color: "#000" }}>Continue with {provider}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default function Index() {
  const { startSSOFlow } = useSSO();
  const { setActive } = useSignIn();
  const router = useRouter();
  const [errors, setErrors] = React.useState([]);
  const [loading, setLoading] = React.useState({});

  const handleSignIn = async (strategy) => {
    setLoading((prev) => ({ ...prev, [strategy]: true }));
    try {
      const { createdSessionId } = await startSSOFlow({
        strategy,
        redirectUrl: AuthSession.makeRedirectUri(),
      });

      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        router.replace("/(app)");
      } else {
        setErrors([{ message: "No session ID was created." }]);
      }
    } catch (err) {
      setErrors([err]);
      console.error(err);
    } finally {
      setLoading((prev) => ({ ...prev, [strategy]: false }));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "space-between", alignItems: "center", paddingVertical: 20 }}>
      {/* Title Section */}
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 32, fontWeight: "bold" }}>AtheX Sneaky</Text>
        <Text>Sign in to continue</Text>
        {errors.map((error, index) => (
          <Text key={index} style={{ color: "red" }}>
            {error.message}
          </Text>
        ))}
      </View>

      {/* Buttons Section */}
      <View style={{ width: "100%", alignItems: "center", gap : 10, marginTop: "auto", paddingBottom: 40 }}>
        <AuthButton provider="Google" icon="google" onPress={() => handleSignIn("oauth_google")} loading={loading["oauth_google"]} />
        <AuthButton provider="GitHub" icon="github" onPress={() => handleSignIn("oauth_github")} loading={loading["oauth_github"]} />
        <AuthButton provider="Discord" icon="discord" onPress={() => handleSignIn("oauth_discord")} loading={loading["oauth_discord"]} />
      </View>
    </SafeAreaView>
  );
}