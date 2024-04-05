import { Stack } from "expo-router";

export default function DefaultLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="[playlist]"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
}
