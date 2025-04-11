import React, { useState } from "react";
import { View, Image, ActivityIndicator } from "react-native";
import { Text } from "@/components/Text";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Button } from "@/components/Button";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from '@expo/vector-icons/Octicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function Profile() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      router.replace("/(auth)");
    } catch (error) {
      console.error("Sign out failed", error);
    } finally {
      setLoading(false);
    }
  };

  const providerIcons = {
    GOOGLE: "google",
    GITHUB: "github",
    FACEBOOK: "facebook",
    TWITTER: "twitter",
    APPLE: "apple",
    DISCORD: "discord",
  };

  const externalAccounts =
    user?.externalAccounts?.map((account) => ({
      id: account.id, 
      provider: account.provider.replace("oauth_", "").toUpperCase(),
      name: `${account.firstName} ${account.lastName}`,
      username: account.username || "",
      email: account.emailAddress || "",
      avatarUrl: account.imageUrl || null,
    })) || [];

  const isPrimary = (accountId) => {
    const primaryStrategy = user?.emailAddresses?.[0]?.verification?.strategy;
    if (!primaryStrategy) return false;

    const primaryProvider = primaryStrategy.replace("from_oauth_", "oauth_");
    return user?.externalAccounts?.some(
      (account) => account.id === accountId && account.provider === primaryProvider
    );
  };

  const renderProviderIcon = (provider) => {
    const iconName = providerIcons[provider] || "question-circle";
    if (provider === "DISCORD") {
      return <FontAwesome5 name={iconName} size={33} color="gray" />;
    }
    return <FontAwesome6 name={iconName} size={30} color="gray" />;
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={{ alignItems: "center" }}>
        <View style={{ width: 100, height: 100, borderRadius: 50, overflow: "hidden", marginBottom: 10 }}>
          <Image
            source={{ uri: user?.imageUrl }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
        </View>
        <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>
          {user?.fullName}
        </Text>
        <Text style={{ fontSize: 16, color: "gray", textAlign: "center" }}>
          {user?.emailAddresses?.[0]?.emailAddress}
        </Text>
      </View>

      {externalAccounts.length > 0 && (
        <View style={{ marginTop: 30, alignSelf : "center", width : "95%" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "white" }}>
            Connected Accounts
          </Text>
          {externalAccounts.map((account, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: "#ddd",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                {renderProviderIcon(account.provider)}
                <View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <Text style={{ fontSize: 18, color: "#ffffee" }}>
                      {account.name}
                    </Text>
                    {isPrimary(account.id) && (
                      <Octicons
                        name="verified"
                        size={18}
                        color="white"
                      />
                    )}
                  </View>
                  {account.username && (
                    <Text style={{ fontSize: 14, color: "gray" }}>
                      @{account.username}
                    </Text>
                  )}
                  {account.provider === "GOOGLE" && (
                    <Text style={{ fontSize: 14, color: "gray" }}>
                      {account.email}
                    </Text>
                  )}
                </View>
              </View>
              {account.avatarUrl ? (
                <Image
                  source={{ uri: account.avatarUrl }}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                />
              ) : (
                <Ionicons name="person-circle" size={40} color="gray" />
              )}
            </View>
          ))}
        </View>
      )}

      <Button
        onPress={handleSignOut}
        style={{ marginTop: 20 }}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          "Sign Out"
        )}
      </Button>
    </View>
  );
}