import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import * as SecureStore from "expo-secure-store";

export default function LatestScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await fetch("http://57.128.212.224:3001/api/posts");
      const data = await response.json();
      if (response.ok) {
        setPosts(data);
      } else {
        console.error("Error fetching posts:", data.message);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLikedPosts = async () => {
  try {
    const token = await SecureStore.getItemAsync("token");
    if (!token) return;
    const response = await fetch(
      "http://57.128.212.224:3001/api/user/liked-posts",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Nieprawidłowa odpowiedź z backendu (nie JSON)");
      return;
    }

    const data = await response.json();
    if (response.ok) {
      setLikedPosts(data);
    }
  } catch (error) {
    console.error("Error fetching liked posts:", error);
  }
};

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setLoading(true);
      fetchPosts();
      fetchLikedPosts();
    });
    return unsubscribe;
  }, [navigation]);

  const handleLike = async (postId) => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) return;
      const isLiked = likedPosts.includes(postId);
      const method = isLiked ? "DELETE" : "POST";
      const response = await fetch(
        `http://57.128.212.224:3001/api/posts/${postId}/like`,
        {
          method,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        setLikedPosts((prev) =>
          isLiked ? prev.filter((id) => id !== postId) : [...prev, postId]
        );
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likes_count: isLiked
                    ? Math.max(0, (post.likes_count || 0) - 1)
                    : (post.likes_count || 0) + 1,
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const renderPost = ({ item }) => {
    const isLiked = likedPosts.includes(item.id);
    return (
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.date}>
            {new Date(item.date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            {new Date(item.date).toLocaleDateString("pl-PL")}
          </Text>
        </View>
        <Text style={styles.content}>{item.content}</Text>
        {item.image_url && (
          <Image
            source={{
              uri: `http://57.128.212.224:3001/uploads/${item.image_url}`,
            }}
            style={styles.image}
          />
        )}
        <View style={styles.likeRow}>
          <TouchableOpacity
            style={[
              styles.likeButton,
              {
                backgroundColor: isLiked ? "#ff4444" : "#fff",
                borderColor: "#ff4444",
              },
            ]}
            onPress={() => handleLike(item.id)}
          >
            <Text
              style={{
                color: isLiked ? "#fff" : "#ff4444",
                fontWeight: "bold",
              }}
            >
              ♥
            </Text>
          </TouchableOpacity>
          <Text style={styles.likesCount}>
            {item.likes_count || 0} polubień
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  list: {
    paddingBottom: 20,
  },
  postContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  date: {
    fontSize: 12,
    color: "#666",
  },
  content: {
    fontSize: 14,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
  },
  likeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  likeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  likesCount: {
    fontSize: 16,
    color: "#333",
  },
});
