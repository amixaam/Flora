import { BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, useRef } from "react";
import { useSongsStore } from "../../store/songs";
import SheetOptionsButton from "../UI/SheetOptionsButton";
import AddSongToPlaylistBottomSheet from "./AddSongToPlaylistBottomSheet";
import SheetLayout from "./SheetLayout";
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

    const handleHideSongPress = () => {
        ref.current.dismiss();
        if (selectedSong.isHidden) {
            selectedSong.isHidden = false;
            unhideSong(selectedSong.id);
        } else {
            selectedSong.isHidden = true;
            hideSong(selectedSong.id);
        }
    };

    const handleDeleteSongPress = () => {
        ref.current.dismiss();
    };

    const handleToggleLikePress = () => {
        if (selectedSong.isLiked) {
            selectedSong.isLiked = false;
            removeSongLike(selectedSong.id);
        } else {
            selectedSong.isLiked = true;
            addSongLike(selectedSong.id);
        }
    };

    const handleAddToQueuePress = () => {
        addToQueue(selectedSong);
    };

    if (selectedSong === null) return;
    return (
        <>
            <SheetLayout ref={ref} title={selectedSong.title}>
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
                        disabled={selectedSong.isHidden}
                    />
                    <LargeOptionButton
                        icon="playlist-plus"
                        text="Add to playlist"
                        onPress={() => {
                            ref.current.dismiss();
                            handleOpenAddSongBottomSheet();
                        }}
                        disabled={selectedSong.isHidden}
                    />

                    <LargeOptionButton
                        icon={selectedSong.isLiked ? "heart" : "heart-outline"}
                        text={
                            selectedSong.isLiked
                                ? "Remove favourite"
                                : "Add favourite"
                        }
                        onPress={() => {
                            handleToggleLikePress();
                        }}
                        disabled={selectedSong.isHidden}
                    />
                </BottomSheetView>
                <SheetOptionsButton
                    icon="album"
                    buttonContent="Go to album (NOT DONE)"
                    onPress={() => {
                        ref.current.dismiss();
                    }}
                    isDisabled={selectedSong.isHidden}
                />
                <SheetOptionsButton
                    icon="chart-timeline-variant-shimmer"
                    buttonContent="View statistics (NOT DONE)"
                    onPress={() => {
                        ref.current.dismiss();
                    }}
                />
                <SheetOptionsButton
                    icon="plus"
                    buttonContent="Add as single (NOT DONE)"
                    onPress={() => {
                        ref.current.dismiss();
                    }}
                    isDisabled={selectedSong.isHidden}
                />
                <SheetOptionsButton
                    icon="pencil"
                    buttonContent="Edit tags (NOT DONE)"
                    onPress={() => {
                        ref.current.dismiss();
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
                    buttonContent={"Delete song from device (not available)"}
                    onPress={handleDeleteSongPress}
                    isDisabled={true}
                />
            </SheetLayout>
            <AddSongToPlaylistBottomSheet ref={addSongBottomSheetRef} />
        </>
    );
});

export default SongSheet;
