import BottomSheetModal, { BottomSheetView } from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { forwardRef, useRef } from "react";
import { useSongsStore } from "../../store/songs";
import { Spacing } from "../../styles/constants";
import LargeOptionButton from "../UI/LargeOptionButton";
import SheetOptionsButton from "../UI/SheetOptionsButton";
import AddSongToPlaylistBottomSheet from "./AddSongToPlaylistBottomSheet";
import SheetLayout from "./SheetLayout";

const SongSheet = forwardRef<BottomSheetModal, BottomSheetModalMethods>(
    ({ dismiss }, ref) => {
        const {
            selectedSong,
            hideSong,
            unhideSong,
            likeSong,
            unlikeSong,
            addToQueue,
        } = useSongsStore();

        const addSongBottomSheetRef = useRef<BottomSheetModal>(null);
        const handleOpenAddSongBottomSheet = () =>
            addSongBottomSheetRef.current?.expand();

        if (selectedSong === null || ref === null) return;

        const handleHideSongPress = () => {
            dismiss();
            if (selectedSong.isHidden) {
                selectedSong.isHidden = false;
                unhideSong(selectedSong.id);
            } else {
                selectedSong.isHidden = true;
                hideSong(selectedSong.id);
            }
        };

        const handleDeleteSongPress = () => {
            dismiss();
        };

        const handleToggleLikePress = () => {
            if (selectedSong.isLiked) {
                selectedSong.isLiked = false;
                unlikeSong(selectedSong.id);
            } else {
                selectedSong.isLiked = true;
                likeSong(selectedSong.id);
            }
        };

        const handleAddToQueuePress = () => {
            addToQueue(selectedSong);
        };

        return (
            <>
                <SheetLayout ref={ref} title={selectedSong.title}>
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
                                dismiss();

                                handleAddToQueuePress();
                            }}
                            disabled={selectedSong.isHidden}
                        />
                        <LargeOptionButton
                            icon="playlist-plus"
                            text="Add to playlist"
                            onPress={() => {
                                dismiss();

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
                                handleToggleLikePress();
                            }}
                            disabled={selectedSong.isHidden}
                        />
                    </BottomSheetView>
                    <SheetOptionsButton
                        icon="album"
                        buttonContent="Go to album (NOT DONE)"
                        onPress={() => {
                            dismiss();
                        }}
                        isDisabled={selectedSong.isHidden}
                    />
                    <SheetOptionsButton
                        icon="chart-timeline-variant-shimmer"
                        buttonContent="View statistics (NOT DONE)"
                        onPress={() => {
                            dismiss();
                        }}
                    />
                    <SheetOptionsButton
                        icon="plus"
                        buttonContent="Add as single (NOT DONE)"
                        onPress={() => {
                            dismiss();
                        }}
                        isDisabled={selectedSong.isHidden}
                    />
                    <SheetOptionsButton
                        icon="pencil"
                        buttonContent="Edit tags (NOT DONE)"
                        onPress={() => {
                            dismiss();
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
                </SheetLayout>
                <AddSongToPlaylistBottomSheet ref={addSongBottomSheetRef} />
            </>
        );
    }
);

export default SongSheet;
