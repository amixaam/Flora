import { Stack } from "expo-router";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "../../../Components/Header";
import { colors } from "../../../styles/constants";
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
                    headerTintColor: colors.primary,
                    headerSearchBarOptions: {
                        headerIconColor: colors.primary,
                        textColor: colors.primary,
                        barTintColor: colors.secondary,
                        hintTextColor: colors.primary90,
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
