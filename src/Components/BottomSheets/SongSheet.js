import { BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, useRef } from "react";
import { useSongsStore } from "../../store/songs";
import SheetOptionsButton from "../UI/SheetOptionsButton";
import AddSongToPlaylistBottomSheet from "./AddSongToPlaylistBottomSheet";
import SheetLayout from "./SheetLayout";
import RemoveSongToPlaylistBottomSheet from "./removeSongFromPlaylistBottomSheet";
import { spacing } from "../../styles/constants";
import LargeOptionButton from "../UI/LargeOptionButton";

const SongSheet = forwardRef(({ props }, ref) => {
    const {
        selectedSong,
        hideSong,
        unhideSong,
        addSongLike,
        removeSongLike,
        addToQueue,
    } = useSongsStore();

    const addSongBottomSheetRef = useRef(null);
    const handleOpenAddSongBottomSheet = () =>
        addSongBottomSheetRef.current.present();

    const removeSongBottomSheetRef = useRef(null);
    const handleRemoveSongBottomSheet = () =>
        removeSongBottomSheetRef.current.present();

    const handleHideSongPress = () => {
        ref.current.dismiss();
        if (selectedSong.isHidden) unhideSong(selectedSong.id);
        else hideSong(selectedSong.id);
    };

    const handleDeleteSongPress = () => {
        ref.current.dismiss();
    };

    const handleToggleLikePress = () => {
        if (selectedSong.isLiked) {
            removeSongLike(selectedSong.id);
            selectedSong.isLiked = false;
        } else {
            addSongLike(selectedSong.id);
            selectedSong.isLiked = true;
        }
    };

    const handleAddToQueuePress = () => {
        addToQueue(selectedSong);
    };

    if (selectedSong === null) return;
    return (
        <>
            <SheetLayout ref={ref} title={"Edit " + selectedSong.title}>
                <BottomSheetView
                    style={{ marginHorizontal: -spacing.appPadding }}
                >
                    <BottomSheetView
                        style={{
                            flexDirection: "row",
                            columnGap: spacing.md,
                            marginHorizontal: spacing.appPadding,
                        }}
                    >
                        <LargeOptionButton
                            icon="album"
                            text="Add to queue"
                            onPress={() => {
                                ref.current.dismiss();
                                handleAddToQueuePress();
                            }}
                        />
                        <LargeOptionButton
                            icon="playlist-plus"
                            text="Add to playlist"
                            onPress={() => {
                                ref.current.dismiss();
                                handleOpenAddSongBottomSheet();
                            }}
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
                                handleToggleLikePress();
                            }}
                        />
                    </BottomSheetView>
                    <SheetOptionsButton
                        icon="pencil"
                        buttonContent={"Edit tags"}
                        onPress={() => {
                            ref.current.dismiss();
                        }}
                    />
                    <SheetOptionsButton
                        icon="chart-timeline-variant-shimmer"
                        buttonContent={"View statistics"}
                        onPress={() => {
                            ref.current.dismiss();
                        }}
                    />
                    <SheetOptionsButton
                        icon="playlist-minus"
                        buttonContent={"Remove from playlist"}
                        onPress={() => {
                            ref.current.dismiss();
                            handleRemoveSongBottomSheet();
                        }}
                    />
                    <SheetOptionsButton
                        icon={selectedSong.isHidden ? "eye" : "eye-off"}
                        buttonContent={
                            selectedSong.isHidden ? "Show song" : "Hide song"
                        }
                        onPress={handleHideSongPress}
                    />
                    <SheetOptionsButton
                        icon={"trash-can"}
                        buttonContent={
                            "Delete song from device (not available)"
                        }
                        onPress={handleDeleteSongPress}
                        isDisabled={true}
                    />
                </BottomSheetView>
            </SheetLayout>
            <AddSongToPlaylistBottomSheet ref={addSongBottomSheetRef} />
            <RemoveSongToPlaylistBottomSheet ref={removeSongBottomSheetRef} />
        </>
    );
});

export default SongSheet;
