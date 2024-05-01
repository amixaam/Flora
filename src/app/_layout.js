import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { colors } from "../styles/constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function App() {
    const insets = useSafeAreaInsets();
    
    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
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
                    presentation: "modal",
                    animation: "slide_from_bottom",
                    gestureEnabled: true,
                    gestureDirection: "vertical",
                    fullScreenGestureEnabled: true,
                }}
            />
        </Stack>
    );
}
