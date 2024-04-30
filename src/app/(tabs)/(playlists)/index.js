import { router } from "expo-router";
import { Text, TouchableNativeFeedback, View } from "react-native";

import { FlashList } from "@shopify/flash-list";
import { useEffect, useRef } from "react";
import PlaylistSheet from "../../../Components/BottomSheets/PlaylistSheet";
import { useSongsStore } from "../../../store/songs";

import AlbumArt from "../../../Components/AlbumArt";
import MiniPlayer from "../../../Components/MiniPlayer";
import DeletePlaylistConfirm from "../../../Components/Modals/DeletePlaylistConfirm";
import { mainStyles } from "../../../styles/styles";
import { textStyles } from "../../../styles/text";
export default function PlaylistsTab() {
    const { playlists, setSelectedPlaylist, resetAll, setup } = useSongsStore();
    useEffect(() => {
        setup();
    }, []);

    const bottomSheetRef = useRef(null);
    const handleOpenPress = () => bottomSheetRef.current.present();

    return (
        <View style={mainStyles.container}>
            <View style={{ margin: 8, flex: 1, height: "100%" }}>
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
                                handleOpenPress();
                            }}
                        />
                    )}
                />
            </View>
            <DeletePlaylistConfirm />
            <PlaylistSheet ref={bottomSheetRef} />
            <MiniPlayer />
        </View>
    );
}

const PlaylistItem = ({ item, onPress, onLongPress }) => {
    return (
        <TouchableNativeFeedback
            onPress={onPress}
            onLongPress={onLongPress}
            delayLongPress={250}
        >
            <View
                style={{
                    margin: 8,
                    rowGap: 4,
                }}
            >
                <AlbumArt
                    image={item.image}
                    style={{ width: "100%", aspectRatio: 1, borderRadius: 7 }}
                />
                <View>
                    <Text
                        style={[
                            {
                                lineHeight: 28,
                            },
                            textStyles.h5,
                        ]}
                        numberOfLines={1}
                    >
                        {item.name}
                    </Text>
                    <Text
                        style={[
                            {
                                marginTop: -6,
                            },
                            textStyles.small,
                        ]}
                    >
                        {item.songs.length} songs
                    </Text>
                </View>
            </View>
        </TouchableNativeFeedback>
    );
};
