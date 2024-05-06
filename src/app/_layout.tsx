import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from "../styles/constants";

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.bg }}>
            <BottomSheetModalProvider>
                <DefaultLayout />
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
}

function DefaultLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                statusBarStyle: "light",
                navigationBarColor: "transparent",
                statusBarColor: "transparent",
            }}
        >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
                name="player"
                options={{
                    animation: "slide_from_bottom",
                }}
            />
        </Stack>
    );
}
