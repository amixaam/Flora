import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, useRef, useState } from "react";
import { useSongsStore } from "../../store/songs";
import { Spacing } from "../../styles/constants";
import DeletePlaylistConfirm from "../Modals/DeletePlaylistConfirm";
import LargeOptionButton from "../UI/LargeOptionButton";
import SheetOptionsButton from "../UI/SheetOptionsButton";
import AddSongsToPlaylist from "./AddSongsToPlaylist";
import EditPlaylistBottomSheet from "./EditPlaylistBottomSheet";
import SheetLayout from "./SheetLayout";

interface DismissProps {
    dismiss: () => void;
}

const PlaylistSheet = forwardRef<BottomSheetModal, DismissProps>(
    (props, ref) => {
        const {
            selectedPlaylist,
            deletePlaylist,
            shuffleList,
            addToQueue,
            getSongsFromPlaylist,
        } = useSongsStore();

        const editPlaylistBottomSheetRef = useRef<BottomSheetModal>(null);
        const openEditPlaylist = () =>
            editPlaylistBottomSheetRef.current?.present();
        const dismissEditPlaylist = () =>
            editPlaylistBottomSheetRef.current?.dismiss();

        const addSongsBottomSheetRef = useRef<BottomSheetModal>(null);
        const openAddSongs = () => addSongsBottomSheetRef.current?.present();

        const [deleteConfirm, setDeleteConfirm] = useState(false);

        if (selectedPlaylist === null || ref === undefined) return;

        const handleDeletePlaylist = () => {
            if (selectedPlaylist.id === "1") return;

            props.dismiss();
            setDeleteConfirm(false);

            deletePlaylist(selectedPlaylist.id);
        };

        const handleEditPlaylist = () => {
            if (selectedPlaylist.id === "1") return;

            props.dismiss();
            openEditPlaylist();
        };

        const handleAddSongsToPlaylist = () => {
            props.dismiss();
            openAddSongs();
        };

        const handleShufflePlay = () => {
            shuffleList(getSongsFromPlaylist(selectedPlaylist.id));
            props.dismiss();
        };

        const handleDeleteConfirm = () => setDeleteConfirm(!deleteConfirm);

        const handleAddToQueuePress = () => {
            props.dismiss();
            addToQueue(getSongsFromPlaylist(selectedPlaylist.id));
        };

        return (
            <>
                <SheetLayout ref={ref} title={selectedPlaylist.title}>
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
                            onPress={handleAddToQueuePress}
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
                        icon="playlist-edit"
                        buttonContent={"Edit playlist"}
                        onPress={handleEditPlaylist}
                        isDisabled={selectedPlaylist.id === "1"}
                    />
                    <SheetOptionsButton
                        icon="trash-can"
                        buttonContent={"Delete playlist"}
                        onPress={handleDeleteConfirm}
                        isDisabled={selectedPlaylist.id === "1"}
                    />
                </SheetLayout>
                <DeletePlaylistConfirm
                    visible={deleteConfirm}
                    dismiss={handleDeleteConfirm}
                    confirm={handleDeletePlaylist}
                />
                <EditPlaylistBottomSheet
                    ref={editPlaylistBottomSheetRef}
                    dismiss={dismissEditPlaylist}
                />
                <AddSongsToPlaylist ref={addSongsBottomSheetRef} />
            </>
        );
    }
);

export default PlaylistSheet;
