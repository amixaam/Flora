import { forwardRef, useCallback, useRef } from "react";
import { useSongsStore } from "../../store/songs";
import { SnapPoints, Spacing } from "../../styles/constants";
import LargeOptionButton from "../UI/LargeOptionButton";
import SheetOptionsButton from "../UI/SheetOptionsButton";
import AddSongToPlaylistBottomSheet from "./AddSongToPlaylist";
import { SheetModalLayout } from "./SheetModalLayout";
import { BottomSheetProps } from "../../types/other";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

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

        const addSongBottomSheetRef = useRef<BottomSheetModal>(null);
        const handleOpenAddSongBottomSheet = useCallback(() => {
            addSongBottomSheetRef.current?.expand();
        }, []);

        if (selectedSong === null) return;

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
                            flexDirection: "row",
                            columnGap: Spacing.md,
                            marginHorizontal: Spacing.appPadding,
                        }}
                    >
                        <LargeOptionButton
                            icon="album"
                            text="Add to queue"
                            onPress={() => {
                                props.dismiss?.();
                                handleAddToQueue();
                            }}
                            disabled={selectedSong.isHidden}
                        />
                        <LargeOptionButton
                            icon="playlist-plus"
                            text="Add to playlist"
                            onPress={() => {
                                props.dismiss?.();
                                handleOpenAddSongBottomSheet();
                            }}
                            disabled={selectedSong.isHidden}
                        />

                        <LargeOptionButton
                            icon={
                                selectedSong.isLiked ? "heart" : "heart-outline"
                            }
                            text={
                                selectedSong.isLiked
                                    ? "Remove favourite"
                                    : "Add favourite"
                            }
                            onPress={() => {
                                handleToggleLike();
                            }}
                            disabled={selectedSong.isHidden}
                        />
                    </BottomSheetView>
                    <SheetOptionsButton
                        icon="album"
                        buttonContent="Go to album (NOT DONE)"
                        onPress={() => {
                            props.dismiss?.();
                        }}
                        isDisabled={selectedSong.isHidden}
                    />
                    <SheetOptionsButton
                        icon="chart-timeline-variant-shimmer"
                        buttonContent="View statistics (NOT DONE)"
                        onPress={() => {
                            props.dismiss?.();
                        }}
                    />
                    <SheetOptionsButton
                        icon="plus"
                        buttonContent="Add as single (NOT DONE)"
                        onPress={() => {
                            props.dismiss?.();
                        }}
                        isDisabled={selectedSong.isHidden}
                    />
                    <SheetOptionsButton
                        icon="pencil"
                        buttonContent="Edit tags (NOT DONE)"
                        onPress={() => {
                            props.dismiss?.();
                        }}
                    />

                    <SheetOptionsButton
                        icon={selectedSong.isHidden ? "eye" : "eye-off"}
                        buttonContent={
                            selectedSong.isHidden ? "Show song" : "Hide song"
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
                </SheetModalLayout>
                <AddSongToPlaylistBottomSheet ref={addSongBottomSheetRef} />
            </>
        );
    }
);

export default SongSheet;
