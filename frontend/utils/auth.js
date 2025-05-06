import * as SecureStore from "expo-secure-store";

export const checkLoginStatus = async () => {
  try {
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      console.log("User is logged in:");
      return true;
    } else {
      console.log("User is not logged in");
      return false;
    }
  } catch (error) {
    console.error("Error checking login status:", error);
    return false;
  }
};