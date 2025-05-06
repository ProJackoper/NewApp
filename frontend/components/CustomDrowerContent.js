import React from "react";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import * as SecureStore from "expo-secure-store";

export function CustomDrawerContent(props) {
    const handleLogout = async () => {
        try {
          await SecureStore.deleteItemAsync("token");
          console.log("User logged out successfully");
          props.navigation.navigate("Login");
        } catch (error) {
          console.error("Error during logout:", error);
        }
      };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Home"
        onPress={() => props.navigation.navigate("Home")}
      />
      <DrawerItem
        label="Najnowsze"
        onPress={() => props.navigation.navigate("Najnowsze")}
      />
      <DrawerItem
        label="Najlepsze"
        onPress={() => props.navigation.navigate("Najlepsze")}
      />
      <DrawerItem
        label="Polubione"
        onPress={() => props.navigation.navigate("Polubione")}
      />
      <DrawerItem
        label="Dodaj"
        onPress={() => props.navigation.navigate("Dodaj")}
      />
      <DrawerItem
        label="Wyloguj"
        onPress={handleLogout}
      />
    </DrawerContentScrollView>
  );
}