import React from "react";
import { Stack } from "expo-router";
import { colors } from "../../../styles/constants";
import { View } from "react-native";

const PlaylistsLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerSearchBarOptions: {
                    placeholder: "Search playlists",
                },
                headerTransparent: true,
                headerTintColor: colors.primary,
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="[id]" />
        </Stack>
    );
};

export default PlaylistsLayout;
