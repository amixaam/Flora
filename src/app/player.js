import { View, Text } from "react-native";
import React, { useEffect, useRef } from "react";
import PlaybackControls from "../Components/PlaybackControls";
import { mainStyles } from "../styles/styles";
import ImageBlurBackground from "../Components/ImageBlurBackground";
import { spacing } from "../styles/constants";
import AlbumArt from "../Components/AlbumArt";
import { useActiveTrack } from "react-native-track-player";
import { textStyles } from "../styles/text";
import { useSongsStore } from "../store/songs";
import PrimaryRoundIconButton from "../Components/UI/PrimaryRoundIconButton";
import SongSheet from "../Components/BottomSheets/SongSheet";
import IconButton from "../Components/UI/IconButton";

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

    return (
        <View style={[mainStyles.container, { justifyContent: "center" }]}>
            <ImageBlurBackground />
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    marginHorizontal: spacing.appPadding,
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
                        {activeTrack?.artist}
                        {" • "}
                        {activeTrack?.date}
                    </Text>
                </View>
                <PlaybackControls />
            </View>
            <SongSheet ref={editSongRef} />
        </View>
    );
};

export default PlayerScreen;
