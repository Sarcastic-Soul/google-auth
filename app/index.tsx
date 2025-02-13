import React, { useEffect, useState } from "react";
import { View, Text, Button, Image, ActivityIndicator } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

export default function Index() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "1001660968412-1j1i4uu66b3eamjegr014iap56c9vr6m.apps.googleusercontent.com",
    iosClientId: "1001660968412-lgumju7c6ubusi97ejarl7pk42oqrkfk.apps.googleusercontent.com",
    webClientId: "1001660968412-3ud3ip5sjr8um872kgcha5fl84l0pmi1.apps.googleusercontent.com",
  });

  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      getUserData(response.authentication.accessToken);
    }
  }, [response]);

  async function checkIfLoggedIn() {
    const user = await AsyncStorage.getItem("user");
    if (user) {
      router.replace("/home");
    }
  }

  async function getUserData(token) {
    try {
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
  });
  const user = await res.json();
  await AsyncStorage.setItem("user", JSON.stringify(user));
  setUserInfo(user);
  router.replace("/home"); // Redirect to Home page
} catch (error) {
  console.error("Error fetching user info:", error);
}
  }

return (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Sign in with Google</Text>
    <Button title="Sign In" disabled={!request} onPress={() => promptAsync()} />
    {userInfo && <ActivityIndicator size="large" />}
  </View>
);
}