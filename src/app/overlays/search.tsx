import { useEffect, useState, useMemo, useCallback } from "react";
import { Text, View } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { Chip } from "react-native-paper";
import SheetHeader from "../../Components/UI/Headers/SheetHeader";
import ListItemsNotFound from "../../Components/UI/Text/ListItemsNotFound";
import ContainerListItem from "../../Components/UI/UI chunks/ContainerListItem";
import SwipeDownScreen from "../../Components/UI/Utils/SwipeDownScreen";
import { useSongsStore } from "../../store/songsStore";
import { Colors, Spacing } from "../../styles/constants";
import { textStyles } from "../../styles/text";
import { Album, Playlist, Song } from "../../types/song";
import Pluralize from "../../utils/Pluralize";
import { router } from "expo-router";
import SongItem from "../../Components/UI/UI chunks/SongItem";
import SongSheet from "../../Components/BottomSheets/Song/SongSheet";
import ContainerSheet from "../../Components/BottomSheets/Container/ContainerSheet";
import useBottomSheetModal from "../../hooks/useBottomSheetModal";

interface FilteredDataProps {
    songs?: Song[];
    albums?: Album[];
    playlists?: Playlist[];
}

const DEBOUNCE_DELAY = 300; // milliseconds

const SearchScreen = () => {
    const filters = ["All", "Songs", "Albums", "Playlists", "Year", "Artists"];
    const [selectedFilter, setSelectedFilter] = useState(filters[0]);
    const [inputValue, setInputValue] = useState(""); // Immediate input value
    const [debouncedFilter, setDebouncedFilter] = useState(""); // Debounced value for filtering
    const { getAllSongs, getAllAlbums, getAllPlaylists, setSelectedContainer, setSelectedSong } =
        useSongsStore();

    // Convert Maps to arrays once and memoize them
    const songs = useMemo(() => Array.from(getAllSongs()), [getAllSongs]);
    const albums = useMemo(() => Array.from(getAllAlbums()), [getAllAlbums]);
    const playlists = useMemo(
        () => Array.from(getAllPlaylists()),
        [getAllPlaylists]
    );

    const {
        close: closeSong,
        open: openSong,
        sheetRef: songRef,
    } = useBottomSheetModal();
    const {
        close: closeContainer,
        open: openContainer,
        sheetRef: containerRef,
    } = useBottomSheetModal();

    // Debounce the filter value
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedFilter(inputValue);
        }, DEBOUNCE_DELAY);

        return () => {
            clearTimeout(handler);
        };
    }, [inputValue]);

    // Memoize filtered data based on the debounced value
    const filteredData = useMemo(() => {
        if (!debouncedFilter) {
            return {
                songs: [],
                albums: [],
                playlists: [],
            };
        }

        const normalizedSearch = debouncedFilter.toLowerCase();

        const filterBySearch = (items: any[], fields: string[]) =>
            items.filter((item) =>
                fields.some((field) =>
                    String(item[field]).toLowerCase().includes(normalizedSearch)
                )
            );

        let result: FilteredDataProps = {
            songs: [],
            albums: [],
            playlists: [],
        };

        switch (selectedFilter) {
            case "All":
                result = {
                    songs: filterBySearch(songs, ["title", "artist"]),
                    albums: filterBySearch(albums, ["title", "artist"]),
                    playlists: filterBySearch(playlists, ["title"]),
                };
                break;
            case "Songs":
                result = {
                    songs: filterBySearch(songs, ["title", "artist"]),
                };
                break;
            case "Artists":
                result = {
                    songs: filterBySearch(songs, ["artist"]),
                    albums: filterBySearch(albums, ["artist"]),
                };
                break;
            case "Albums":
                result = {
                    albums: filterBySearch(albums, ["title", "artist"]),
                };
                break;
            case "Playlists":
                result = {
                    playlists: filterBySearch(playlists, ["title"]),
                };
                break;
            case "Year":
                result = {
                    songs: filterBySearch(songs, ["year"]),
                    albums: filterBySearch(albums, ["year"]),
                };
                break;
        }

        return result;
    }, [debouncedFilter, selectedFilter, songs, albums, playlists]);

    const renderItem = useCallback(
        ({ item }: { item: Song | Album | Playlist }) => {
            if ("duration" in item) {
                return (
                    <SongItem
                        key={item.id}
                        song={item}
                        controls={{
                            onPress: async()=> {
                                await setSelectedSong(item);
                                openSong();
                            },
                        }}
                    />
                );
            }
            return (
                <ContainerListItem
                    key={item.id}
                    container={item}
                    touchableNativeProps={{
                        onPress: () => router.push(`/${item.id}`),
                    }}
                    options={{
                        onPress: async () => {
                            await setSelectedContainer(item);
                            openContainer();
                        },
                    }}
                />
            );
        },
        [openSong, openContainer, setSelectedContainer]
    );

    const renderList = useCallback(
        (data: FilteredDataProps): React.ReactNode => {
            const hasNoResults =
                !data.songs?.length &&
                !data.albums?.length &&
                !data.playlists?.length;

            if (hasNoResults || !debouncedFilter) {
                return (
                    <View style={{ paddingTop: Spacing.xl }}>
                        <ListItemsNotFound
                            icon={!debouncedFilter ? "magnify" : "alert-circle"}
                            text={
                                !debouncedFilter
                                    ? `Search ${selectedFilter}`
                                    : "No results"
                            }
                        />
                    </View>
                );
            }

            return (
                <ScrollView
                    contentContainerStyle={{
                        gap: Spacing.md,
                        marginTop: Spacing.mmd,
                    }}
                >
                    {data.albums && data.albums?.length > 0 && (
                        <View>
                            <ListHeader
                                text={Pluralize(
                                    data.albums.length,
                                    "album",
                                    "albums"
                                )}
                            />
                            {data.albums.map((album) =>
                                renderItem({ item: album })
                            )}
                        </View>
                    )}
                    {data.playlists && data.playlists?.length > 0 && (
                        <View>
                            <ListHeader
                                text={Pluralize(
                                    data.playlists.length,
                                    "playlist",
                                    "playlists"
                                )}
                            />
                            {data.playlists.map((playlist) =>
                                renderItem({ item: playlist })
                            )}
                        </View>
                    )}
                    {data.songs && data.songs?.length > 0 && (
                        <View>
                            <ListHeader
                                text={Pluralize(
                                    data.songs.length,
                                    "song",
                                    "songs"
                                )}
                            />
                            {data.songs.map((song) =>
                                renderItem({ item: song })
                            )}
                        </View>
                    )}
                </ScrollView>
            );
        },
        [debouncedFilter, selectedFilter, renderItem]
    );

    const HeaderInput = useCallback(
        ({ setFilter }: { setFilter: (value: string) => void }) => (
            <View style={{ flex: 1, marginTop: 1 }}>
                <TextInput
                    placeholder="Search..."
                    onChangeText={setFilter}
                    placeholderTextColor={Colors.primary90}
                    style={[textStyles.text]}
                    autoCapitalize="sentences"
                />
            </View>
        ),
        []
    );

    return (
        <SwipeDownScreen
            header={
                <SheetHeader
                    title={<HeaderInput setFilter={setInputValue} />}
                />
            }
        >
            <View style={{ flex: 1, gap: Spacing.md }}>
                <View style={{ marginLeft: Spacing.appPadding }}>
                    <ScrollView
                        horizontal
                        contentContainerStyle={{ gap: Spacing.sm }}
                    >
                        {filters.map((filterName) => (
                            <Chip
                                key={filterName}
                                mode="outlined"
                                selected={selectedFilter === filterName}
                                onPress={() => setSelectedFilter(filterName)}
                                selectedColor={Colors.primary}
                                style={{
                                    backgroundColor:
                                        selectedFilter === filterName
                                            ? Colors.input
                                            : Colors.secondary,
                                }}
                            >
                                {filterName}
                            </Chip>
                        ))}
                    </ScrollView>
                </View>
                {renderList(filteredData)}
            </View>
            <SongSheet ref={songRef} dismiss={closeSong} />
            <ContainerSheet ref={containerRef} dismiss={closeContainer} />
        </SwipeDownScreen>
    );
};

const ListHeader = ({ text = "List header", accent = "" }) => (
    <View
        style={{
            flex: 1,
            marginHorizontal: Spacing.appPadding,
            flexDirection: "row",
            justifyContent: "space-between",
        }}
    >
        <Text style={textStyles.text}>{text}</Text>
        <Text style={textStyles.text}>{accent}</Text>
    </View>
);

export default SearchScreen;
