import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";

export default function AddScreen() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "You need to allow access to the media library."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!content) {
      Alert.alert("Error", "Post content cannot be empty.");
      return;
    }
  
    const formData = new FormData();
    formData.append("content", content);
  
    if (image) {
      const filename = image.split("/").pop();
      const fileType = filename.split(".").pop();
  
      formData.append("image", {
        uri: image,
        name: filename,
        type: `image/${fileType}`,
      });
    }
  
    try {
      const token = await SecureStore.getItemAsync("token");
      console.log("Token:", token);
  
      const response = await fetch("http://57.128.212.224:3000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert("Success", "Post created successfully!");
        setContent("");
        setImage(null);
      } else {
        Alert.alert("Error", data.message || "Failed to create post.");
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      Alert.alert("Error", "An error occurred while creating the post.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create a Post</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Write your post here..."
        multiline
        value={content}
        onChangeText={setContent}
      />
      <Button title="Pick an Image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Submit Post" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  textInput: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginVertical: 20,
  },
});
