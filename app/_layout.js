import { Stack, Tabs, router } from "expo-router";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function DefaultLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
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
                        presentation: "modal",
                        headerShown: false,
                        navigationBarColor: "transparent",
                    }}
                />
                <Stack.Screen
                    name="createPlaylistModal"
                    options={{
                        presentation: "modal",
                        headerShown: false,
                        navigationBarColor: "transparent",
                    }}
                />
            </Stack>
        </GestureHandlerRootView>
    );
}
