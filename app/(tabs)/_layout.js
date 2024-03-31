import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Playlists",
                }}
            />
            <Tabs.Screen
                name="ytmp3"
                options={{
                    title: "YTmp3",
                    href: null, // remove from the tab bar
                }}
            />
            <Tabs.Screen
                name="local"
                options={{
                    title: "Local files",
                }}
            />
            
        </Tabs>
    );
}
