import React, { forwardRef, useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { useSongsStore } from "../../../store/songs";
import { Colors, SnapPoints, Spacing } from "../../../styles/constants";
import SongListItem from "../../UI/UI chunks/SongListItem";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { SheetModalLayout } from "../SheetModalLayout";
import { BottomSheetProps } from "../../../types/other";
import { Song } from "../../../types/song";
import ListItemsNotFound from "../../UI/Text/ListItemsNotFound";
import TextInput from "../../UI/Inputs/TextInput";

const AddSongsToContainer = forwardRef<BottomSheetModal, BottomSheetProps>(
    (props, ref) => {
        const {
            songs,
            selectedContainer,

            addSongToPlaylist,
            addSongToAlbum,

            removeSongFromPlaylist,
            removeSongFromAlbum,
        } = useSongsStore();
        const [selectedSongs, setselectedSongs] = useState<string[]>([]);

        const [searchQuery, setSearchQuery] = useState("");
        const [searchResults, setSearchResults] = useState<Song[]>([]);

        // Shows newest songs first if no search query
        // Otherwise, shows search results sorted by title and or artist
        useEffect(() => {
            if (searchQuery === "") {
                setSearchResults(songs.slice().reverse());
                return;
            }

            const results = songs.filter(
                (song) =>
                    song.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    song.artist
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
            );

            setSearchResults(results);
        }, [searchQuery, songs]);

        const handleSearch = (query: string) => {
            setSearchQuery(query);
        };

        useEffect(() => {
            if (!selectedContainer) return;
            setselectedSongs(selectedContainer.songs);
        }, [selectedContainer]);

        if (selectedContainer === undefined) return;

        const containerType =
            selectedContainer?.id[0] === "P" ||
            parseInt(selectedContainer?.id[0]) == 1
                ? "playlist"
                : "album";

        const changeList = (songId: string) => {
            if (selectedSongs.includes(songId)) {
                setselectedSongs(selectedSongs.filter((id) => id !== songId));
                containerType === "album"
                    ? removeSongFromAlbum(selectedContainer.id, songId)
                    : removeSongFromPlaylist(selectedContainer.id, songId);
                return;
            }

            setselectedSongs([...selectedSongs, songId]);
            containerType === "album"
                ? addSongToAlbum(selectedContainer.id, songId)
                : addSongToPlaylist(selectedContainer.id, songId);
        };

        return (
            <SheetModalLayout
                ref={ref}
                title={`Add songs to ${containerType}`}
                snapPoints={[SnapPoints.lg]}
            >
                <FlatList
                    data={searchResults.filter((song) => !song.isHidden)}
                    ListEmptyComponent={
                        <ListItemsNotFound
                            text="No songs found!"
                            icon="music-note"
                        />
                    }
                    ListHeaderComponent={
                        <BottomSheetView
                            style={{
                                backgroundColor: Colors.secondary,
                                paddingBottom: Spacing.md,
                                paddingHorizontal: Spacing.appPadding,
                            }}
                        >
                            <TextInput
                                // bottomSheet
                                placeholder="Song name or artist..."
                                setValue={(query) => handleSearch(query)}
                            />
                        </BottomSheetView>
                    }
                    stickyHeaderIndices={[0]}
                    stickyHeaderHiddenOnScroll={true}
                    renderItem={({ item }) => (
                        <SongListItem
                            item={item}
                            isSelected={selectedSongs.includes(item.id)}
                            onPress={() => {
                                changeList(item.id);
                            }}
                            isSelectMode={true}
                            showImage={true}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                />
            </SheetModalLayout>
        );
    }
);

export default AddSongsToContainer;
