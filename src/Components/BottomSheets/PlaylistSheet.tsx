import { forwardRef, useCallback, useRef, useState } from "react";
import { useSongsStore } from "../../store/songs";
import { Spacing } from "../../styles/constants";
import DeletePlaylist from "../Modals/DeletePlaylist";
import LargeOptionButton from "../UI/LargeOptionButton";
import SheetOptionsButton from "../UI/SheetOptionsButton";

import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BottomSheetProps } from "../../types/other";
import { SheetModalLayout } from "./SheetModalLayout";

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
        const dismissEditPlaylist = useCallback(() => {
            EditPlaylistRef.current?.dismiss();
        }, []);

        const AddSongsRef = useRef<BottomSheetModal>(null);
        const dismissAddSongs = useCallback(() => {
            AddSongsRef.current?.dismiss();
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
                <SheetModalLayout ref={ref} title={"custom title"}>
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
                            onPress={()=> AddSongsRef.current?.present()}
                        />
                    </BottomSheetView>
                    <SheetOptionsButton
                        icon="playlist-edit"
                        buttonContent={"Edit playlist"}
                        isDisabled={selectedPlaylist.id === "1"}
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
            </>
        );
    }
);

export default PlaylistSheet;