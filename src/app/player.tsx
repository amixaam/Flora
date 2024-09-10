import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback, useRef } from "react";
import { Text, View } from "react-native";
import { useActiveTrack } from "react-native-track-player";
import AlbumArt from "../Components/AlbumArt";
import SongSheet from "../Components/BottomSheets/SongSheet";
import ImageBlurBackground from "../Components/ImageBlurBackground";
import PlaybackControls from "../Components/PlaybackControls";
import IconButton from "../Components/UI/IconButton";
import PrimaryRoundIconButton from "../Components/UI/PrimaryRoundIconButton";
import { useSongsStore } from "../store/songs";
import { Colors, Spacing } from "../styles/constants";
import { mainStyles } from "../styles/styles";
import { textStyles } from "../styles/text";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { router } from "expo-router";
import { runOnJS } from "react-native-reanimated";
import { CombineStrings } from "../utils/CombineStrings";
import MinimiseText from "../utils/MinimiseText";

const PlayerScreen = () => {
    const { likeSong, unlikeSong, setSelectedSong, getSong } = useSongsStore();
    const activeTrack = useActiveTrack();

    const SongOptionsRef = useRef<BottomSheetModal>(null);
    const openSongOptions = useCallback(() => {
        SongOptionsRef.current?.present();
    }, []);
    const dismissSongoptions = useCallback(() => {
        SongOptionsRef.current?.dismiss();
    }, []);

    const handleLikeButtonPress = () => {
        if (activeTrack) {
            if (activeTrack.isLiked) {
                unlikeSong(activeTrack.id);
                activeTrack.isLiked = false;
            } else {
                likeSong(activeTrack.id);
                activeTrack.isLiked = true;
            }
        }
    };

    const goBack = () => {
        router.back();
    };

    const swipeDownGesture = Gesture.Pan().onChange((event) => {
        if (event.translationY > 120 || event.velocityY > 1000) {
            runOnJS(goBack)();
        }
    });

    return (
        <GestureDetector gesture={swipeDownGesture}>
            <View style={[mainStyles.container, { justifyContent: "center" }]}>
                <ImageBlurBackground
                    image={activeTrack?.artwork}
                    blur={15}
                    style={{ height: "85%", top: 0 }}
                    gradient={{
                        colors: [
                            "#050506",
                            "#05050650",
                            "#05050650",
                            "#05050630",
                            "#050506",
                        ],
                        locations: [0.1, 0.4, 0.5, 0.6, 1],
                    }}
                />
                <View
                    style={{
                        backgroundColor: Colors.primary,
                        width: 54,
                        height: 6,
                        borderRadius: Spacing.round,
                        position: "absolute",
                        top: Spacing.xl * 2,
                        alignSelf: "center",
                    }}
                />

                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        marginHorizontal: Spacing.appPadding * 2,
                        gap: Spacing.md,
                    }}
                >
                    <View>
                        <AlbumArt
                            image={activeTrack?.artwork}
                            style={{
                                aspectRatio: 1,
                                borderRadius: Spacing.radius,
                            }}
                        />
                        <PrimaryRoundIconButton
                            icon="pencil"
                            onPress={() => {
                                let song = getSong(activeTrack?.id);
                                if (song) {
                                    setSelectedSong(song);
                                    openSongOptions();
                                }
                            }}
                            style={{
                                position: "absolute",
                                bottom: Spacing.md,
                                right: Spacing.md,
                            }}
                        />
                    </View>
                    <View
                        style={{
                            marginBottom: Spacing.xl,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "column",
                            }}
                        >
                            <Text style={[textStyles.h5]} numberOfLines={1}>
                                {MinimiseText(activeTrack?.title, 24, true)}
                            </Text>
                            <Text style={[textStyles.text]}>
                                {CombineStrings([
                                    activeTrack?.artist,
                                    activeTrack?.year,
                                ])}
                            </Text>
                        </View>
                        <IconButton
                            touchableOpacityProps={{
                                onPress: handleLikeButtonPress,
                            }}
                            icon={
                                activeTrack?.isLiked ? "heart" : "heart-outline"
                            }
                        />
                    </View>

                    <PlaybackControls />
                </View>
                <SongSheet ref={SongOptionsRef} dismiss={dismissSongoptions} />
            </View>
        </GestureDetector>
    );
};

export default PlayerScreen;
