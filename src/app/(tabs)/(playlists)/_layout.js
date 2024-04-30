import React from "react";
import { Stack } from "expo-router";
import { colors } from "../../../styles/constants";
import { textStyles } from "../../../styles/text";
import { View } from "react-native";
import SecondaryRoundIconButton from "../../../Components/UI/SecondaryRoundIconButton";
import IconButton from "../../../Components/UI/IconButton";
import Header from "../../../Components/Header";
import { SafeAreaProvider } from "react-native-safe-area-context";

const PlaylistsLayout = () => {
    return (
        <SafeAreaProvider>
            <Stack
                screenOptions={{
                    headerTitle: "Playlists",
                    headerTitleStyle: textStyles.h3,
                    headerBackground: () => <Header />,
                    headerShadowVisible: false,
                    headerTransparent: true,
                    headerTintColor: colors.primary,
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
