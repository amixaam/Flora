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
import DeleteAlbum from "../Modals/DeleteAlbum";

const AlbumSheet = forwardRef<BottomSheetModal, BottomSheetProps>(
    (props, ref) => {
        const {
            selectedAlbum,
            deleteAlbum,
            getSongsFromAlbum,
            shuffleList,
            addToQueue,
        } = useSongsStore();

        const [deleteConfirmModal, setDeleteConfirmModal] =
            useState<boolean>(false);

        const EditAlbumRef = useRef<BottomSheetModal>(null);
        const openEditAlbum = useCallback(() => {
            EditAlbumRef.current?.present();
        }, []);
        const dismissEditAlbum = useCallback(() => {
            EditAlbumRef.current?.dismiss();
        }, []);

        const AddSongsRef = useRef<BottomSheetModal>(null);
        const openAddSongs = useCallback(() => {
            AddSongsRef.current?.present();
        }, []);

        if (selectedAlbum === null) return null;

        const handleDeleteAlbum = () => {
            props.dismiss?.();
            setDeleteConfirmModal(false);

            deleteAlbum(selectedAlbum.id);
        };

        const handleShufflePlay = () => {
            props.dismiss?.();
            shuffleList(getSongsFromAlbum(selectedAlbum.id));
        };

        const handleAddToQueue = () => {
            props.dismiss?.();
            addToQueue(getSongsFromAlbum(selectedAlbum.id));
        };

        return (
            <>
                <SheetModalLayout ref={ref} title={selectedAlbum.title}>
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
                        buttonContent={"Edit album"}
                        onPress={openEditAlbum}
                    />
                    <SheetOptionsButton
                        icon="trash-can"
                        buttonContent={"Delete album"}
                        onPress={() => setDeleteConfirmModal(true)}
                    />
                </SheetModalLayout>
                <DeleteAlbum
                    visible={deleteConfirmModal}
                    dismiss={() => setDeleteConfirmModal(false)}
                    confirm={handleDeleteAlbum}
                />
                <EditPlaylist ref={EditAlbumRef} dismiss={dismissEditAlbum} />
                <AddSongsToPlaylist ref={AddSongsRef} />
            </>
        );
    }
);

export default AlbumSheet;
