import { router, useNavigation } from "expo-router";
import { View } from "react-native";

import { FlashList } from "@shopify/flash-list";
import { useCallback, useEffect, useRef } from "react";
import { useSongsStore } from "../../../store/songs";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackgroundImageAbsolute from "../../../Components/BackgroundImageAbsolute";
import ContainerSheet from "../../../Components/BottomSheets/ContainerSheet";
import CreatePlaylist from "../../../Components/BottomSheets/CreatePlaylist";
import { TopButtonControls } from "../../../Components/TopPlaybackSorting";
import ContainerItem from "../../../Components/UI/ContainerItem";
import IconButton from "../../../Components/UI/IconButton";
import { Spacing } from "../../../styles/constants";
import { mainStyles } from "../../../styles/styles";

export default function PlaylistsTab() {
    const { playlists, setSelectedContainer, getAllPlaylistSongs } =
        useSongsStore();

    const insets = useSafeAreaInsets();

    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton
                    icon="plus"
                    touchableOpacityProps={{
                        onPress: openCreatePlaylist,
                    }}
                />
            ),
        });
    }, [navigation]);

    const CreatePlaylistRef = useRef<BottomSheetModal>(null);
    const openCreatePlaylist = useCallback(
        () => CreatePlaylistRef.current?.present(),
        []
    );
    const dismissCreatePlaylist = useCallback(
        () => CreatePlaylistRef.current?.dismiss(),
        []
    );

    const ContainerOptionsRef = useRef<BottomSheetModal>(null);
    const openContainerOptions = useCallback(() => {
        ContainerOptionsRef.current?.present();
    }, []);

    const dismissContainerOptions = useCallback(() => {
        ContainerOptionsRef.current?.dismiss();
    }, []);

    const allSongs = getAllPlaylistSongs();

    return (
        <View style={[mainStyles.container]}>
            <BackgroundImageAbsolute />

            <FlashList
                numColumns={2}
                data={playlists}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                    <TopButtonControls songs={allSongs ? allSongs : []} />
                }
                contentContainerStyle={{
                    paddingTop: insets.top * 2,
                    paddingBottom: insets.bottom + Spacing.miniPlayer,
                    paddingHorizontal: Spacing.appPadding - Spacing.sm,
                }}
                estimatedItemSize={100}
                renderItem={({ item }) => (
                    <ContainerItem
                        item={item}
                        touchableProps={{
                            onPress: () => {
                                router.push(`(tabs)/playlists/${item.id}`);
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
            <CreatePlaylist
                ref={CreatePlaylistRef}
                dismiss={dismissCreatePlaylist}
            />
        </View>
    );
}
