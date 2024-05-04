import { Stack } from "expo-router";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../../../Components/Header";
import { Colors } from "../../../styles/constants";
import { textStyles } from "../../../styles/text";

const SongsLayout = () => {
    return (
        <SafeAreaProvider>
            <Stack
                screenOptions={{
                    headerTitle: "Songs",
                    headerTitleStyle: textStyles.h3,
                    headerBackground: () => <Header />,

                    headerShadowVisible: false,
                    headerTransparent: true,
                    headerTintColor: Colors.primary,
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
        </SafeAreaProvider>
    );
};

export default SongsLayout;
