import { Text, TouchableNativeFeedback, View } from "react-native";
import { forwardRef, useMemo } from "react";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useSongsStore } from "../../store/songs";
import { FlashList } from "@shopify/flash-list";
import AlbumArt from "../AlbumArt";
import SheetLayout from "./SheetLayout";
import { mainStyles, textStyles } from "../styles";

const RemoveSongFromPlaylistBottomSheet = forwardRef(({ props }, ref) => {
    const { selectedSong, getPlaylistsFromSongID, removeSongFromPlaylist } =
        useSongsStore();

    const playlists = useMemo(
        () => getPlaylistsFromSongID(selectedSong.id, true),
        [selectedSong]
    );

    const handlePress = (playlistId) => {
        ref.current.dismiss();
        removeSongFromPlaylist(playlistId, selectedSong.id);
    };

    return (
        <SheetLayout
            ref={ref}
            title={`Remove ${selectedSong.name} from playlist`}
        >
            <BottomSheetView style={{ marginHorizontal: -18 }}>
                <BottomSheetView style={{ height: "100%" }}>
                    {playlists.length === 0 && (
                        <Text
                            style={[
                                textStyles.text,
                                {
                                    textAlign: "center",
                                    marginVertical: 32,
                                },
                            ]}
                        >
                            This song isn't in any playlist.
                        </Text>
                    )}
                    <FlashList
                        data={playlists}
                        renderItem={({ item }) =>
                            PlaylistListItem({ item, handlePress })
                        }
                        estimatedItemSize={50}
                        keyExtractor={(item) => item.id}
                    />
                </BottomSheetView>
            </BottomSheetView>
        </SheetLayout>
    );
});

const PlaylistListItem = ({ item, handlePress }) => {
    return (
        <TouchableNativeFeedback onPress={() => handlePress(item.id)}>
            <View style={mainStyles.textListItem}>
                <AlbumArt
                    image={item.image}
                    width={36}
                    aspectRatio={1}
                    borderRadius={5}
                />
                <Text style={textStyles.text}>{item.name}</Text>
            </View>
        </TouchableNativeFeedback>
    );
};

export default RemoveSongFromPlaylistBottomSheet;
