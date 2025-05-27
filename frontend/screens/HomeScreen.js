import React, { useEffect } from "react"; 
import { View, Text, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";

export default function HomeScreen({ navigation }) { 
  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        navigation.navigate("Login");
      }
    };

    checkToken();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Main Side</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 25,
    fontWeight: "bold",
  },
});