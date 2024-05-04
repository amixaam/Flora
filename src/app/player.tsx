import React, { useRef } from "react";
import { Text, View } from "react-native";
import { useActiveTrack } from "react-native-track-player";
import AlbumArt from "../Components/AlbumArt";
import SongSheet from "../Components/BottomSheets/SongSheet";
import ImageBlurBackground from "../Components/ImageBlurBackground";
import PlaybackControls from "../Components/PlaybackControls";
import IconButton from "../Components/UI/IconButton";
import PrimaryRoundIconButton from "../Components/UI/PrimaryRoundIconButton";
import { useSongsStore } from "../store/songs";
import { Spacing } from "../styles/constants";
import { mainStyles } from "../styles/styles";
import { textStyles } from "../styles/text";
import BottomSheet from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet";

const PlayerScreen = () => {
    const { likeSong, unlikeSong } = useSongsStore();
    const activeTrack = useActiveTrack();

    const editSongRef = useRef<BottomSheet>(null);
    const handleEditSong = () => editSongRef.current?.expand();

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

    return (
        <View style={[mainStyles.container, { justifyContent: "center" }]}>
            <ImageBlurBackground
                image={activeTrack?.artwork}
                style={{ height: "85%", top: 0 }}
            />
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    marginHorizontal: Spacing.appPadding,
                    rowGap: Spacing.sm,
                }}
            >
                <View>
                    <AlbumArt
                        image={activeTrack?.artwork}
                        style={{
                            width: "100%",
                            aspectRatio: 1,
                            borderRadius: Spacing.radius,
                        }}
                    />
                    <PrimaryRoundIconButton
                        icon="pencil"
                        onPress={handleEditSong}
                        style={{
                            position: "absolute",
                            bottom: Spacing.md,
                            right: Spacing.md,
                        }}
                    />
                </View>
                <View style={{ marginBottom: Spacing.xl }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            columnGap: Spacing.sm,
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

export default PlayerScreen;