import { BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, useRef } from "react";
import { useSongsStore } from "../../store/songs";
import SheetOptionsButton from "../UI/SheetOptionsButton";
import AddSongToPlaylistBottomSheet from "./AddSongToPlaylistBottomSheet";
import SheetLayout from "./SheetLayout";
import RemoveSongToPlaylistBottomSheet from "./removeSongFromPlaylistBottomSheet";
import { spacing } from "../../styles/constants";

const EditSongBottomSheet = forwardRef(({ props }, ref) => {
    const { selectedSong, hideSong, unhideSong } = useSongsStore();

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

    if (selectedSong === null) return;
    return (
        <>
            <SheetLayout ref={ref} title={"Edit " + selectedSong.title}>
                <BottomSheetView
                    style={{ marginHorizontal: -spacing.appPadding }}
                >
                    <SheetOptionsButton
                        icon="playlist-plus"
                        buttonContent={"Add to playlist"}
                        onPress={() => {
                            ref.current.dismiss();
                            handleOpenAddSongBottomSheet();
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
                        buttonContent={"Delete song from device"}
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

export default EditSongBottomSheet;
