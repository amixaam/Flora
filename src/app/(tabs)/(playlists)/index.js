import { router, useNavigation } from "expo-router";
import { Text, TouchableNativeFeedback, View } from "react-native";

import { FlashList } from "@shopify/flash-list";
import { useEffect, useRef } from "react";
import { useSongsStore } from "../../../store/songs";

import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import AlbumArt from "../../../Components/AlbumArt";
import MiniPlayer from "../../../Components/MiniPlayer";
import { mainStyles } from "../../../styles/styles";
import { textStyles } from "../../../styles/text";
import IconButton from "../../../Components/UI/IconButton";
import CreatePlaylistBottomSheet from "../../../Components/BottomSheets/CreatePlaylistBottomSheet";
import PlaylistSheet from "../../../Components/BottomSheets/PlaylistSheet";
import { ScrollView } from "react-native-gesture-handler";
import { spacing } from "../../../styles/constants";
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
        <ScrollView
            style={[mainStyles.container, { paddingTop: insets.top * 2 }]}
            contentInsetAdjustmentBehavior="automatic"
        >
            <FlashList
                numColumns={2}
                data={playlists}
                keyExtractor={(item) => item.id}
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
        </ScrollView>
    );
}

const PlaylistItem = ({ item = {}, onPress, onLongPress }) => {
    return (
        <TouchableNativeFeedback
            onPress={onPress}
            onLongPress={onLongPress}
            delayLongPress={250}
        >
            <View
                style={{
                    margin: spacing.sm,
                    rowGap: spacing.xs,
                }}
            >
                <AlbumArt
                    image={item.image}
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
