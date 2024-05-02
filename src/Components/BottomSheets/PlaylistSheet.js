import { BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, useRef, useState } from "react";
import { useSongsStore } from "../../store/songs";
import DeletePlaylistConfirm from "../Modals/DeletePlaylistConfirm";
import SheetOptionsButton from "../UI/SheetOptionsButton";
import ChangeMultipleSongPlaylistStatus from "./ChangeMultipleSongPlaylistStatus";
import EditPlaylistBottomSheet from "./EditPlaylistBottomSheet";
import SheetLayout from "./SheetLayout";
import UpdateAlbumsConfirm from "../Modals/UpdateAlbumsConfirm";
import LargeOptionButton from "../UI/LargeOptionButton";
import { spacing } from "../../styles/constants";

const PlaylistSheet = forwardRef(({ props }, ref) => {
    const {
        selectedPlaylist,
        deletePlaylist,
        loadTrack,
        getSong,
        inheritPlatlistDataToSongs,
        addToQueue,
        getSongDataFromPlaylist,
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

    const handleAddToQueuePress = () => {
        addToQueue(getSongDataFromPlaylist(selectedPlaylist.id));
    };

    if (selectedPlaylist === null) return;
    return (
        <>
            <SheetLayout ref={ref} title={"Edit " + selectedPlaylist.name}>
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
                        icon="shuffle"
                        text="Shuffle play"
                        onPress={handleShufflePlay}
                    />

                    <LargeOptionButton
                        icon="playlist-plus"
                        text="Add songs"
                        onPress={handleAddSongsToPlaylist}
                    />
                </BottomSheetView>
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
                    icon="trash-can"
                    buttonContent={"Delete playlist"}
                    onPress={handleDeleteConfirm}
                    isDisabled={selectedPlaylist.id == 1}
                />
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
            />
        </>
    );
});

export default PlaylistSheet;
