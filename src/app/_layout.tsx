import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack, router } from "expo-router";
import { useEffect } from "react";
import { Linking } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import TrackPlayer, {
    AppKilledPlaybackBehavior,
    Capability,
    RatingType,
    RepeatMode,
} from "react-native-track-player";
import { PlaybackService } from "../../PlaybackService";
import { useSongsStore } from "../store/songsStore";
import { Colors } from "../styles/constants";
import * as NavigationBar from "expo-navigation-bar";
import { UpdateMetadata } from "../utils/UpdateMetadata";
export default function App() {
    const { startup } = useSongsStore();
    useEffect(() => {
        async function setup() {
            try {
                await TrackPlayer.getActiveTrack();
                await startup();
            } catch (error) {
                TrackPlayer.registerPlaybackService(() => PlaybackService);

                await TrackPlayer.setupPlayer({
                    autoHandleInterruptions: true,
                });

                await TrackPlayer.updateOptions({
                    ratingType: RatingType.Heart,
                    android: {
                        appKilledPlaybackBehavior:
                            AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
                    },
                    notificationCapabilities: [
                        Capability.SetRating,
                        Capability.Play,
                        Capability.Pause,
                        Capability.SkipToNext,
                        Capability.SkipToPrevious,
                        Capability.SeekTo,
                    ],
                });
                await TrackPlayer.setRepeatMode(RepeatMode.Off);
                await startup();

                console.log("Setup!");
            }

            await UpdateMetadata();
        }
        setup();
        function deepLinkHandler(data: { url: string }) {
            console.log("deepLinkHandler", data.url);
            if (data.url === "trackplayer://notification.click") {
                router.navigate("/overlays/player");
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
                // statusBarColor:"#00000070",
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
