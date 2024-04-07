import { Stack } from "expo-router";

export default function DefaultLayout() {
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
}
