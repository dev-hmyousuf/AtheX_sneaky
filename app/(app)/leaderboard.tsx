import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, ActivityIndicator, StyleSheet } from "react-native";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("https://api.clerk.com/v1/users?limit=100&offset=0&order_by=-created_at", {
          headers: {
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_CLERK_SECRET_KEY}`, // Clerk সিক্রেট কী পরিবেশ ভেরিয়েবল থেকে আনুন
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch users");

        const users = await response.json();

        // Top 10 Users সংগ্রহ করা
        const topUsers = users
          .map((user) => ({
            id: user.id,
            name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
            image: user.image_url,
            gamePoints: user.unsafe_metadata?.gamePoints || 0,
          }))
          .sort((a, b) => b.gamePoints - a.gamePoints) // পয়েন্ট অনুযায়ী সাজানো
          .slice(0, 10); // কেবল টপ ১০ জন নেওয়া

        setLeaderboard(topUsers);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="blue" />;

  return (
    <FlatList
      data={leaderboard}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <View style={styles.itemContainer}>
          <Text style={styles.rank}>{index + 1}.</Text>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.points}>🍎 {item.gamePoints}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  rank: {
    fontSize: 20,
    fontWeight: "bold",
    color : "#fff"
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  name: {
    fontSize: 18,
    color : "#fff"
  },
  points: {
    fontSize: 18,
    color: "gold",
    marginLeft: "auto",

  },
});

export default Leaderboard;