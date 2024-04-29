import { router } from "expo-router";
import { Text, TouchableNativeFeedback, View } from "react-native";

import { FlashList } from "@shopify/flash-list";
import { useEffect, useRef } from "react";
import PlaylistSheet from "../../Components/BottomSheets/PlaylistSheet";
import { useSongsStore } from "../../store/songs";

import AlbumArt from "../../Components/AlbumArt";
import DeletePlaylistConfirm from "../../Components/Modals/DeletePlaylistConfirm";
import PlaybackControls from "../../Components/PlaybackControls";
import { mainStyles, textStyles } from "../../Components/styles";

export default function PlaylistsTab() {
    const { playlists, setSelectedPlaylist, resetAll, setup } = useSongsStore();

    useEffect(() => {
        console.log("playlists renew");
        setup();
        // resetAll();
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
                        />
                    )}
                />
            </View>
            <DeletePlaylistConfirm />
            <PlaybackControls isMini={true} />
            <PlaylistSheet ref={bottomSheetRef} />
        </View>
    );
}

const PlaylistItem = ({ item, handleOpenPress, setSelectedPlaylist }) => {
    const handleLongPress = () => {
        setSelectedPlaylist(item);
        handleOpenPress();
    };

    const handlePress = () => {
        setSelectedPlaylist(item);
        router.push("/(playlist)/" + item.id);
    };

    return (
        <TouchableNativeFeedback
            onPress={handlePress}
            onLongPress={handleLongPress}
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
