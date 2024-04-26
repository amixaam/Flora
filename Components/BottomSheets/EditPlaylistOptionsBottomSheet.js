import { BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, useRef, useState } from "react";
import { useSongsStore } from "../../store/songs";
import DeletePlaylistConfirm from "../Modals/DeletePlaylistConfirm";
import SheetOptionsButton from "../UI/SheetOptionsButton";
import ChangeMultipleSongPlaylistStatus from "./ChangeMultipleSongPlaylistStatus";
import EditPlaylistBottomSheet from "./EditPlaylistBottomSheet";
import SheetLayout from "./SheetLayout";

const EditPlaylistOptionsBottomSheet = forwardRef(({ props }, ref) => {
    // TODO: add a confirmation modal for deleting things
    const { selectedPlaylist, deletePlaylist, loadTrack, getSong } =
        useSongsStore();

    const handleDeletePlaylist = () => {
        if (selectedPlaylist.id == 1) return;

        ref.current.dismiss();
        setDeleteConfirm(false);

        deletePlaylist(selectedPlaylist.id);
    };

    const handleEditPlaylist = () => {
        if (selectedPlaylist.id == 1) return;

        ref.current.dismiss();
        editPlaylistBottomSheetRef.current.present();
    };

    const handleAddSongsToPlaylist = () => {
        ref.current.dismiss();
        changeMultipleSongPlaylistStatusBottomSheetRef.current.present();
    };

    const handleShufflePlay = () => {
        loadTrack(
            getSong(
                selectedPlaylist.songs[
                    Math.floor(Math.random() * selectedPlaylist.songs.length)
                ]
            ),
            selectedPlaylist,
            true
        );
        ref.current.dismiss();
    };

    const editPlaylistBottomSheetRef = useRef(null);
    const changeMultipleSongPlaylistStatusBottomSheetRef = useRef(null);

    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const handleDeleteConfirm = () => setDeleteConfirm(!deleteConfirm);

    if (selectedPlaylist === null) return;
    return (
        <>
            <SheetLayout ref={ref} title={"Edit " + selectedPlaylist.name}>
                <BottomSheetView style={{ marginHorizontal: -18 }}>
                    <SheetOptionsButton
                        data={selectedPlaylist}
                        icon="shuffle"
                        buttonContent={"Shuffle play"}
                        onPress={handleShufflePlay}
                    />
                    <SheetOptionsButton
                        data={selectedPlaylist}
                        icon="playlist-plus"
                        buttonContent={"Add songs to playlist"}
                        onPress={handleAddSongsToPlaylist}
                    />
                    <SheetOptionsButton
                        data={selectedPlaylist}
                        icon="playlist-edit"
                        buttonContent={"Edit playlist"}
                        onPress={handleEditPlaylist}
                        isDisabled={selectedPlaylist.id == 1}
                    />
                    <SheetOptionsButton
                        data={selectedPlaylist}
                        icon="playlist-remove"
                        buttonContent={"Delete playlist"}
                        onPress={handleDeleteConfirm}
                        isDisabled={selectedPlaylist.id == 1}
                    />
                </BottomSheetView>
            </SheetLayout>
            <DeletePlaylistConfirm
                visible={deleteConfirm}
                dismiss={handleDeleteConfirm}
                deletePlaylist={handleDeletePlaylist}
            />
            <EditPlaylistBottomSheet ref={editPlaylistBottomSheetRef} />
            <ChangeMultipleSongPlaylistStatus
                ref={changeMultipleSongPlaylistStatusBottomSheetRef}
                mode="add"
            />
        </>
    );
});

export default EditPlaylistOptionsBottomSheet;
