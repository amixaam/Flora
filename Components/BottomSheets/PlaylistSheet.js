import { BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, useRef, useState } from "react";
import { useSongsStore } from "../../store/songs";
import DeletePlaylistConfirm from "../Modals/DeletePlaylistConfirm";
import SheetOptionsButton from "../UI/SheetOptionsButton";
import ChangeMultipleSongPlaylistStatus from "./ChangeMultipleSongPlaylistStatus";
import EditPlaylistBottomSheet from "./EditPlaylistBottomSheet";
import SheetLayout from "./SheetLayout";
import UpdateAlbumsConfirm from "../Modals/UpdateAlbumsConfirm";

const EditPlaylistOptionsBottomSheet = forwardRef(({ props }, ref) => {
    const {
        selectedPlaylist,
        deletePlaylist,
        loadTrack,
        getSong,
        inheritPlatlistDataToSongs,
    } = useSongsStore();

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

    const hanldeUpdateSongCovers = () => {
        inheritPlatlistDataToSongs(selectedPlaylist.id);
        ref.current.dismiss();
        setUpdateCoversConfirm(false);
    };

    const editPlaylistBottomSheetRef = useRef(null);
    const changeMultipleSongPlaylistStatusBottomSheetRef = useRef(null);

    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const handleDeleteConfirm = () => setDeleteConfirm(!deleteConfirm);

    const [updateCoversConfirm, setUpdateCoversConfirm] = useState(false);
    const handleUpdateCoversConfirm = () =>
        setUpdateCoversConfirm(!updateCoversConfirm);

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
                        icon="checkbox-multiple-blank"
                        buttonContent={"Update songs with playlist metadata"}
                        onPress={handleUpdateCoversConfirm}
                        isDisabled={selectedPlaylist.id == 1}
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
            <UpdateAlbumsConfirm
                visible={updateCoversConfirm}
                dismiss={handleUpdateCoversConfirm}
                confirm={hanldeUpdateSongCovers}
            />
            <DeletePlaylistConfirm
                visible={deleteConfirm}
                dismiss={handleDeleteConfirm}
                confirm={handleDeletePlaylist}
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
