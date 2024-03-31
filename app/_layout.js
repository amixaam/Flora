import { Stack, Tabs } from "expo-router";

export default function DefaultLayout() {
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
                name="modal"
                options={{
                    // Set the presentation mode to modal for our modal route.
                    presentation: "modal",
                }}
            />
        </Stack>
    );
}
