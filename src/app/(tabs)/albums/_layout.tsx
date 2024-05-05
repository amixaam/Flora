import { Stack } from "expo-router";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../../../Components/Header";
import IconButton from "../../../Components/UI/IconButton";
import { Colors } from "../../../styles/constants";
import { textStyles } from "../../../styles/text";

const PlaylistsLayout = () => {
    return (
        <SafeAreaProvider>
            <Stack
                screenOptions={{
                    headerTitle: "Albums",
                    headerTitleStyle: textStyles.h3,
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
        </SafeAreaProvider>
    );
};

export default PlaylistsLayout;
