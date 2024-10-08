import { Stack } from "expo-router";

export default function OverlaysLayout() {
    return (
        <Stack
            screenOptions={{
                presentation: "transparentModal",
                headerShown: false,
                contentStyle: { backgroundColor: "transparent" },
            }}
        >
            <Stack.Screen name="player" />
            <Stack.Screen name="history" />
            <Stack.Screen name="queue" />
            <Stack.Screen name="search" />
        </Stack>
    );
}
