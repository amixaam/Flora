import { Stack } from "expo-router";
import React from "react";
import Header from "../../../Components/Header";
import { Colors } from "../../../styles/constants";
import { textStyles } from "../../../styles/text";

const SongsLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerTitle: "Songs",
                headerTitleStyle: textStyles.h3,
                headerBackground: () => <Header />,
                headerShadowVisible: false,
                headerTransparent: true,
                headerTintColor: Colors.primary,
                animation: "none",
                headerSearchBarOptions: {
                    headerIconColor: Colors.primary,
                    textColor: Colors.primary,
                    barTintColor: Colors.secondary,
                    hintTextColor: Colors.primary90,
                    shouldShowHintSearchIcon: false,
                },
            }}
        >
            <Stack.Screen name="index" />
        </Stack>
    );
};

export default SongsLayout;
