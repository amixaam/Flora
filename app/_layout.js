import { Stack, Tabs, router } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function DefaultLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <Stack>
                    <Stack.Screen
                        name="(tabs)"
                        options={{
                            headerShown: false,
                            navigationBarColor: "transparent",
                        }}
                    />
                    <Stack.Screen
                        name="(playlist)"
                        options={{
                            headerShown: false,
                            navigationBarColor: "transparent",
                        }}
                    />
                    <Stack.Screen
                        name="(player)"
                        options={{
                            presentation: "modal",
                            headerShown: false,
                            navigationBarColor: "transparent",
                        }}
                    />
                </Stack>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
}
