import React, { useEffect, useState } from "react";
import { View, Text, Button, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Home() {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        loadUser();
    }, []);

    async function loadUser() {
        const data = await AsyncStorage.getItem("user");
        if (data) {
            setUser(JSON.parse(data));
            console.log(JSON.parse(data).picture);
        } else {
            router.replace("/");
        }
    }

    async function logout() {
        await AsyncStorage.removeItem("user");
        router.replace("/");
    }

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            {user ? (
                <>
                    <Image source={{ uri: user.picture }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                    <Text>Name: {user.name}</Text>
                    <Text>Email: {user.email}</Text>
                    <Button title="Logout" onPress={logout} />
                </>
            ) : (
                <Text>Loading...</Text>
            )}
        </View>
    );
}