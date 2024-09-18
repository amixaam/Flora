import { forwardRef, useCallback, useRef } from "react";
import { FlatList } from "react-native";
import { useSongsStore } from "../../../store/songs";
import { SnapPoints, Spacing } from "../../../styles/constants";
import ListItemsNotFound from "../../UI/ListItemsNotFound";
import SheetPlaylistOptionsButton from "../../UI/SheetPlaylistOptionsButton";
import { SheetModalLayout } from "../SheetModalLayout";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomSheetProps } from "../../../types/other";
import { Playlist } from "../../../types/song";
import SheetOptionsButton from "../../UI/SheetOptionsButton";
import CreatePlaylist from "../Playlist/CreatePlaylist";

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

        const CreatePlaylistRef = useRef<BottomSheetModal>(null);
        const openCreatePlaylist = useCallback(() => {
            CreatePlaylistRef.current?.present();
        }, []);
        const dismissCreatePlaylist = useCallback(() => {
            CreatePlaylistRef.current?.dismiss();
        }, []);

        return (
            <>
                <SheetModalLayout
                    ref={ref}
                    title={`Add to playlist`}
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
                        ListFooterComponent={
                            <SheetOptionsButton
                                icon="plus"
                                onPress={openCreatePlaylist}
                                buttonContent="Make a new playlist"
                            />
                        }
                        contentContainerStyle={{
                            paddingBottom: Spacing.xl,
                            marginHorizontal: Spacing.appPadding,
                        }}
                        renderItem={({ item }) => (
                            <SheetPlaylistOptionsButton
                                playlist={item}
                                onPress={() => {
                                    handleAddPress(item);
                                }}
                                isSelected={item.songs.includes(
                                    selectedSong.id
                                )}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                    />
                </SheetModalLayout>
                <CreatePlaylist
                    ref={CreatePlaylistRef}
                    dismiss={dismissCreatePlaylist}
                />
            </>
        );
    }
);

export default AddPlaylistToSong;
