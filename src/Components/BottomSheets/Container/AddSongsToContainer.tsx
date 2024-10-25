import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { forwardRef, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { useSongsStore } from "../../../store/songsStore";
import { SnapPoints } from "../../../styles/constants";
import { BottomSheetProps } from "../../../types/other";
import ListItemsNotFound from "../../UI/Text/ListItemsNotFound";
import SongItem from "../../UI/UI chunks/SongItem";
import { SheetModalLayout } from "../SheetModalLayout";

const AddSongsToContainer = forwardRef<BottomSheetModal, BottomSheetProps>(
    (props, ref) => {
        const {
            getAllSongs,
            selectedContainer,

            addSongToPlaylist,
            addSongToAlbum,

            removeSongFromPlaylist,
            removeSongFromAlbum,
        } = useSongsStore();

        const songs = getAllSongs();
        const [selectedSongs, setselectedSongs] = useState<string[]>(
            selectedContainer?.songs || []
        );

        if (selectedContainer === undefined) return;

        const isAlbum = selectedContainer.type === "album";

        const changeList = (songId: string) => {
            if (selectedSongs.includes(songId)) {
                setselectedSongs(selectedSongs.filter((id) => id !== songId));
                isAlbum
                    ? removeSongFromAlbum(selectedContainer.id, songId)
                    : removeSongFromPlaylist(selectedContainer.id, [songId]);
                return;
            }

            setselectedSongs([...selectedSongs, songId]);
            isAlbum
                ? addSongToAlbum(selectedContainer.id, songId)
                : addSongToPlaylist(selectedContainer.id, [songId]);
        };

        return (
            <SheetModalLayout
                ref={ref}
                title={`Add songs to ${selectedContainer.type}`}
                snapPoints={[SnapPoints.lg]}
            >
                <FlatList
                    data={songs}
                    ListEmptyComponent={
                        <ListItemsNotFound
                            text="No songs found!"
                            icon="music-note"
                        />
                    }
                    // ListHeaderComponent={
                    //     <BottomSheetView
                    //         style={{
                    //             backgroundColor: Colors.secondary,
                    //             paddingBottom: Spacing.md,
                    //             paddingHorizontal: Spacing.appPadding,
                    //         }}
                    //     >
                    //         <TextInput
                    //             // bottomSheet
                    //             placeholder="Song name or artist..."
                    //             onChangeText={handleSearch}
                    //             defaultValue=""
                    //         />
                    //     </BottomSheetView>
                    // }
                    // stickyHeaderIndices={[0]}
                    // stickyHeaderHiddenOnScroll={true}
                    renderItem={({ item }) => (
                        <SongItem
                            song={item}
                            onPress={() => {
                                changeList(item.id);
                            }}
                            controls={{
                                icon: selectedSongs.includes(item.id)
                                    ? "checkbox-marked-outline"
                                    : "checkbox-blank-outline",
                                onPress: () => changeList(item.id),
                            }}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                />
            </SheetModalLayout>
        );
    }
);

export default AddSongsToContainer;
