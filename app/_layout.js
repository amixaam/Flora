import { Stack, Tabs } from "expo-router";

export default function DefaultLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="(tabs)"
                options={{
                    headerShown: false,
                    navigationBarColor: "transparent",
                }}
            />
            <Stack.Screen
                name="modal"
                options={{
                    presentation: "modal",
                    headerShown: false,
                    navigationBarColor: "transparent",
                }}
            />
        </Stack>
    );
}
