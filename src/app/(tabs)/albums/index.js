import { router, useNavigation } from "expo-router";
import { Text, TouchableNativeFeedback, View } from "react-native";

import { FlashList } from "@shopify/flash-list";
import { useEffect, useRef } from "react";
import { useSongsStore, useStoredSafeAreaInsets } from "../../../store/songs";

import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AlbumArt from "../../../Components/AlbumArt";
import CreatePlaylistBottomSheet from "../../../Components/BottomSheets/CreatePlaylistBottomSheet";
import PlaylistSheet from "../../../Components/BottomSheets/PlaylistSheet";
import IconButton from "../../../Components/UI/IconButton";
import { spacing } from "../../../styles/constants";
import { mainStyles } from "../../../styles/styles";
import { textStyles } from "../../../styles/text";
import CreateAlbum from "../../../Components/BottomSheets/CreateAlbum";
import AlbumSheet from "../../../Components/BottomSheets/AlbumSheet";
export default function AlbumsTab() {
    const { albums, setSelectedAlbum } = useSongsStore();
    const insets = useSafeAreaInsets();

    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton icon="plus" onPress={handleOpenCreateAlbum} />
            ),
        });
    }, [navigation]);

    const newAlbumSheetRef = useRef(null);
    const handleOpenCreateAlbum = () => newAlbumSheetRef.current.present();

    const AlbumSheetRef = useRef(null);
    const handleOpenAlbumSheet = () => AlbumSheetRef.current.present();

    return (
        <View style={[mainStyles.container]}>
            <FlashList
                numColumns={2}
                data={albums}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{
                    paddingTop: insets.top * 2,
                    paddingBottom: insets.bottom + spacing.miniPlayer,
                    paddingHorizontal: spacing.appPadding - spacing.sm,
                }}
                estimatedItemSize={100}
                renderItem={({ item }) => (
                    <AlbumItem
                        item={item}
                        handleOpenPress={handleOpenCreateAlbum}
                        setSelectedPlaylist={setSelectedAlbum}
                        onPress={() => {
                            setSelectedAlbum(item);
                            router.push(`(tabs)/albums/${item.id}`);
                        }}
                        onLongPress={() => {
                            setSelectedAlbum(item);
                            handleOpenAlbumSheet();
                        }}
                    />
                )}
            />
            <CreateAlbum ref={newAlbumSheetRef} />
            <AlbumSheet ref={AlbumSheetRef} />
        </View>
    );
}

const AlbumItem = ({ item = {}, onPress, onLongPress }) => {
    return (
        <TouchableNativeFeedback
            onPress={onPress}
            onLongPress={onLongPress}
            delayLongPress={250}
        >
            <View style={{ rowGap: spacing.xs, margin: spacing.sm }}>
                <AlbumArt
                    image={item.artwork}
                    style={{ width: "100%", aspectRatio: 1, borderRadius: 7 }}
                />
                <View>
                    <Text style={[textStyles.h5]} numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Text
                        style={[{ marginTop: -spacing.xs }, textStyles.small]}
                    >
                        {`${item.artist} • ${item.year}`}
                    </Text>
                </View>
            </View>
        </TouchableNativeFeedback>
    );
};
