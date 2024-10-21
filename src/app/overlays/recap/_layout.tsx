import { Stack } from "expo-router";

export default function RecapsLayout() {
    return (
        <Stack
            screenOptions={{
                presentation: "transparentModal",
                headerShown: false,
                contentStyle: { backgroundColor: "transparent" },
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="[id]" />
            <Stack.Screen name="history" />
        </Stack>
    );
}
