import { router, useNavigation } from "expo-router";
import { Text, TouchableNativeFeedback, View } from "react-native";

import { FlashList } from "@shopify/flash-list";
import { useCallback, useEffect, useRef } from "react";
import { useSongsStore } from "../../../store/songs";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AlbumArt from "../../../Components/AlbumArt";
import AlbumSheet from "../../../Components/BottomSheets/AlbumSheet";
import CreateAlbum from "../../../Components/BottomSheets/CreateAlbum";
import IconButton from "../../../Components/UI/IconButton";
import { Spacing } from "../../../styles/constants";
import { mainStyles } from "../../../styles/styles";
import { textStyles } from "../../../styles/text";
import { Album } from "../../../types/song";
import ListItemsNotFound from "../../../Components/UI/ListItemsNotFound";
import BackgroundImageAbsolute from "../../../Components/BackgroundImageAbsolute";
import { TopButtonControls } from "../../../Components/TopPlaybackSorting";
export default function AlbumsTab() {
    const { albums, setSelectedAlbum, getAllAlbumSongs } = useSongsStore();
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

    const AlbumOptionsRef = useRef<BottomSheetModal>(null);
    const openAlbumOptions = useCallback(() => {
        AlbumOptionsRef.current?.present();
    }, []);

    const dismissAlbumOptions = useCallback(() => {
        AlbumOptionsRef.current?.dismiss();
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
                    <AlbumItem
                        item={item}
                        onPress={() => {
                            setSelectedAlbum(item);
                            router.push(`(tabs)/albums/${item.id}`);
                        }}
                        onLongPress={() => {
                            setSelectedAlbum(item);
                            openAlbumOptions();
                        }}
                    />
                )}
            />
            <CreateAlbum ref={CreateAlbumRef} dismiss={dismissCreateAlbum} />
            <AlbumSheet ref={AlbumOptionsRef} dismiss={dismissAlbumOptions} />
        </View>
    );
}

const AlbumItem = ({
    item,
    onPress = () => {},
    onLongPress = () => {},
}: {
    item: Album;
    onPress?: () => void;
    onLongPress?: () => void;
}) => {
    return (
        <TouchableNativeFeedback
            onPress={onPress}
            onLongPress={onLongPress}
            delayLongPress={250}
        >
            <View style={{ rowGap: Spacing.xs, margin: Spacing.sm }}>
                <AlbumArt
                    image={item.artwork}
                    style={{ width: "100%", aspectRatio: 1, borderRadius: 7 }}
                />
                <View>
                    <Text style={[textStyles.h5]} numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Text
                        style={[{ marginTop: -Spacing.xs }, textStyles.small]}
                        numberOfLines={1}
                    >
                        {`${item.artist} • ${item.year}`}
                    </Text>
                </View>
            </View>
        </TouchableNativeFeedback>
    );
};
