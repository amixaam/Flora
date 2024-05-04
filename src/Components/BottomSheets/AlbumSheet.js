import { BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, useRef, useState } from "react";
import { useSongsStore } from "../../store/songs";
import { Spacing } from "../../styles/constants";
import UpdateAlbumsConfirm from "../Modals/UpdateAlbumsConfirm";
import LargeOptionButton from "../UI/LargeOptionButton";
import SheetOptionsButton from "../UI/SheetOptionsButton";
import SheetLayout from "./SheetLayout";
import EditAlbum from "./EditAlbum";
import DeleteAlbum from "../Modals/DeleteAlbum";
import AddSongsToAlbum from "./AddSongsToAlbum";

const AlbumSheet = forwardRef(({ props }, ref) => {
    const {
        selectedAlbum,
        deleteAlbum,
        getAlbumSongData,
        copyAlbumTagsToSongs,

        addToQueue,
        shuffleList,
    } = useSongsStore();

    const editAlbumSheet = useRef(null);
    const addSongsSheet = useRef(null);

    const handleDeleteAlbum = () => {
        ref.current.dismiss();
        setDeleteConfirm(false);

        deleteAlbum(selectedAlbum.id);
    };

    const handleEditAlbum = () => {
        ref.current.dismiss();
        editAlbumSheet.current.present();
    };

    const handleAddSongsToAlbum = () => {
        ref.current.dismiss();
        addSongsSheet.current.present();
    };

    const handleShufflePlay = () => {
        shuffleList(getAlbumSongData(selectedAlbum.id));
        ref.current.dismiss();
    };

    const handleAddToQueuePress = () => {
        addToQueue(getAlbumSongData(selectedAlbum.id));
    };

    const hanldeUpdateTags = () => {
        copyAlbumTagsToSongs(selectedAlbum.id);

        ref.current.dismiss();
        setUpdateCoversConfirm(false);
    };

    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [updateCoversConfirm, setUpdateCoversConfirm] = useState(false);

    const handleDeleteConfirm = () => setDeleteConfirm(!deleteConfirm);
    const handleUpdateCoversConfirm = () =>
        setUpdateCoversConfirm(!updateCoversConfirm);

    if (selectedAlbum === null) return;
    return (
        <>
            <SheetLayout ref={ref} title={selectedAlbum.title}>
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
                        onPress={handleAddSongsToAlbum}
                    />
                </BottomSheetView>
                <SheetOptionsButton
                    data={selectedAlbum}
                    icon="playlist-edit"
                    buttonContent={"Edit album"}
                    onPress={handleEditAlbum}
                    isDisabled={selectedAlbum.id == 1}
                />
                <SheetOptionsButton
                    data={selectedAlbum}
                    icon="checkbox-multiple-blank"
                    buttonContent={"Update songs with album metadata"}
                    onPress={handleUpdateCoversConfirm}
                    isDisabled={selectedAlbum.id == 1}
                />

                <SheetOptionsButton
                    data={selectedAlbum}
                    icon="trash-can"
                    buttonContent={"Delete album"}
                    onPress={handleDeleteConfirm}
                    isDisabled={selectedAlbum.id == 1}
                />
            </SheetLayout>
            <EditAlbum ref={editAlbumSheet} />
            <AddSongsToAlbum ref={addSongsSheet} />

            <UpdateAlbumsConfirm
                visible={updateCoversConfirm}
                dismiss={handleUpdateCoversConfirm}
                confirm={hanldeUpdateTags}
            />
            <DeleteAlbum
                visible={deleteConfirm}
                confirm={handleDeleteAlbum}
                dismiss={handleDeleteConfirm}
            />
        </>
    );
});

export default AlbumSheet;
