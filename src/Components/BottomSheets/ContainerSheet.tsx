import { forwardRef, useCallback, useRef, useState } from "react";
import { useSongsStore } from "../../store/songs";
import { Spacing } from "../../styles/constants";
import LargeOptionButton from "../UI/LargeOptionButton";
import SheetOptionsButton from "../UI/SheetOptionsButton";

import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BottomSheetProps } from "../../types/other";
import { SheetModalLayout } from "./SheetModalLayout";
import AddSongsToPlaylist from "./AddSongsToPlaylist";
import { Text } from "react-native";
import { textStyles } from "../../styles/text";
import DeleteContainer from "../Modals/DeleteContainer";

const ContainerSheet = forwardRef<BottomSheetModal, BottomSheetProps>(
    (props, ref) => {
        const { selectedContainer, deleteAlbum, deletePlaylist } =
            useSongsStore();

        const [deleteConfirmModal, setDeleteConfirmModal] =
            useState<boolean>(false);

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

        // const handleShufflePlay = () => {
        //     props.dismiss?.();
        //     shuffleList(getSongsFromPlaylist(selectedContainer.id));
        // };

        // const handleAddToQueue = () => {
        //     props.dismiss?.();
        //     addToQueue(getSongsFromPlaylist(selectedContainer.id));
        // };

        return (
            <>
                <SheetModalLayout ref={ref} title={selectedContainer.title}>
                    <BottomSheetView
                        style={{
                            flexDirection: "row",
                            columnGap: Spacing.md,
                            marginHorizontal: Spacing.appPadding,
                        }}
                    >
                        <LargeOptionButton icon="album" text="Add to queue" />
                        <LargeOptionButton icon="shuffle" text="Shuffle play" />

                        <LargeOptionButton
                            icon="playlist-plus"
                            text="Add songs"
                        />
                    </BottomSheetView>
                    <SheetOptionsButton
                        icon="playlist-edit"
                        buttonContent={"Edit " + containerType}
                        isDisabled={selectedContainer.id === "1"}
                    />
                    {containerType === "album" && (
                        <SheetOptionsButton
                            icon="checkbox-multiple-blank"
                            buttonContent={"Sync Song tags"}
                        />
                    )}
                    <SheetOptionsButton
                        icon="trash-can"
                        buttonContent={"Delete " + containerType}
                        isDisabled={selectedContainer.id === "1"}
                        onPress={() => {
                            setDeleteConfirmModal(true);
                        }}
                    />
                </SheetModalLayout>
                <DeleteContainer
                    visible={deleteConfirmModal}
                    dismiss={() => setDeleteConfirmModal(false)}
                    confirm={handleDeleteContainer}
                    containerType={containerType}
                />
            </>
        );
    }
);

export default ContainerSheet;
