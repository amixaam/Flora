import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { useCallback, useRef } from "react";
import { useSongsStore } from "../../../store/songs";
import { Spacing } from "../../../styles/constants";
import ContainerSheet from "../../BottomSheets/Container/ContainerSheet";
import ListItemsNotFound from "../Text/ListItemsNotFound";
import ContainerItem from "./ContainerItem";
import { TopButtonControls } from "./TopPlaybackSorting";
import { View } from "react-native";

export const TwoColContainerList = ({
    type,
    selectedItems,
    toggle,
}: {
    type: "album" | "playlist";
    selectedItems: string[];
    toggle: (item: string) => void;
}) => {
    const {
        albums,
        playlists,
        setSelectedContainer,
        getAllAlbumSongs,
        getAllPlaylistSongs,
    } = useSongsStore();

    const data = type === "album" ? albums : playlists;

    const allSongs =
        type === "album" ? getAllAlbumSongs() : getAllPlaylistSongs();

    const ContainerOptionsRef = useRef<BottomSheetModal>(null);
    const openContainerOptions = useCallback(() => {
        ContainerOptionsRef.current?.present();
    }, []);

    const dismissContainerOptions = useCallback(() => {
        ContainerOptionsRef.current?.dismiss();
    }, []);

    const onPress = (id: string) => {
        if (selectedItems.length > 0) {
            toggle(id);
        } else {
            router.push(`(tabs)/${type}s/${id}`);
        }
    };

    return (
        <>
            <FlashList
                numColumns={2}
                // @ts-ignore
                data={data}
                extraData={[data, selectedItems]}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                    <TopButtonControls
                        type={type}
                        count={data.length}
                        songs={allSongs ? allSongs : []}
                    />
                }
                contentContainerStyle={{
                    paddingBottom: Spacing.md + Spacing.miniPlayer,
                    paddingHorizontal: Spacing.sm,
                }}
                ListEmptyComponent={
                    <ListItemsNotFound
                        text={`No ${type}s found!`}
                        icon={type}
                    />
                }
                ItemSeparatorComponent={() => (
                    <View style={{ height: Spacing.sm }} />
                )}
                estimatedItemSize={50}
                renderItem={({ item }) => (
                    <ContainerItem
                        item={item}
                        // selected={selectedItems.includes(item.id)}
                        style={{
                            marginHorizontal: Spacing.sm,
                        }}
                        icon={{
                            onPress: async () => {
                                await setSelectedContainer(item);
                                openContainerOptions();
                            },
                        }}
                        onLongPress={async () => {
                            await setSelectedContainer(item);
                            openContainerOptions();
                        }}
                        onPress={() => onPress(item.id)}
                    />
                )}
            />
            <ContainerSheet
                ref={ContainerOptionsRef}
                dismiss={dismissContainerOptions}
            />
        </>
    );
};
