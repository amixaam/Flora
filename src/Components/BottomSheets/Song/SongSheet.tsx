import { forwardRef, useCallback, useRef } from "react";
import { useSongsStore } from "../../../store/songs";
import { SnapPoints, Spacing } from "../../../styles/constants";
import LargeOptionButton from "../../UI/LargeOptionButton";
import SheetOptionsButton from "../../UI/SheetOptionsButton";
import AddPlaylistToSong from "./AddPlaylistToSong";
import { SheetModalLayout } from "../SheetModalLayout";
import { BottomSheetProps } from "../../../types/other";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import SongStatistics from "./SongStatistics";
import { UISeperator } from "../../UI/UISeperator";

const SongSheet = forwardRef<BottomSheetModal, BottomSheetProps>(
    (props, ref) => {
        const {
            selectedSong,
            hideSong,
            unhideSong,
            likeSong,
            unlikeSong,
            addToQueue,
        } = useSongsStore();

        const addPlaylistRef = useRef<BottomSheetModal>(null);
        const openAddPlaylist = useCallback(() => {
            addPlaylistRef.current?.present();
        }, []);

        const songStatisticsRef = useRef<BottomSheetModal>(null);
        const openSongStatistics = useCallback(() => {
            songStatisticsRef.current?.present();
        }, []);

        if (selectedSong === undefined) return;

        const handleHideSong = () => {
            props.dismiss?.();
            if (selectedSong.isHidden) {
                unhideSong(selectedSong.id);
            } else {
                hideSong(selectedSong.id);
            }
        };

        const handleToggleLike = () => {
            props.dismiss?.();
            if (selectedSong.isLiked) {
                unlikeSong(selectedSong.id);
            } else {
                likeSong(selectedSong.id);
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
                    title={selectedSong.title}
                    snapPoints={[SnapPoints.lg]}
                >
                    <BottomSheetView
                        style={{
                            marginHorizontal: Spacing.appPadding,
                            gap: Spacing.md,
                        }}
                    >
                        <BottomSheetView
                            style={{
                                flexDirection: "row",
                                columnGap: Spacing.md,
                            }}
                        >
                            <LargeOptionButton
                                icon="album"
                                text="Add to queue"
                                onPress={handleAddToQueue}
                                disabled={selectedSong.isHidden}
                            />
                            <LargeOptionButton
                                icon="playlist-plus"
                                text="Add to playlist"
                                onPress={openAddPlaylist}
                                disabled={selectedSong.isHidden}
                            />

                            <LargeOptionButton
                                icon={
                                    selectedSong.isLiked
                                        ? "heart"
                                        : "heart-outline"
                                }
                                text={
                                    selectedSong.isLiked
                                        ? "Remove favourite"
                                        : "Add favourite"
                                }
                                onPress={handleToggleLike}
                                disabled={selectedSong.isHidden}
                            />
                        </BottomSheetView>

                        <UISeperator />

                        <BottomSheetView style={{ marginTop: -Spacing.sm }}>
                            <SheetOptionsButton
                                icon="chart-timeline-variant-shimmer"
                                buttonContent="View statistics"
                                onPress={() => {
                                    props.dismiss?.();
                                    openSongStatistics();
                                }}
                            />
                            <SheetOptionsButton
                                icon="album"
                                buttonContent="View album"
                                onPress={() => {
                                    props.dismiss?.();
                                }}
                                isDisabled
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
                                icon={selectedSong.isHidden ? "eye" : "eye-off"}
                                buttonContent={
                                    selectedSong.isHidden
                                        ? "Show song"
                                        : "Hide song"
                                }
                                onPress={handleHideSong}
                            />
                            <SheetOptionsButton
                                icon={"trash-can"}
                                buttonContent={
                                    "Delete song from device (not available)"
                                }
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

export default SongSheet;
