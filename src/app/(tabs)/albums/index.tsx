import { router, useNavigation } from "expo-router";
import { View } from "react-native";

import { FlashList } from "@shopify/flash-list";
import { useCallback, useEffect, useRef } from "react";
import { useSongsStore } from "../../../store/songs";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackgroundImageAbsolute from "../../../Components/BackgroundImageAbsolute";
import ContainerSheet from "../../../Components/BottomSheets/ContainerSheet";
import CreateAlbum from "../../../Components/BottomSheets/CreateAlbum";
import { TopButtonControls } from "../../../Components/TopPlaybackSorting";
import ContainerItem from "../../../Components/UI/ContainerItem";
import IconButton from "../../../Components/UI/IconButton";
import ListItemsNotFound from "../../../Components/UI/ListItemsNotFound";
import { Spacing } from "../../../styles/constants";
import { mainStyles } from "../../../styles/styles";

export default function AlbumsTab() {
    const { albums, setSelectedContainer, getAllAlbumSongs } = useSongsStore();
    const insets = useSafeAreaInsets();

    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton
                    icon="plus"
                    touchableOpacityProps={{
                        onPress: openCreateAlbum,
                    }}
                />
            ),
        });
    }, [navigation]);

    const CreateAlbumRef = useRef<BottomSheetModal>(null);
    const openCreateAlbum = useCallback(
        () => CreateAlbumRef.current?.present(),
        []
    );
    const dismissCreateAlbum = useCallback(
        () => CreateAlbumRef.current?.dismiss(),
        []
    );

    const ContainerOptionsRef = useRef<BottomSheetModal>(null);
    const openContainerOptions = useCallback(() => {
        ContainerOptionsRef.current?.present();
    }, []);

    const dismissContainerOptions = useCallback(() => {
        ContainerOptionsRef.current?.dismiss();
    }, []);

    const allSongs = getAllAlbumSongs();

    return (
        <View style={[mainStyles.container]}>
            <BackgroundImageAbsolute />
            <FlashList
                numColumns={2}
                data={albums}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                    <TopButtonControls songs={allSongs ? allSongs : []} />
                }
                contentContainerStyle={{
                    paddingTop: insets.top * 2,
                    paddingBottom: insets.bottom + Spacing.miniPlayer,
                    paddingHorizontal: Spacing.appPadding - Spacing.sm,
                }}
                ListEmptyComponent={
                    <ListItemsNotFound
                        text={`You dont have any albums!`}
                        icon="album"
                    />
                }
                estimatedItemSize={100}
                renderItem={({ item }) => (
                    <ContainerItem
                        item={item}
                        touchableProps={{
                            onPress: () => {
                                router.push(`(tabs)/albums/${item.id}`);
                            },
                            onLongPress: () => {
                                setSelectedContainer(item);
                                openContainerOptions();
                            },
                        }}
                    />
                )}
            />
            <CreateAlbum ref={CreateAlbumRef} dismiss={dismissCreateAlbum} />
            <ContainerSheet
                ref={ContainerOptionsRef}
                dismiss={dismissContainerOptions}
            />
        </View>
    );
}
