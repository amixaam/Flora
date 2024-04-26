import { BottomSheetView } from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { forwardRef, useMemo } from "react";
import { Text } from "react-native";
import { useSongsStore } from "../../store/songs";
import SheetPlaylistOptionsButton from "../UI/SheetPlaylistOptionsButton";
import { textStyles } from "../styles";
import SheetLayout from "./SheetLayout";

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
                        renderItem={({ item }) => (
                            <SheetPlaylistOptionsButton
                                data={item}
                                onPress={handlePress}
                            />
                        )}
                        estimatedItemSize={50}
                        keyExtractor={(item) => item.id}
                    />
                </BottomSheetView>
            </BottomSheetView>
        </SheetLayout>
    );
});

export default RemoveSongFromPlaylistBottomSheet;
