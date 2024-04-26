import { router } from "expo-router";
import { Text, TouchableNativeFeedback, View } from "react-native";

import { FlashList } from "@shopify/flash-list";
import { useEffect, useRef } from "react";
import EditPlaylistOptionsBottomSheet from "../../Components/BottomSheets/EditPlaylistOptionsBottomSheet";
import { useSongsStore } from "../../store/songs";

import AlbumArt from "../../Components/AlbumArt";
import PlaybackControls from "../../Components/PlaybackControls";
import { mainStyles, textStyles } from "../../Components/styles";
import DeletePlaylistConfirm from "../../Components/Modals/DeletePlaylistConfirm";

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
                    width={"100%"}
                    aspectRatio={1}
                    borderRadius={7}
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
                                marginTop: -4,
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

export default function PlaylistsTab() {
    const { playlists, setSelectedPlaylist, resetAll } = useSongsStore();
    useEffect(() => {
        console.log("playlists renew");
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
            <EditPlaylistOptionsBottomSheet ref={bottomSheetRef} />
        </View>
    );
}
