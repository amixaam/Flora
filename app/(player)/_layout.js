import React from "react";
import { Stack } from "expo-router";

const playerLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                gestureEnabled: true,
            }}
        >
            <Stack.Screen name="[song]" />
        </Stack>
    );
};

export default playerLayout;
