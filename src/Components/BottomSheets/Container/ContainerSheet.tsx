import { forwardRef, useCallback, useRef, useState } from "react";
import { useSongsStore } from "../../../store/songs";
import { Spacing } from "../../../styles/constants";
import LargeOptionButton from "../../UI/LargeOptionButton";
import SheetOptionsButton from "../../UI/SheetOptionsButton";

import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BottomSheetProps } from "../../../types/other";
import DeleteContainer from "../../Modals/DeleteContainer";
import { UISeperator } from "../../UI/UISeperator";
import EditAlbum from "../Album/EditAlbum";
import EditPlaylist from "../Playlist/EditPlaylist";
import { SheetModalLayout } from "../SheetModalLayout";
import AddSongsToContainer from "./AddSongsToContainer";

const ContainerSheet = forwardRef<BottomSheetModal, BottomSheetProps>(
    (props, ref) => {
        const {
            selectedContainer,
            deleteAlbum,
            deletePlaylist,
            shuffleList,
            getSongsFromContainer,
            addToQueue,
        } = useSongsStore();

        const [deleteConfirmModal, setDeleteConfirmModal] =
            useState<boolean>(false);

        const AddSongsToContainerRef = useRef<BottomSheetModal>(null);
        const openAddSongsToContainer = useCallback(() => {
            AddSongsToContainerRef.current?.present();
        }, []);

        const dismissAddSongsToContainer = useCallback(() => {
            AddSongsToContainerRef.current?.dismiss();
        }, []);

        const EditPlaylistRef = useRef<BottomSheetModal>(null);
        const openEditPlaylistRef = useCallback(() => {
            EditPlaylistRef.current?.present();
        }, []);

        const dismissEditPlaylistRef = useCallback(() => {
            EditPlaylistRef.current?.dismiss();
        }, []);

        const EditAlbumRef = useRef<BottomSheetModal>(null);
        const openEditAlbumRef = useCallback(() => {
            EditAlbumRef.current?.present();
        }, []);

        const dismissEditAlbumRef = useCallback(() => {
            EditAlbumRef.current?.dismiss();
        }, []);

        if (selectedContainer === undefined) return;

        const containerType =
            selectedContainer?.id[0] === "P" ||
            parseInt(selectedContainer?.id[0]) == 1
                ? "playlist"
                : "album";

        const handleDeleteContainer = () => {
            props.dismiss?.();
            setDeleteConfirmModal(false);

            if (containerType === "album") {
                deleteAlbum(selectedContainer.id);
            } else {
                deletePlaylist(selectedContainer.id);
            }
        };

        const handleShufflePlay = () => {
            props.dismiss?.();
            shuffleList(getSongsFromContainer(selectedContainer.id));
        };

        const handleAddToQueue = () => {
            props.dismiss?.();
            addToQueue(getSongsFromContainer(selectedContainer.id));
        };

        const handleEditContainer = () => {
            props.dismiss?.();

            if (containerType === "album") {
                openEditAlbumRef();
            } else {
                openEditPlaylistRef();
            }
        };

        return (
            <>
                <SheetModalLayout ref={ref} title={selectedContainer.title}>
                    <BottomSheetView
                        style={{
                            marginHorizontal: Spacing.appPadding,
                            gap: Spacing.md,
                        }}
                    >
                        <BottomSheetView
                            style={{
                                flexDirection: "row",
                                columnGap: Spacing.md,
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
                                onPress={openAddSongsToContainer}
                            />
                        </BottomSheetView>
                        <UISeperator />

                        <BottomSheetView style={{ marginTop: -Spacing.sm }}>
                            <SheetOptionsButton
                                icon="playlist-edit"
                                buttonContent={"Edit " + containerType}
                                isDisabled={selectedContainer.id === "1"}
                                onPress={() => {
                                    handleEditContainer();
                                }}
                            />
                            <SheetOptionsButton
                                icon="trash-can"
                                buttonContent={"Delete " + containerType}
                                isDisabled={selectedContainer.id === "1"}
                                onPress={() => {
                                    setDeleteConfirmModal(true);
                                }}
                            />
                        </BottomSheetView>
                    </BottomSheetView>
                </SheetModalLayout>
                <DeleteContainer
                    visible={deleteConfirmModal}
                    dismiss={() => setDeleteConfirmModal(false)}
                    confirm={handleDeleteContainer}
                    containerType={containerType}
                />
                <AddSongsToContainer
                    ref={AddSongsToContainerRef}
                    dismiss={dismissAddSongsToContainer}
                />
                <EditAlbum ref={EditAlbumRef} dismiss={dismissEditAlbumRef} />
                <EditPlaylist
                    ref={EditPlaylistRef}
                    dismiss={dismissEditPlaylistRef}
                />
            </>
        );
    }
);

export default ContainerSheet;
