import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack, router } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from "../styles/constants";
import { useEffect } from "react";
import { Linking } from "react-native";

export default function App() {
    useEffect(() => {
        function deepLinkHandler(data: { url: string }) {
            console.log("deepLinkHandler", data.url);
            if (data.url === "trackplayer://notification.click") {
                router.push("/player");
            }
        }

        // This event will be fired when the app is already open and the notification is clicked
        Linking.addEventListener("url", deepLinkHandler);

        // When you launch the closed app from the notification or any other link
        Linking.getInitialURL().then((url) =>
            console.log("getInitialURL", url)
        );

        return () => {
            Linking.removeAllListeners("url");
        };
    }, []);

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
