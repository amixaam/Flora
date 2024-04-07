import { router } from "expo-router";
import { Image, Text, TouchableNativeFeedback, View } from "react-native";

import { FlashList } from "@shopify/flash-list";
import { useSongsStore } from "../../store/songs";
import { useEffect, useRef, useState } from "react";
import EditPlaylistOptionsBottomSheet from "../../Components/BottomSheets/EditPlaylistOptionsBottomSheet";

import PlaybackControls from "../../Components/PlaybackControls";
import AlbumArt from "../../Components/AlbumArt";
import { mainStyles } from "../../Components/styles";
import SheetLayout from "../../Components/BottomSheets/SheetLayout";

const PlaylistItem = ({ item }, handleOpenPress, setSelectedPlaylist) => {
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
                            mainStyles.text_24,
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
                            mainStyles.text_12,
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
            <Image
                style={mainStyles.backgroundBlur}
                source={require("../../assets/indexBlur.png")}
            />
            <View style={{ margin: 8, flex: 1, height: "100%" }}>
                <FlashList
                    numColumns={2}
                    data={playlists}
                    keyExtractor={(item) => item.id}
                    estimatedItemSize={100}
                    renderItem={({ item }) =>
                        PlaylistItem(
                            { item },
                            handleOpenPress,
                            setSelectedPlaylist
                        )
                    }
                />
            </View>
            <PlaybackControls isMini={true} />
            <EditPlaylistOptionsBottomSheet ref={bottomSheetRef} />
        </View>
    );
}
