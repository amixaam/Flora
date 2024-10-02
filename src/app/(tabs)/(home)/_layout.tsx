import { Stack } from "expo-router";
import React from "react";
import { Colors } from "../../../styles/constants";
import { textStyles } from "../../../styles/text";
import Header from "../../../Components/UI/Headers/Header";
import IconButton from "../../../Components/UI/Buttons/IconButton";

const HomeLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerTitle: "Flora",
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
                options={{
                    headerSearchBarOptions: {
                        headerIconColor: Colors.primary,
                        textColor: Colors.primary,
                        barTintColor: Colors.primary30,
                        obscureBackground: true,
                        onOpen: () => {
                            console.log("open search bar");
                        },
                        hintTextColor: Colors.primary90,
                        shouldShowHintSearchIcon: false,
                    },
                }}
            />
            <Stack.Screen
                name="[id]"
                options={{
                    headerTitle: "",
                    headerRight: () => <IconButton icon="tune" />,
                }}
            />
        </Stack>
    );
};

export default HomeLayout;
