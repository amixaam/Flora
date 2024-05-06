import { forwardRef } from "react";
import { FlatList } from "react-native";
import { useSongsStore } from "../../store/songs";
import { SnapPoints, Spacing } from "../../styles/constants";
import ListItemsNotFound from "../UI/ListItemsNotFound";
import SheetPlaylistOptionsButton from "../UI/SheetPlaylistOptionsButton";
import { SheetModalLayout } from "./SheetModalLayout";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomSheetProps } from "../../types/other";
import { Playlist } from "../../types/song";

const AddPlaylistToSong = forwardRef<BottomSheetModal, BottomSheetProps>(
    (props, ref) => {
        const {
            playlists,
            selectedSong,
            addSongToPlaylist,
            removeSongFromPlaylist,
        } = useSongsStore();

        if (!selectedSong) return;

        const handleAddPress = (item: Playlist) => {
            if (item.songs.includes(selectedSong.id)) {
                removeSongFromPlaylist(item.id, selectedSong.id);
            } else {
                addSongToPlaylist(item.id, selectedSong.id);
            }
        };

        return (
            <SheetModalLayout
                ref={ref}
                title={`Add ${selectedSong.title} to playlist`}
                snapPoints={[SnapPoints.full]}
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
            </SheetModalLayout>
        );
    }
);

export default AddPlaylistToSong;
