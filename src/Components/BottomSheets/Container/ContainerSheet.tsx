import { forwardRef, useCallback, useRef, useState } from "react";
import { useSongsStore } from "../../../store/songs";
import { Spacing } from "../../../styles/constants";

import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Easing, Text } from "react-native";
import TextTicker from "react-native-text-ticker";
import { textStyles } from "../../../styles/text";
import { BottomSheetProps } from "../../../types/other";
import { Album, Playlist } from "../../../types/song";
import { CombineStrings } from "../../../utils/CombineStrings";
import Pluralize from "../../../utils/Pluralize";
import DeleteContainer from "../../Modals/DeleteContainer";
import AlbumRanking from "../Album/AlbumRanking";
import EditAlbum from "../Album/EditAlbum";
import EditPlaylist from "../Playlist/EditPlaylist";
import { SheetModalLayout } from "../SheetModalLayout";
import AddSongsToContainer from "./AddSongsToContainer";
import LargeOptionButton from "../../UI/Buttons/LargeOptionButton";
import { UISeperator } from "../../UI/Utils/UISeperator";
import SheetOptionsButton from "../../UI/Buttons/SheetOptionsButton";
import AlbumArt from "../../UI/UI chunks/AlbumArt";

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

        const AlbumRankingRef = useRef<BottomSheetModal>(null);
        const openAlbumRanking = useCallback(() => {
            AlbumRankingRef.current?.present();
        }, []);

        const dismissAlbumRanking = useCallback(() => {
            AlbumRankingRef.current?.dismiss();
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
            if (containerType === "album") {
                openEditAlbumRef();
            } else {
                openEditPlaylistRef();
            }
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
                            {containerType === "album" && (
                                <SheetOptionsButton
                                    icon="chart-timeline-variant-shimmer"
                                    buttonContent={"Album ranking"}
                                    isDisabled={selectedContainer.id === "1"}
                                    onPress={openAlbumRanking}
                                />
                            )}
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
    if ("description" in container) {
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
