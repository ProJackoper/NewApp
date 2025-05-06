import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import LatestScreen from "./screens/LatestScreen";
import BestScreen from "./screens/BestScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import AddScreen from "./screens/AddScreen";
import LoginScreen from "./screens/LoginScreen";
import { CustomDrawerContent } from "./components/CustomDrowerContent";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: true }}
      />
      <Drawer.Screen
        name="Najnowsze"
        component={LatestScreen}
        options={{ headerShown: true }}
      />
      <Drawer.Screen
        name="Najlepsze"
        component={BestScreen}
        options={{ headerShown: true }}
      />
      <Drawer.Screen
        name="Polubione"
        component={FavoritesScreen}
        options={{ headerShown: true }}
      />
      <Drawer.Screen
        name="Dodaj"
        component={AddScreen}
        options={{ headerShown: true }}
      />
      <Drawer.Screen
        name="Wyloguj"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Drawer"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}