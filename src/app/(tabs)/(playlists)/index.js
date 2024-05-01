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
export default function PlaylistsTab() {
    const { playlists, setSelectedPlaylist, resetAll, setup } = useSongsStore();
    useEffect(() => {
        setup();
    }, []);
    const insets = useSafeAreaInsets();

    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton icon="plus" onPress={handleOpenPress} />
            ),
        });
    }, [navigation]);

    const newPlaylistRef = useRef(null);
    const handleOpenPress = () => newPlaylistRef.current.present();

    const PlaylistOptionsRef = useRef(null);
    const openPlaylistOptions = () => PlaylistOptionsRef.current.present();

    return (
        <View style={[mainStyles.container]}>
            <FlashList
                numColumns={2}
                data={playlists}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{
                    paddingTop: insets.top * 2,
                    paddingBottom: insets.bottom + spacing.miniPlayer,
                    paddingHorizontal: spacing.appPadding - spacing.sm,
                }}
                estimatedItemSize={100}
                renderItem={({ item }) => (
                    <PlaylistItem
                        item={item}
                        handleOpenPress={handleOpenPress}
                        setSelectedPlaylist={setSelectedPlaylist}
                        onPress={() => {
                            setSelectedPlaylist(item);
                            router.push(`./${item.id}`);
                        }}
                        onLongPress={() => {
                            setSelectedPlaylist(item);
                            openPlaylistOptions();
                        }}
                    />
                )}
            />
            <CreatePlaylistBottomSheet ref={newPlaylistRef} />
            <PlaylistSheet ref={PlaylistOptionsRef} />
        </View>
    );
}

const PlaylistItem = ({ item = {}, onPress, onLongPress }) => {
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
                        {item.name}
                    </Text>
                    <Text
                        style={[
                            {
                                marginTop: -spacing.xs,
                            },
                            textStyles.small,
                        ]}
                    >
                        {item.songs.length} song{item.songs.length > 1 && "s"}
                    </Text>
                </View>
            </View>
        </TouchableNativeFeedback>
    );
};
