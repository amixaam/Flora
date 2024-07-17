import { Stack } from "expo-router";
import React from "react";
import Header from "../../../Components/Header";
import IconButton from "../../../Components/UI/IconButton";
import { Colors } from "../../../styles/constants";
import { textStyles } from "../../../styles/text";

const PlaylistsLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerTitle: "Playlists",
                headerTitleStyle: textStyles.h4,
                headerBackground: () => <Header />,
                headerShadowVisible: false,
                headerTransparent: true,
                headerTintColor: Colors.primary,
                animation: "none",
            }}
        >
            <Stack.Screen
                name="index"
                options={{ headerRight: () => <IconButton icon="plus" /> }}
            />
            <Stack.Screen
                name="[id]"
                options={{
                    headerTitle: "",
                    headerRight: () => <IconButton icon="pencil" />,
                }}
            />
        </Stack>
    );
};

export default PlaylistsLayout;
