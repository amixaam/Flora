import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import TrackPlayer, {
    AppKilledPlaybackBehavior,
    Capability,
    RatingType,
} from "react-native-track-player";
import { Colors } from "../styles/constants";
import { DEFAULT_REPEAT_MODE } from "../types/other";
import { UpdateMetadata } from "../utils/UpdateMetadata";
import { useEffect } from "react";
export default function App() {
    async function setupPlayer() {
        try {
            await TrackPlayer.getActiveTrack();
        } catch (error) {
            await TrackPlayer.setupPlayer({
                autoHandleInterruptions: true,
            });

            await TrackPlayer.updateOptions({
                ratingType: RatingType.Heart,
                android: {
                    appKilledPlaybackBehavior:
                        AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
                },
                icon: require("../../assets/images/system/icon.png"),
                capabilities: [
                    Capability.Play,
                    Capability.Pause,
                    Capability.SkipToNext,
                    Capability.SkipToPrevious,
                    Capability.SeekTo,
                    Capability.Stop,
                    Capability.SetRating,
                ],
                notificationCapabilities: [
                    Capability.Play,
                    Capability.Pause,
                    Capability.SkipToNext,
                    Capability.SkipToPrevious,
                    Capability.SeekTo,
                    Capability.SetRating,
                ],
            });
            await TrackPlayer.setRepeatMode(DEFAULT_REPEAT_MODE);
            await UpdateMetadata();
        }
    }

    useEffect(() => {
        setupPlayer();
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.bg }}>
            <PaperProvider>
                <BottomSheetModalProvider>
                    <DefaultLayout />
                </BottomSheetModalProvider>
            </PaperProvider>
        </GestureHandlerRootView>
    );
}

function DefaultLayout() {
    NavigationBar.setPositionAsync("absolute");
    NavigationBar.setBackgroundColorAsync("#ffffff00");

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                statusBarStyle: "light",
                statusBarTranslucent: true,
                animation: "slide_from_bottom",
            }}
        >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
                name="overlays"
                options={{ presentation: "transparentModal" }}
            />
        </Stack>
    );
}
