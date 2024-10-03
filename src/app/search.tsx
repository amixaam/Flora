import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { Chip } from "react-native-paper";
import SheetHeader from "../Components/UI/Headers/SheetHeader";
import ListItemsNotFound from "../Components/UI/Text/ListItemsNotFound";
import SwipeDownScreen from "../Components/UI/Utils/SwipeDownScreen";
import { useSongsStore } from "../store/songs";
import { Colors, Spacing } from "../styles/constants";
import { textStyles } from "../styles/text";
import { Album, Playlist, Song } from "../types/song";
import { FlashList } from "@shopify/flash-list";
import SongListItem from "../Components/UI/UI chunks/SongListItem";
import Pluralize from "../utils/Pluralize";
import ContainerListItem from "../Components/UI/UI chunks/ContainerListItem";

interface filteredDataProps {
    songs?: Song[];
    albums?: Album[];
    playlists?: Playlist[];
}

const SearchScreen = () => {
    const filters = ["All", "Songs", "Albums", "Playlists", "Year", "Artists"];
    const [selectedFilter, setSelectedFilter] = useState(filters[0]);
    const [filter, setFilter] = useState("");
    const [filteredData, setFilteredData] = useState<filteredDataProps>({
        songs: [],
        albums: [],
        playlists: [],
    });
    const { songs, albums, playlists } = useSongsStore();

    useEffect(() => {
        filterData();
    }, [filter, selectedFilter, songs, albums, playlists]);

    const filterData = () => {
        let filteredData: filteredDataProps = {
            songs: [],
            albums: [],
            playlists: [],
        };
        if (filter == "")
            return setFilteredData({
                songs: [],
                albums: [],
                playlists: [],
            });

        function filterSongs(): Song[] {
            return songs.filter(
                (song) =>
                    song.title.toLowerCase().includes(filter.toLowerCase()) ||
                    song.artist.toLowerCase().includes(filter.toLowerCase())
            );
        }

        function filterAlbums(): Album[] {
            return albums.filter(
                (album) =>
                    album.title.toLowerCase().includes(filter.toLowerCase()) ||
                    album.artist.toLowerCase().includes(filter.toLowerCase())
            );
        }

        function filterPlaylists(): Playlist[] {
            return playlists.filter((playlist) =>
                playlist.title.toLowerCase().includes(filter.toLowerCase())
            );
        }

        switch (selectedFilter) {
            case "All":
                filteredData = {
                    songs: filterSongs(),
                    albums: filterAlbums(),
                    playlists: filterPlaylists(),
                };
                break;
            case "Songs":
                filteredData = {
                    songs: filterSongs(),
                    albums: [],
                    playlists: [],
                };
                break;
            case "Artists":
                filteredData = {
                    songs: songs.filter((song) =>
                        song.artist.toString().includes(filter)
                    ),
                    albums: albums.filter((album) =>
                        album.artist.toString().includes(filter)
                    ),
                };
                break;
            case "Albums":
                filteredData = {
                    songs: [],
                    albums: filterAlbums(),
                    playlists: [],
                };
                break;
            case "Playlists":
                filteredData = {
                    songs: [],
                    albums: [],
                    playlists: filterPlaylists(),
                };
                break;
            case "Year":
                filteredData = {
                    songs: songs.filter((song) =>
                        song.year.toString().includes(filter)
                    ),
                    albums: albums.filter((album) =>
                        album.year.toString().includes(filter)
                    ),
                };
                break;
            default:
                break;
        }

        setFilteredData(filteredData);
    };

    const renderItem = ({ item }: { item: Song | Album | Playlist }) => {
        if ("duration" in item) {
            return (
                <SongListItem
                    key={item.id}
                    item={item}
                    showImage
                    secondaryButtonIcon="dots-vertical"
                />
            );
        } else if ("artist" in item) {
            return <ContainerListItem key={item.id} container={item} />;
        } else {
            return <ContainerListItem key={item.id} container={item} />;
        }
    };

    const renderList = (array: filteredDataProps): React.ReactNode => {
        let songList: React.ReactNode;
        let albumList: React.ReactNode;
        let playlistList: React.ReactNode;

        if (array.songs && array.songs.length > 0) {
            songList = (
                <View>
                    <ListHeader
                        text={Pluralize(
                            filteredData.songs?.length,
                            "song",
                            "songs"
                        )}
                    />
                    {array.songs.map((song) => renderItem({ item: song }))}
                </View>
            );
        }

        if (array.albums && array.albums.length > 0) {
            albumList = (
                <View>
                    <ListHeader
                        text={Pluralize(
                            filteredData.albums?.length,
                            "album",
                            "albums"
                        )}
                    />
                    {array.albums.map((album) => renderItem({ item: album }))}
                </View>
            );
        }

        if (array.playlists && array.playlists.length > 0) {
            playlistList = (
                <View>
                    <ListHeader
                        text={Pluralize(
                            filteredData.playlists?.length,
                            "playlist",
                            "playlists"
                        )}
                    />
                    {array.playlists.map((playlist) =>
                        renderItem({ item: playlist })
                    )}
                </View>
            );
        }

        if (!songList && !albumList && !playlistList) {
            return (
                <View style={{ paddingTop: Spacing.xl }}>
                    <ListItemsNotFound
                        icon="magnify"
                        text={`Search ${selectedFilter}`}
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
                {songList}
                {albumList}
                {playlistList}
            </ScrollView>
        );
    };

    return (
        <SwipeDownScreen>
            <SheetHeader
                title={<HeaderInput filter={filter} setFilter={setFilter} />}
            />
            <View style={{ flex: 1, gap: Spacing.md }}>
                <View
                    style={{
                        marginLeft: Spacing.appPadding,
                    }}
                >
                    <ScrollView
                        horizontal
                        contentContainerStyle={{ gap: Spacing.sm }}
                    >
                        {filters.map((filter) => (
                            <Chip
                                key={filter}
                                mode="outlined"
                                selected={selectedFilter === filter}
                                onPress={() => {
                                    setSelectedFilter(filter);
                                }}
                                selectedColor={Colors.primary}
                                style={
                                    selectedFilter === filter && {
                                        backgroundColor: Colors.input,
                                    }
                                }
                            >
                                {filter}
                            </Chip>
                        ))}
                    </ScrollView>
                </View>

                {renderList(filteredData)}
            </View>
        </SwipeDownScreen>
    );
};

const ListHeader = ({ text = "List header", accent = "" }) => {
    return (
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
};

const HeaderInput = ({
    filter,
    setFilter,
}: {
    filter: string;
    setFilter: any;
}) => {
    // TextInput from react native gesture handler
    return (
        <View style={{ flex: 1, marginTop: 1 }}>
            <TextInput
                placeholder="Search..."
                value={filter}
                onChangeText={setFilter}
                placeholderTextColor={Colors.primary90}
                style={[textStyles.text]}
                autoCapitalize="sentences"
            />
        </View>
    );
};

export default SearchScreen;
