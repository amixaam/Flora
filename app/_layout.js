import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import CustomTopBar from "../Components/CustomTopBar";
export default function DefaultLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <Stack>
                    <Stack.Screen
                        name="(tabs)"
                        options={{
                            header: () => <CustomTopBar addPlaylist={true} />,
                            navigationBarColor: "transparent",
                            statusBarStyle: "inverted",
                        }}
                    />
                    <Stack.Screen
                        name="(playlist)"
                        options={{
                            header: () => <CustomTopBar editPlaylist={true} />,
                            navigationBarColor: "transparent",
                        }}
                    />
                    <Stack.Screen
                        name="(player)"
                        options={{
                            animation: "fade_from_bottom",
                            headerShown: false,
                            presentation: "transparentModal",
                            header: () => <CustomTopBar />,
                            navigationBarColor: "transparent",
                        }}
                    />
                </Stack>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
}
