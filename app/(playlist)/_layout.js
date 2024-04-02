import { Stack, Tabs, router } from "expo-router";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function DefaultLayout() {
    return (
        
        <Stack>
            <Stack.Screen name="settings" options={{}} />
            <Stack.Screen
                name="[playlist]"
                options={{
                    title: "playlist",
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={() => router.push("/settings")}
                        >
                            <MaterialIcons name="settings" size={24} />
                        </TouchableOpacity>
                    ),
                }}
            />
        </Stack>
    );
}
