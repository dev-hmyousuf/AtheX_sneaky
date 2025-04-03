import { Stack, router } from 'expo-router';
import { Image, TouchableOpacity, View, Platform, Animated, Easing, Text } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { Appbar } from 'react-native-paper';
import { useEffect, useRef, useState } from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const AnimatedAppbar = ({ title = '', showProfile = true, showBackButton = false, showRightPoints = false }) => {
  const { user, isLoaded } = useUser();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-50)).current;
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayPoints, setDisplayPoints] = useState(0);

  useEffect(() => {
    if (isLoaded && user) {
      setDisplayPoints(user.unsafeMetadata?.gamePoints || 0);
    }
  }, [isLoaded, user]);

  useEffect(() => {
    if (isLoaded) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isLoaded]);

  // Score Animation Effect
  useEffect(() => {
    if (user?.unsafeMetadata?.gamePoints !== displayPoints) {
      // Number Bounce Animation
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: -5,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      // Smooth Transition of Number
      setTimeout(() => {
        setDisplayPoints(user?.unsafeMetadata?.gamePoints || 0);
      }, 150);
    }
  }, [user?.unsafeMetadata?.gamePoints, displayPoints]);

  if (!isLoaded || !user) {
    return null; // অথবা একটি লোডিং ইন্ডিকেটর রিটার্ন করতে পারেন
  }

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY }] }}>
      <Appbar.Header style={{ backgroundColor: 'black', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {showBackButton && (
            <Appbar.Action icon="chevron-left" onPress={() => router.back()} color="white" />
          )}
        </View>

        {showProfile && (
          <TouchableOpacity onPress={() => router.push('/profile')} style={{ padding: 8 }}>
            <View>
              <Image
                source={{ uri: user.imageUrl }}
                style={{ width: 32, height: 32, borderRadius: 16 }}
              />
            </View>
          </TouchableOpacity>
        )}

        <Appbar.Content
          title={title}
          titleStyle={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}
          style={{ alignItems: 'center', flex: 1 }}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', gap : 10  }}>
          {showRightPoints && (
      <>
        <TouchableOpacity onPress={() => router.push("leaderboard")}>
      	<MaterialIcons name="leaderboard" size={20} color="white" />
        </TouchableOpacity>
            <Animated.Text
              style={{
                color: 'white',
                fontSize: 18,
                fontWeight: 'bold',
                transform: [{ translateY: animatedValue }],
              }}
            >
              🍎 {displayPoints}
            </Animated.Text>
      </>
          )}
        </View>
      </Appbar.Header>
    </Animated.View>
  );
};

export default function RootChatLayout() {
  return (
    <Stack screenOptions={{ headerLargeTitle: true }}>
      <Stack.Screen
        name="profile"
        options={{
          headerShown: Platform.OS === 'android',
          header: () =>
            Platform.OS === 'android' ? (
              <AnimatedAppbar title="Profile" showProfile={false} showBackButton={true} showRightPoints={true} />
            ) : null,
        }}
      />

      <Stack.Screen
        name="index"
        options={{
          headerShown: Platform.OS === 'android',
          header: () =>
            Platform.OS === 'android' ? (
              <AnimatedAppbar title="Snake Game" showProfile={true} showRightPoints={true} />
            ) : null,
        }}
      />

      {/* New Leaderboard Screen */}
      <Stack.Screen
        name="leaderboard"
        options={{
          headerShown: Platform.OS === 'android',
          header: () =>
            Platform.OS === 'android' ? (
              <AnimatedAppbar title="Leaderboard" showProfile={false} showBackButton={true} showRightPoints={false} />
            ) : null,
        }}
      />
    </Stack>
  );
}