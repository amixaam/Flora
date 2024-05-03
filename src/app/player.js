import { View, Text } from "react-native";
import React, { useEffect, useRef } from "react";
import PlaybackControls from "../Components/PlaybackControls";
import { mainStyles } from "../styles/styles";
import ImageBlurBackground from "../Components/ImageBlurBackground";
import { colors, spacing } from "../styles/constants";
import AlbumArt from "../Components/AlbumArt";
import { useActiveTrack } from "react-native-track-player";
import { textStyles } from "../styles/text";
import { useSongsStore } from "../store/songs";
import PrimaryRoundIconButton from "../Components/UI/PrimaryRoundIconButton";
import SongSheet from "../Components/BottomSheets/SongSheet";
import IconButton from "../Components/UI/IconButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PlayerScreen = () => {
    const { addSongLike, removeSongLike, getSong } = useSongsStore();
    const activeTrack = useActiveTrack();

    const editSongRef = useRef(null);
    const handleEditSong = () => {
        editSongRef.current && editSongRef.current.present();
    };

    const handleLikeButtonPress = () => {
        if (activeTrack) {
            if (activeTrack.isLiked) {
                removeSongLike(activeTrack.id);
                activeTrack.isLiked = false;
            } else {
                addSongLike(activeTrack.id);
                activeTrack.isLiked = true;
            }
        }
    };

    const insets = useSafeAreaInsets();
    return (
        <View style={[mainStyles.container, { justifyContent: "center" }]}>
            <ImageBlurBackground
                image={activeTrack?.artwork}
                styles={{ height: "85%", top: 0 }}
            />
            {/* <DismissPill insets={insets} /> */}
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    marginHorizontal: spacing.appPadding,
                    rowGap: spacing.sm,
                }}
            >
                <View>
                    <AlbumArt
                        image={activeTrack?.artwork}
                        style={{
                            width: "100%",
                            aspectRatio: 1,
                            borderRadius: spacing.radius,
                        }}
                    />
                    <PrimaryRoundIconButton
                        icon="pencil"
                        onPress={handleEditSong}
                        style={{
                            position: "absolute",
                            bottom: spacing.md,
                            right: spacing.md,
                        }}
                    />
                </View>
                <View style={{ marginBottom: spacing.xl }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            columnGap: spacing.sm,
                        }}
                    >
                        <Text style={[textStyles.h4]} numberOfLines={1}>
                            {activeTrack?.title}
                        </Text>
                        <IconButton
                            onPress={handleLikeButtonPress}
                            icon={
                                activeTrack?.isLiked ? "heart" : "heart-outline"
                            }
                        />
                    </View>

                    <Text
                        style={[
                            textStyles.text,
                            { textAlign: "center", opacity: 0.7 },
                        ]}
                    >
                        {`${activeTrack?.artist} • ${activeTrack?.year}`}
                    </Text>
                </View>
                <PlaybackControls />
            </View>
            <SongSheet ref={editSongRef} />
        </View>
    );
};

const DismissPill = ({ insets = 0 }) => {
    return (
        <View
            style={{
                position: "absolute",
                top: insets.top + spacing.sm,
                right: 0,
                left: 0,
                alignItems: "center",
            }}
        >
            <View
                style={{
                    width: 50,
                    height: 7,
                    backgroundColor: colors.primary,
                    borderRadius: spacing.round,
                }}
            />
        </View>
    );
};

export default PlayerScreen;
