import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { forwardRef } from "react";
import { Easing, Text } from "react-native";
import { IconButton } from "react-native-paper";
import TextTicker from "react-native-text-ticker";
import useBottomSheetModal from "../../../hooks/useBottomSheetModal";
import { useSongsStore } from "../../../store/songsStore";
import { Colors, IconSizes, Spacing } from "../../../styles/constants";
import { textStyles } from "../../../styles/text";
import { BottomSheetProps } from "../../../types/other";
import { Song } from "../../../types/song";
import { CombineStrings } from "../../../utils/CombineStrings";
import LargeOptionButton from "../../UI/Buttons/LargeOptionButton";
import SheetOptionsButton from "../../UI/Buttons/SheetOptionsButton";
import AlbumArt from "../../UI/UI chunks/AlbumArt";
import { UISeperator } from "../../UI/Utils/UISeperator";
import { SheetModalLayout } from "../SheetModalLayout";
import AddMultipleSongs from "./AddMultipleSongs";
import SongStatistics from "./SongStatistics";

const SongSheet = forwardRef<BottomSheetModal, BottomSheetProps>(
    (props, ref) => {
        const { selectedSong, toggleSongVisibility, addToQueue } =
            useSongsStore();

        const {
            sheetRef: addPlaylistRef,
            open: openAddPlaylist,
            close: dismissAddPlaylist,
        } = useBottomSheetModal();

        const {
            sheetRef: songStatisticsRef,
            open: openStatistics,
            close: dismissStatistics,
        } = useBottomSheetModal();

        if (!selectedSong) {
            return null;
        }

        const handleHideSong = () => {
            toggleSongVisibility(selectedSong.id);
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
                        testID="song-sheet"
                        style={{
                            gap: Spacing.md,
                        }}
                    >
                        <BottomSheetView
                            style={{
                                flexDirection: "row",
                                marginHorizontal: Spacing.appPadding,
                                columnGap: Spacing.md,
                            }}
                        >
                            <LargeOptionButton
                                icon="chart-timeline-variant-shimmer"
                                text="View statistics"
                                onPress={openStatistics}
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
                                        `albums/${selectedSong.albumIds[0]}`
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
                <AddMultipleSongs
                    ref={addPlaylistRef}
                    dismiss={dismissAddPlaylist}
                    songs={[selectedSong.id]}
                />
                <SongStatistics
                    ref={songStatisticsRef}
                    dismiss={dismissStatistics}
                />
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
                <BottomSheetView style={{ flex: 1, gap: 2 }}>
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
                testID={
                    song.isLiked ? "sheet-unlike-button" : "sheet-like-button"
                }
                icon={song.isLiked ? "heart" : "heart-outline"}
                onPress={handleToggleLike}
                iconColor={Colors.primary}
                size={IconSizes.md}
            />
        </BottomSheetView>
    );
};

export default SongSheet;
