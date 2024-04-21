import React from "react";
import { Stack } from "expo-router";

const playlistLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                gestureEnabled: true,
            }}
        >
            <Stack.Screen name="[playlist]" />
        </Stack>
    );
};

export default playlistLayout;
