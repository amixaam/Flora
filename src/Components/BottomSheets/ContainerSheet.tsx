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

const PlaylistSheet = forwardRef<BottomSheetModal, BottomSheetProps>(
    (props, ref) => {
        const { selectedContainer } = useSongsStore();
        
        if (selectedContainer === undefined) return;
        
        const containerType = selectedContainer?.id[0];

        // const handleDeletePlaylist = () => {
        //     props.dismiss?.();
        //     setDeleteConfirmModal(false);

        //     deletePlaylist(selectedContainer.id);
        // };

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
                    <Text style={[textStyles.h5]}>{containerType}</Text>
                    <SheetOptionsButton
                        icon="playlist-edit"
                        buttonContent={"Edit N"}
                        isDisabled={selectedContainer.id === "1"}
                    />
                    <SheetOptionsButton
                        icon="trash-can"
                        buttonContent={"Delete N"}
                        isDisabled={selectedContainer.id === "1"}
                    />
                </SheetModalLayout>
            </>
        );
    }
);

export default PlaylistSheet;
