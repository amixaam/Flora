import { forwardRef, useCallback, useRef, useState } from "react";
import { useSongsStore } from "../../store/songs";
import { Spacing } from "../../styles/constants";
import DeletePlaylist from "../Modals/DeletePlaylist";
import LargeOptionButton from "../UI/LargeOptionButton";
import SheetOptionsButton from "../UI/SheetOptionsButton";

import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BottomSheetProps } from "../../types/other";
import { SheetModalLayout } from "./SheetModalLayout";
import EditPlaylist from "./EditPlaylist";
import AddSongsToPlaylist from "./AddSongsToPlaylist";

const PlaylistSheet = forwardRef<BottomSheetModal, BottomSheetProps>(
    (props, ref) => {
        const {
            selectedPlaylist,
            deletePlaylist,
            shuffleList,
            addToQueue,
            getSongsFromPlaylist,
        } = useSongsStore();

        const [deleteConfirmModal, setDeleteConfirmModal] =
            useState<boolean>(false);

        const EditPlaylistRef = useRef<BottomSheetModal>(null);
        const openEditPlaylist = useCallback(() => {
            EditPlaylistRef.current?.present();
        }, []);
        const dismissEditPlaylist = useCallback(() => {
            EditPlaylistRef.current?.dismiss();
        }, []);

        const AddSongsRef = useRef<BottomSheetModal>(null);
        const openAddSongs = useCallback(() => {
            AddSongsRef.current?.present();
        }, []);

        if (selectedPlaylist === null) return null;

        const handleDeletePlaylist = () => {
            props.dismiss?.();
            setDeleteConfirmModal(false);

            deletePlaylist(selectedPlaylist.id);
        };

        const handleShufflePlay = () => {
            props.dismiss?.();
            shuffleList(getSongsFromPlaylist(selectedPlaylist.id));
        };

        const handleAddToQueue = () => {
            props.dismiss?.();
            addToQueue(getSongsFromPlaylist(selectedPlaylist.id));
        };

        return (
            <>
                <SheetModalLayout ref={ref} title={selectedPlaylist.title}>
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
                            onPress={handleAddToQueue}
                        />
                        <LargeOptionButton
                            icon="shuffle"
                            text="Shuffle play"
                            onPress={handleShufflePlay}
                        />

                        <LargeOptionButton
                            icon="playlist-plus"
                            text="Add songs"
                            onPress={openAddSongs}
                        />
                    </BottomSheetView>
                    <SheetOptionsButton
                        icon="playlist-edit"
                        buttonContent={"Edit playlist"}
                        isDisabled={selectedPlaylist.id === "1"}
                        onPress={openEditPlaylist}
                    />
                    <SheetOptionsButton
                        icon="trash-can"
                        buttonContent={"Delete playlist"}
                        isDisabled={selectedPlaylist.id === "1"}
                        onPress={() => setDeleteConfirmModal(true)}
                    />
                </SheetModalLayout>
                <DeletePlaylist
                    visible={deleteConfirmModal}
                    dismiss={() => setDeleteConfirmModal(false)}
                    confirm={handleDeletePlaylist}
                />
                <EditPlaylist
                    ref={EditPlaylistRef}
                    dismiss={dismissEditPlaylist}
                />
                <AddSongsToPlaylist ref={AddSongsRef}/>
            </>
        );
    }
);

export default PlaylistSheet;
