import { forwardRef } from "react";
import { FlatList } from "react-native";
import { useSongsStore } from "../../store/songs";
import { Spacing } from "../../styles/constants";
import ListItemsNotFound from "../UI/ListItemsNotFound";
import SheetPlaylistOptionsButton from "../UI/SheetPlaylistOptionsButton";
import SheetLayout from "./SheetLayout";

const AddSongToPlaylistBottomSheet = forwardRef(({ props }, ref) => {
    const {
        playlists,
        selectedSong,
        addSongToPlaylist,
        removeSongFromPlaylist,
    } = useSongsStore();

    const handleAddPress = (item) => {
        if (item.songs.includes(selectedSong.id)) {
            removeSongFromPlaylist(item.id, selectedSong.id);
        } else {
            addSongToPlaylist(item.id, selectedSong.id);
        }
    };

    return (
        <SheetLayout
            ref={ref}
            title={`Add ${selectedSong.title} to playlist`}
            index={2}
        >
            <FlatList
                data={playlists}
                ListEmptyComponent={
                    <ListItemsNotFound
                        icon="playlist-music"
                        text="No playlists found!"
                    />
                }
                contentContainerStyle={{
                    paddingBottom: Spacing.xl,
                }}
                renderItem={({ item }) => (
                    <SheetPlaylistOptionsButton
                        data={item}
                        onPress={handleAddPress}
                        isSelected={item.songs.includes(selectedSong.id)}
                    />
                )}
                keyExtractor={(item) => item.id}
            />
        </SheetLayout>
    );
});

export default AddSongToPlaylistBottomSheet;
