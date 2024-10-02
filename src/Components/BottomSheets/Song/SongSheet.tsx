import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { forwardRef, useCallback, useRef } from "react";
import { Easing, Text } from "react-native";
import { IconButton } from "react-native-paper";
import TextTicker from "react-native-text-ticker";
import { useSongsStore } from "../../../store/songs";
import {
    Colors,
    IconSizes,
    Spacing
} from "../../../styles/constants";
import { textStyles } from "../../../styles/text";
import { BottomSheetProps } from "../../../types/other";
import { Song } from "../../../types/song";
import { CombineStrings } from "../../../utils/CombineStrings";
import AlbumArt from "../../UI/UI chunks/AlbumArt";
import { SheetModalLayout } from "../SheetModalLayout";
import AddPlaylistToSong from "./AddPlaylistToSong";
import SongStatistics from "./SongStatistics";
import LargeOptionButton from "../../UI/Buttons/LargeOptionButton";
import { UISeperator } from "../../UI/Utils/UISeperator";
import SheetOptionsButton from "../../UI/Buttons/SheetOptionsButton";

const SongSheet = forwardRef<BottomSheetModal, BottomSheetProps>(
    (props, ref) => {
        const { selectedSong, hideSong, unhideSong, addToQueue } =
            useSongsStore();

        const addPlaylistRef = useRef<BottomSheetModal>(null);
        const openAddPlaylist = useCallback(() => {
            addPlaylistRef.current?.present();
        }, []);

        const songStatisticsRef = useRef<BottomSheetModal>(null);
        const openSongStatistics = useCallback(() => {
            songStatisticsRef.current?.present();
        }, []);

        if (!selectedSong) {
            return null;
        }

        const handleHideSong = () => {
            if (selectedSong.isHidden) {
                unhideSong(selectedSong.id);
            } else {
                hideSong(selectedSong.id);
            }
        };

        const handleAddToQueue = () => {
            props.dismiss?.();
            addToQueue(selectedSong);
        };

        return (
            <>
                <SheetModalLayout
                    ref={ref}
                    customHeader={<SongSheetHeader song={selectedSong} />}
                >
                    <BottomSheetView
                        style={{
                            gap: Spacing.md,
                            marginHorizontal: Spacing.appPadding,
                        }}
                    >
                        <BottomSheetView
                            style={{
                                flexDirection: "row",
                                columnGap: Spacing.md,
                            }}
                        >
                            <LargeOptionButton
                                icon="chart-timeline-variant-shimmer"
                                text="View statistics"
                                onPress={openSongStatistics}
                                disabled={selectedSong.isHidden}
                            />
                            <LargeOptionButton
                                icon="playlist-plus"
                                text="Add to playlist"
                                onPress={openAddPlaylist}
                                disabled={selectedSong.isHidden}
                            />
                            <LargeOptionButton
                                icon="album"
                                text="Add to queue"
                                onPress={handleAddToQueue}
                                disabled={selectedSong.isHidden}
                            />
                        </BottomSheetView>

                        <UISeperator />

                        <BottomSheetView
                            style={{
                                marginTop: -Spacing.sm,
                            }}
                        >
                            <SheetOptionsButton
                                icon="album"
                                buttonContent="Go to album"
                                onPress={() => {
                                    props.dismiss?.();
                                    router.push(
                                        `./${selectedSong.albumIds[0]}`
                                    );
                                }}
                                isDisabled={selectedSong.albumIds.length === 0}
                            />
                            <SheetOptionsButton
                                icon="pencil"
                                buttonContent="Edit tags"
                                onPress={() => {
                                    props.dismiss?.();
                                }}
                                isDisabled
                            />

                            <SheetOptionsButton
                                icon={selectedSong.isHidden ? "eye-off" : "eye"}
                                buttonContent={
                                    selectedSong.isHidden
                                        ? "Show song"
                                        : "Hide song"
                                }
                                onPress={handleHideSong}
                            />
                            <SheetOptionsButton
                                icon={"trash-can"}
                                buttonContent={"Delete from device"}
                                isDisabled={true}
                            />
                        </BottomSheetView>
                    </BottomSheetView>
                </SheetModalLayout>
                <AddPlaylistToSong ref={addPlaylistRef} />
                <SongStatistics ref={songStatisticsRef} />
            </>
        );
    }
);

const SongSheetHeader = ({ song }: { song: Song }) => {
    const { likeSong, unlikeSong } = useSongsStore();

    const handleToggleLike = () => {
        if (song.isLiked) {
            unlikeSong(song.id);
        } else {
            likeSong(song.id);
        }
    };
    return (
        <BottomSheetView
            style={{
                marginBottom: Spacing.mmd,
                marginTop: -6,
                marginHorizontal: Spacing.appPadding,

                gap: Spacing.md,

                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <BottomSheetView
                style={{
                    gap: Spacing.mmd,
                    flex: 1,

                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <AlbumArt
                    image={song.artwork}
                    style={{ width: 42 }}
                    radius={Spacing.radiusSm}
                />
                <BottomSheetView style={{ flex: 1 }}>
                    <TextTicker
                        key={song.title}
                        style={textStyles.h6}
                        duration={12 * 1000}
                        marqueeDelay={2 * 1000}
                        easing={Easing.linear}
                        bounce={false}
                        scroll={false}
                        loop
                    >
                        {song.title}
                    </TextTicker>
                    <Text
                        style={[
                            textStyles.small,
                            { marginBottom: -2, opacity: 0.75 },
                        ]}
                    >
                        {CombineStrings([song.artist, song.year])}
                    </Text>
                </BottomSheetView>
            </BottomSheetView>
            <IconButton
                icon={song.isLiked ? "heart" : "heart-outline"}
                onPress={handleToggleLike}
                iconColor={Colors.primary}
                size={IconSizes.md}
            />
        </BottomSheetView>
    );
};

export default SongSheet;
