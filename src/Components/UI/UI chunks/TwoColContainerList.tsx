import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSongsStore } from "../../../store/songs";
import { useCallback, useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { Spacing } from "../../../styles/constants";
import ContainerItem from "./ContainerItem";
import { router } from "expo-router";
import ContainerSheet from "../../BottomSheets/Container/ContainerSheet";
import { TopButtonControls } from "./TopPlaybackSorting";
import ListItemsNotFound from "../Text/ListItemsNotFound";

export const TwoColContainerList = ({
    type,
}: {
    type: "album" | "playlist";
}) => {
    const {
        albums,
        playlists,
        setSelectedContainer,
        getAllAlbumSongs,
        getAllPlaylistSongs,
    } = useSongsStore();

    const insets = useSafeAreaInsets();

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

    return (
        <>
            <FlashList
                numColumns={2}
                // @ts-ignore
                data={data}
                keyExtractor={(item) => item.id}
                // ListHeaderComponent={
                //     <TopButtonControls songs={allSongs ? allSongs : []} />
                // }
                contentContainerStyle={{
                    paddingBottom: Spacing.md + Spacing.miniPlayer,
                    paddingHorizontal: Spacing.appPadding - Spacing.sm,
                }}
                ListEmptyComponent={
                    <ListItemsNotFound
                        text={`No ${type}s found!`}
                        icon={type}
                    />
                }
                estimatedItemSize={50}
                renderItem={({ item }) => (
                    <ContainerItem
                        viewProps={{
                            style: {
                                margin: Spacing.sm,
                            },
                        }}
                        item={item}
                        touchableProps={{
                            onPress: () => {
                                router.push(`(tabs)/${type}s/${item.id}`);
                            },
                            onLongPress: () => {
                                setSelectedContainer(item);
                                openContainerOptions();
                            },
                        }}
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
