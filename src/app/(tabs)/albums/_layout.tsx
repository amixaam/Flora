import { Stack } from "expo-router";
import React from "react";
import { Colors } from "../../../styles/constants";
import { textStyles } from "../../../styles/text";
import Header from "../../../Components/UI/Headers/Header";
import IconButton from "../../../Components/UI/Buttons/IconButton";

const PlaylistsLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerTitle: "Albums",
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
