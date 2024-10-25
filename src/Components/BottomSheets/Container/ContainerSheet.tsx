import { forwardRef, useState } from "react";
import { useSongsStore } from "../../../store/songsStore";
import { Spacing } from "../../../styles/constants";

import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Easing, Text } from "react-native";
import TextTicker from "react-native-text-ticker";
import useBottomSheetModal from "../../../hooks/useBottomSheetModal";
import { textStyles } from "../../../styles/text";
import { BottomSheetProps } from "../../../types/other";
import { Album, ContainerType, Playlist } from "../../../types/song";
import { CombineStrings } from "../../../utils/CombineStrings";
import Pluralize from "../../../utils/Pluralize";
import LargeOptionButton from "../../UI/Buttons/LargeOptionButton";
import SheetOptionsButton from "../../UI/Buttons/SheetOptionsButton";
import AlbumArt from "../../UI/UI chunks/AlbumArt";
import { UISeperator } from "../../UI/Utils/UISeperator";
import { SheetModalLayout } from "../SheetModalLayout";
import DeleteContainer from "../../Modals/DeleteContainer";
import EditAlbum from "../Album/EditAlbum";
import EditPlaylist from "../Playlist/EditPlaylist";
import AlbumRanking from "../Album/AlbumRanking";
import AddSongsToContainer from "./AddSongsToContainer";

const ContainerSheet = forwardRef<BottomSheetModal, BottomSheetProps>(
    (props, ref) => {
        const {
            selectedContainer,
            deleteContainer,
            shuffleList,
            getSongsFromContainer,
            addToQueue,
        } = useSongsStore();

        const [deleteConfirmModal, setDeleteConfirmModal] =
            useState<boolean>(false);

        const {
            sheetRef: AddSongsToContainerRef,
            open: openAddSongsToContainer,
            close: dismissAddSongsToContainer,
        } = useBottomSheetModal();

        const {
            sheetRef: EditPlaylistRef,
            open: openEditPlaylistRef,
            close: dismissEditPlaylistRef,
        } = useBottomSheetModal();

        const {
            sheetRef: EditAlbumRef,
            open: openEditAlbumRef,
            close: dismissEditAlbumRef,
        } = useBottomSheetModal();

        const {
            sheetRef: AlbumRankingRef,
            open: openAlbumRanking,
            close: dismissAlbumRanking,
        } = useBottomSheetModal();

        if (selectedContainer === undefined) return;

        const handleDeleteContainer = () => {
            props.dismiss?.();
            setDeleteConfirmModal(false);
            deleteContainer(selectedContainer.id);
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
            if (selectedContainer.type === ContainerType.ALBUM)
                openEditAlbumRef();
            else openEditPlaylistRef();
        };

        return (
            <>
                <SheetModalLayout
                    ref={ref}
                    customHeader={
                        <ContainerSheetHeader container={selectedContainer} />
                    }
                >
                    <BottomSheetView
                        testID="container-sheet"
                        style={{
                            gap: Spacing.md,
                        }}
                    >
                        <BottomSheetView
                            style={{
                                flexDirection: "row",
                                columnGap: Spacing.md,
                                marginHorizontal: Spacing.appPadding,
                            }}
                        >
                            <LargeOptionButton
                                icon="shuffle"
                                text="Shuffle play"
                                onPress={handleShufflePlay}
                            />
                            <LargeOptionButton
                                icon="album"
                                text="Add to queue"
                                onPress={handleAddToQueue}
                            />
                            <LargeOptionButton
                                icon="playlist-plus"
                                text="Add songs"
                                onPress={openAddSongsToContainer}
                            />
                        </BottomSheetView>

                        <UISeperator />

                        <BottomSheetView style={{ marginTop: -Spacing.sm }}>
                            {selectedContainer.type === ContainerType.ALBUM && (
                                <SheetOptionsButton
                                    icon="chart-timeline-variant-shimmer"
                                    buttonContent={"Album ranking"}
                                    isDisabled={selectedContainer.id === "1"}
                                    onPress={openAlbumRanking}
                                />
                            )}
                            <SheetOptionsButton
                                icon="playlist-edit"
                                buttonContent={"Edit " + selectedContainer.type}
                                isDisabled={selectedContainer.id === "1"}
                                onPress={() => {
                                    handleEditContainer();
                                }}
                            />
                            <SheetOptionsButton
                                icon="trash-can"
                                buttonContent={
                                    "Delete " + selectedContainer.type
                                }
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
                    containerType={selectedContainer.type}
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
                <AlbumRanking
                    ref={AlbumRankingRef}
                    dismiss={dismissAlbumRanking}
                />
            </>
        );
    }
);

const ContainerSheetHeader = ({
    container,
}: {
    container: Playlist | Album;
}) => {
    let smallText: string;
    if (container.type === ContainerType.PLAYLIST) {
        smallText = Pluralize(container.songs.length, "song", "songs");
    } else {
        smallText = CombineStrings([container.artist, container.year]);
    }

    return (
        <BottomSheetView
            style={{
                marginBottom: Spacing.md,
                marginHorizontal: Spacing.appPadding,

                gap: Spacing.md,

                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <BottomSheetView
                style={{
                    gap: Spacing.mmd,
                    flex: 1,

                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <AlbumArt
                    image={container.artwork}
                    style={{ width: 42 }}
                    radius={Spacing.radiusSm}
                />
                <BottomSheetView style={{ flex: 1 }}>
                    <TextTicker
                        key={container.title}
                        style={textStyles.h6}
                        duration={12 * 1000}
                        marqueeDelay={2 * 1000}
                        easing={Easing.linear}
                        bounce={false}
                        scroll={false}
                        loop
                    >
                        {container.title}
                    </TextTicker>
                    <Text
                        style={[
                            textStyles.small,
                            { marginBottom: -2, opacity: 0.75 },
                        ]}
                    >
                        {smallText}
                    </Text>
                </BottomSheetView>
            </BottomSheetView>
        </BottomSheetView>
    );
};

export default ContainerSheet;
