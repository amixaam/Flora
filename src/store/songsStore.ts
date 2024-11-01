import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import moment from "moment";
import { Album, ContainerType, History, Playlist, Song } from "../types/song";
import { useRecapStore } from "./recapStore";

const MARKED_SONGS_KEY = "MarkedSongs";

const getCurrentTimestamp = () => moment().toString();

const defaultLikedPlaylist: Playlist = {
    id: "1",
    type: ContainerType.PLAYLIST,
    title: "Liked songs",
    description: "Your songs that you liked.",
    artwork: "Liked songs",
    songs: [],
    lastModified: getCurrentTimestamp(),
    createdAt: getCurrentTimestamp(),
};

const createPlaylistId = () =>
    `P${Date.now().toString(36)}${Math.random()
        .toString(36)
        .substr(2, 5)}`.toUpperCase();

export function createAlbumId(title: string, artist: string): string {
    // Convert title and artist to uppercase and remove special characters
    const normalizedTitle = (title || "Unknown Album")
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "");
    const normalizedArtist = (artist || "Unknown Artist")
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "");

    // Create a simple hash function
    function simpleHash(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }

    // Generate hash from combined string
    const combinedString = `${normalizedTitle}-${normalizedArtist}`;
    const hash = simpleHash(combinedString);

    // Convert to base36 and take first 8 characters
    const base36Hash = hash.toString(36).toUpperCase();
    return `A${base36Hash.slice(0, 7)}`;
}

const mapToArray = <T extends { id: string }>(map: Map<string, T>): T[] =>
    Array.from(map.values());

const arrayToMap = <T extends { id: string }>(array: T[]): Map<string, T> =>
    new Map(array.map((item) => [item.id, item]));

interface PersistedState {
    songs: Song[];
    albums: Album[];
    playlists: Playlist[];
    history: History;
}

interface SongsState {
    songMap: Map<string, Song>;
    albumMap: Map<string, Album>;
    playlistMap: Map<string, Playlist>;
    history: History;
    isReadingSongs: boolean;
    selectedSong: Song | undefined;
    selectedContainer: Playlist | Album | undefined;
}

interface SongsActions {
    resetAll: () => void;

    setIsReadingSongs: (value: boolean) => void;
    setSelectedSong: (song: Song) => Promise<void>;
    setSelectedContainer: (container: Playlist | Album) => Promise<void>;
    updateSelectedStates: () => void;

    // SONG
    setSongs: (songs: Song[]) => void;
    addSongs: (songs: Song[]) => void;
    getSong: (id: string) => Song | undefined;
    getSongs: (ids: string[]) => Song[];
    getAllSongs: () => Song[];
    getSongIds: () => string[];
    removeSongs: (ids: string[]) => void;

    doesSongExist: (id: string) => boolean;
    likeSong: (id: string) => void;
    unlikeSong: (id: string) => void;
    toggleSongVisibility: (id: string) => void;

    getRecentlyAddedSongs: () => Song[];

    // STATISTICS
    updateSongSkip: (id: string) => void;
    batchUpdateTrack: (trackId: string) => void;

    // HISTORY
    addSongToConsciousHistory: (id: string) => void;

    getHistory: () => History;
    clearHistory: () => void;

    getAlbumRanking: (albumId: string) => Song[] | undefined;
    getSongRanking: (songId: string) => number;

    // CONTAINER
    getSongsFromContainer: (id: string) => Song[];
    getContainer: (id: string) => Playlist | Album | undefined;

    deleteContainer: (id: string) => void;
    checkForDeletedSongs: () => void;

    // PLAYLIST SPECIFIC
    createPlaylist: (inputFields: Partial<Playlist>) => void;
    editPlaylist: (id: string, inputFields: Partial<Playlist>) => void;

    getPlaylist: (id: string) => Playlist | undefined;
    getAllPlaylists: () => Playlist[];
    getAllPlaylistSongs: () => Song[];

    addSongToPlaylist: (playlistId: string, songIds: string[]) => void;
    removeSongFromPlaylist: (playlistId: string, songIds: string[]) => void;

    // ALBUM SPECIFIC
    createAlbum: (inputFields: Partial<Album>) => string;
    addAlbums: (
        albumFields: { [key: Album["title"]]: Partial<Album> },
        songIds: { [key: Album["title"]]: Song["id"][] }
    ) => void;
    editAlbum: (id: string, inputFields: Partial<Album>) => void;

    removeEmptyAutoAlbums: () => void;

    getAllAlbums: () => Album[];
    getAlbum: (id: string) => Album | undefined;
    getAllAlbumSongs: () => Song[];
    getAlbumBySong: (songId: string) => Album | undefined;

    addSongToAlbum: (albumId: string, songId: string) => void;
    removeSongFromAlbum: (albumId: string, songId: string) => void;

    // ALGORITHMS
    getRecentlyPlayed: () => (Album | Playlist)[];
}

const initialState: SongsState = {
    songMap: new Map(),
    albumMap: new Map(),
    playlistMap: new Map([[defaultLikedPlaylist.id, defaultLikedPlaylist]]),

    history: {
        history: [],
        consciousHistory: [],
    },

    isReadingSongs: false,
    selectedSong: undefined,
    selectedContainer: undefined,
};

export const useSongsStore = create<SongsState & SongsActions>()(
    persist(
        (set, get) => ({
            ...initialState,

            resetAll: () => set(initialState),

            // map get
            getSong: (id) => get().songMap.get(id),
            getAlbum: (id) => get().albumMap.get(id),
            getPlaylist: (id) => get().playlistMap.get(id),

            getSongs: (ids) => {
                return ids
                    .map((id) => get().songMap.get(id))
                    .filter((song): song is Song => song !== undefined);
            },
            getSongIds: () => Array.from(get().songMap.keys()),

            getAllSongs: () => Array.from(get().songMap.values()),
            getAllAlbums: () => Array.from(get().albumMap.values()),
            getAllPlaylists: () => Array.from(get().playlistMap.values()),

            // sets
            setSongs: (songs) => {
                set({ songMap: arrayToMap(songs) });
            },
            setIsReadingSongs: (value) => {
                set({ isReadingSongs: value });
            },

            setSelectedSong: async (song) => {
                set({ selectedSong: song });
            },
            setSelectedContainer: async (container) => {
                set({ selectedContainer: container });
            },

            // songs ----------------------------------------------------------
            addSongs: (newSongs) => {
                set((state) => {
                    const updatedMap = new Map(state.songMap);
                    newSongs.forEach((song) => updatedMap.set(song.id, song));
                    return { songMap: updatedMap };
                });
            },

            removeSongs: (ids: string[]) => {
                set((state) => {
                    const updatedMap = new Map(state.songMap);
                    ids.forEach((id) => updatedMap.delete(id));
                    return { songMap: updatedMap };
                });
                get().checkForDeletedSongs();
            },

            updateSelectedStates: () => {
                set((state) => ({
                    selectedSong: state.selectedSong
                        ? state.getSong(state.selectedSong.id)
                        : undefined,
                    selectedContainer: state.selectedContainer
                        ? state.getContainer(state.selectedContainer.id)
                        : undefined,
                }));
            },

            doesSongExist: (id) => {
                return get().songMap.has(id);
            },

            likeSong: (id) => {
                const song = get().getSong(id);
                if (!song || song.rating) return;

                get().addSongToPlaylist("1", [id]);
            },

            unlikeSong: (id) => {
                const song = get().getSong(id);
                if (!song || !song.rating) return;

                get().removeSongFromPlaylist("1", [id]);
            },

            toggleSongVisibility: (id) => {
                set((state) => {
                    const song = state.songMap.get(id);
                    if (!song) return state;

                    const updatedSongMap = new Map(state.songMap);
                    updatedSongMap.set(id, {
                        ...song,
                        isHidden: !song.isHidden,
                    });

                    return {
                        songMap: updatedSongMap,
                    };
                });

                get().updateSelectedStates();
            },

            // statistics ---------------------------------------------------------
            batchUpdateTrack: (trackId) => {
                set((state) => {
                    const song = state.songMap.get(trackId);
                    if (!song) return state;

                    const updatedSong = {
                        ...song,
                        statistics: {
                            ...song.statistics,
                            lastPlayed: getCurrentTimestamp(),
                            playCount: song.statistics.playCount + 1,
                        },
                    };

                    const updatedSongMap = new Map(state.songMap);
                    updatedSongMap.set(trackId, updatedSong);

                    return {
                        songMap: updatedSongMap,
                        history: {
                            ...state.history,
                            history: [
                                {
                                    song: trackId,
                                    date: getCurrentTimestamp(),
                                    containerId: song.albumIds[0],
                                },
                                ...state.history.history,
                            ],
                        },
                    };
                });

                useRecapStore
                    .getState()
                    .recordPlay(get().getSong(trackId) as Song);
            },

            updateSongSkip: (id) => {
                set((state) => {
                    const song = state.songMap.get(id);
                    if (!song) return state;

                    const updatedSong = {
                        ...song,
                        statistics: {
                            ...song.statistics,
                            skipCount: song.statistics.playCount + 1,
                        },
                    };

                    const updatedSongMap = new Map(state.songMap);
                    updatedSongMap.set(id, updatedSong);

                    return {
                        songMap: updatedSongMap,
                    };
                });

                useRecapStore.getState().recordSkip(get().getSong(id) as Song);
            },

            addSongToConsciousHistory: (id) => {
                const song = get().getSong(id);
                if (song === undefined) return;

                const history = get().history;
                const newConsciousHistory = [
                    ...history.consciousHistory.slice(-5),
                    {
                        song: id,
                        date: moment().toString(),
                        containerId: song.albumIds[0],
                    },
                ];

                set((state) => ({
                    history: {
                        ...state.history,
                        consciousHistory: newConsciousHistory,
                    },
                }));

                console.log("added song to conscious history: ", song.title);
            },

            getHistory: () => {
                return get().history;
            },

            clearHistory: () => {
                set({ history: { history: [], consciousHistory: [] } });
            },

            getAlbumRanking: (albumId: string) => {
                const album = get().getAlbum(albumId);
                if (!album) return;

                // Sorts the songs in an album by play count
                return album.songs
                    .map((id) => get().getSong(id))
                    .filter((song): song is Song => song !== undefined)
                    .sort(
                        (a, b) =>
                            (b?.statistics.playCount ?? 0) -
                            (a?.statistics.playCount ?? 0)
                    );
            },

            getSongRanking: (songId: string) => {
                // Gets the ranking for a song in its album
                const song = get().getSong(songId);
                if (!song) return 0;

                const ranking = get().getAlbumRanking(song.albumIds[0]);
                if (!ranking) return 0;

                // return the rank of the song in number form
                return ranking.indexOf(song) + 1;
            },

            // containers ---------------------------------------------------------

            getSongsFromContainer: (id) => {
                const container = get().getContainer(id);
                if (!container) return [];
                return get().getSongs(container.songs);
            },

            getContainer: (id) => {
                // A - album, P - playlist
                if (id[0] === "A") {
                    return get().getAlbum(id);
                } else {
                    return get().getPlaylist(id);
                }
            },

            deleteContainer: (id) => {
                if (id[0] === "A") {
                    const updatedAlbumMap = new Map(get().albumMap);
                    const updatedSongMap = new Map(get().songMap);
                    const album = updatedAlbumMap.get(id);
                    if (!album) return;

                    const songIds = album.songs;
                    songIds?.forEach((songId) => {
                        const song = updatedSongMap.get(songId);
                        if (!song) return;
                        updatedSongMap.set(songId, {
                            ...song,
                            albumIds: song.albumIds.filter(
                                (albumId) => albumId !== id
                            ),
                        });
                    });

                    updatedAlbumMap.delete(id);
                    set({
                        albumMap: updatedAlbumMap,
                        songMap: updatedSongMap,
                        selectedContainer: undefined,
                    });
                } else {
                    const updatedPlaylistMap = new Map(get().playlistMap);
                    updatedPlaylistMap.delete(id);
                    set({
                        playlistMap: updatedPlaylistMap,
                        selectedContainer: undefined,
                    });
                }

                get().updateSelectedStates();
            },

            checkForDeletedSongs: () => {
                set((state) => {
                    const songIds = Array.from(state.songMap.keys());
                    const editedAlbumMap = new Map(state.albumMap);
                    const editedPlaylistMap = new Map(state.playlistMap);

                    editedAlbumMap.forEach((album, id) => {
                        editedAlbumMap.set(id, {
                            ...album,
                            songs: album.songs.filter((id) =>
                                songIds.includes(id)
                            ),
                        });
                    });

                    editedPlaylistMap.forEach((playlist, id) => {
                        editedPlaylistMap.set(id, {
                            ...playlist,
                            songs: playlist.songs.filter((id) =>
                                songIds.includes(id)
                            ),
                        });
                    });

                    return {
                        albumMap: editedAlbumMap,
                        playlistMap: editedPlaylistMap,
                    };
                });

                get().removeEmptyAutoAlbums();
            },

            // playlists ----------------------------------------------------------
            createPlaylist: (inputFields) => {
                const newPlaylist = {
                    ...defaultLikedPlaylist,
                    id: createPlaylistId(),
                    title: inputFields.title || "Untitled Playlist",
                    description: inputFields.description || "",
                    artwork: inputFields.artwork,
                    lastModified: getCurrentTimestamp(),
                    createdAt: getCurrentTimestamp(),
                } as Playlist;

                set((state) => {
                    const editedPlaylistMap = new Map(state.playlistMap);
                    editedPlaylistMap.set(newPlaylist.id, newPlaylist);

                    return {
                        playlistMap: editedPlaylistMap,
                    };
                });
            },

            editPlaylist: (id, inputFields) => {
                set((state) => {
                    const editedPlaylistMap = new Map(state.playlistMap);
                    const playlist = editedPlaylistMap.get(id);
                    if (!playlist) return state;

                    editedPlaylistMap.set(id, {
                        ...playlist,
                        artwork: inputFields.artwork || playlist.artwork,
                        title: inputFields.title || "Untitled Playlist",
                        description: inputFields.description,
                    });

                    return {
                        playlistMap: editedPlaylistMap,
                    };
                });

                get().updateSelectedStates();
            },

            getAllPlaylistSongs: () => {
                const songIds = new Set(
                    Array.from(get().playlistMap.values()).flatMap(
                        (playlist) => playlist.songs
                    )
                );
                return Array.from(songIds)
                    .map((id) => get().songMap.get(id))
                    .filter((song): song is Song => song !== undefined);
            },

            addSongToPlaylist: (playlistId, songIds) => {
                set((state) => {
                    const editedPlaylistMap = new Map(state.playlistMap);
                    const editedSongsMap = new Map(state.songMap);

                    const playlist = editedPlaylistMap.get(playlistId);
                    if (!playlist) return state;

                    const updatedPlaylist = {
                        ...playlist,
                        songs: [...new Set([...playlist.songs, ...songIds])],
                        lastModified: getCurrentTimestamp(),
                    };
                    editedPlaylistMap.set(playlistId, updatedPlaylist);

                    if (playlistId === "1") {
                        // Update isLiked status for added songs
                        songIds.forEach((songId) => {
                            const song = editedSongsMap.get(songId);
                            if (song) {
                                editedSongsMap.set(songId, {
                                    ...song,
                                    rating: 1,
                                });
                            }
                        });
                    }

                    return {
                        playlistMap: editedPlaylistMap,
                        songMap: editedSongsMap,
                    };
                });

                get().updateSelectedStates();
            },

            removeSongFromPlaylist: (playlistId, songIds) => {
                set((state) => {
                    const editedPlaylistMap = new Map(state.playlistMap);
                    const editedSongsMap = new Map(state.songMap);
                    const playlist = editedPlaylistMap.get(playlistId);

                    if (!playlist) return state;

                    const updatedPlaylist = {
                        ...playlist,
                        songs: playlist.songs.filter(
                            (id) => !songIds.includes(id)
                        ),
                        lastModified: getCurrentTimestamp(),
                    };
                    editedPlaylistMap.set(playlistId, updatedPlaylist);

                    if (playlistId === "1") {
                        // Update isLiked status for removed songs
                        songIds.forEach((songId) => {
                            const song = editedSongsMap.get(songId);
                            if (song) {
                                editedSongsMap.set(songId, {
                                    ...song,
                                    rating: 0,
                                });
                            }
                        });
                    }

                    return {
                        playlistMap: editedPlaylistMap,
                        songMap: editedSongsMap,
                    };
                });

                get().updateSelectedStates();
            },

            // Albums ----------------------------------------------------------
            createAlbum: (inputFields) => {
                const id = createAlbumId(
                    inputFields.title || "Untitled Album",
                    inputFields.artist || "No artist"
                );

                const newAlbum: Album = {
                    id: id,
                    type: ContainerType.ALBUM,
                    autoCreated: false,
                    lastModified: moment().toString(),
                    createdAt: moment().toString(),

                    songs: [],
                    title: inputFields.title || "Untitled Album",
                    artist: inputFields.artist || "No artist",
                    year: inputFields.year || "No year",
                    artwork: inputFields.artwork || undefined,
                };

                set((state) => {
                    const editedAlbumMap = new Map(state.albumMap);
                    editedAlbumMap.set(id, newAlbum);

                    return {
                        albumMap: editedAlbumMap,
                    };
                });

                return id;
            },

            addAlbums: (albumFields, songIds) => {
                set((state) => {
                    const editedAlbumMap = new Map(state.albumMap);
                    const newAlbums = Object.entries(albumFields).map(
                        ([title, albumData]) => {
                            const songList = songIds[title] || [];

                            return {
                                id: albumData.id,
                                type: ContainerType.ALBUM,
                                autoCreated: false,
                                title: title,
                                artist: albumData.artist || "No artist",
                                artwork: albumData.artwork || undefined,
                                year: albumData.year || "No year",
                                songs: songList,
                                lastModified: moment().toString(),
                                createdAt: moment().toString(),
                            } as Album;
                        }
                    );

                    newAlbums.forEach((album) => {
                        editedAlbumMap.set(album.id, album);
                    });

                    return {
                        albumMap: editedAlbumMap,
                    };
                });
            },

            editAlbum: (id, inputFields) => {
                set((state) => {
                    const editedAlbumMap = new Map(state.albumMap);
                    const album = editedAlbumMap.get(id);
                    if (!album) return state;

                    editedAlbumMap.set(id, {
                        ...album,
                        artwork: inputFields.artwork || album.artwork,
                        title: inputFields.title || "Untitled Album",
                        artist: inputFields.artist || "No artist",
                        year: inputFields.year || "No year",
                    });

                    return {
                        albumMap: editedAlbumMap,
                    };
                });

                get().updateSelectedStates();
            },

            removeEmptyAutoAlbums: () => {
                set((state) => {
                    const editedAlbumMap = new Map(state.albumMap);
                    editedAlbumMap.forEach((album, id) => {
                        if (album.songs.length === 0 && album.autoCreated) {
                            editedAlbumMap.delete(id);
                        }
                    });

                    return {
                        albumMap: editedAlbumMap,
                    };
                });
            },

            getAllAlbumSongs: () => {
                const songIds = new Set(
                    Array.from(get().albumMap.values()).flatMap(
                        (album) => album.songs
                    )
                );
                return Array.from(songIds)
                    .map((id) => get().songMap.get(id))
                    .filter((song): song is Song => song !== undefined);
            },

            getAlbumBySong: (songId) => {
                const song = get().getSong(songId);
                if (!song) return;

                return get().getAlbum(song.albumIds[0]);
            },

            addSongToAlbum: (albumId, songId) => {
                set((state) => {
                    const editedAlbumMap = new Map(state.albumMap);
                    const editedSongMap = new Map(state.songMap);

                    const album = editedAlbumMap.get(albumId);
                    const song = editedSongMap.get(songId);

                    if (!album || !song) return state;

                    if (!album.songs.includes(songId)) {
                        // Update album
                        editedAlbumMap.set(albumId, {
                            ...album,
                            songs: [...album.songs, songId],
                            lastModified: getCurrentTimestamp(),
                        });

                        // Update song
                        editedSongMap.set(songId, {
                            ...song,
                            albumIds: [...song.albumIds, albumId],
                        });

                        return {
                            albumMap: editedAlbumMap,
                            songMap: editedSongMap,
                        };
                    }

                    return state;
                });

                get().updateSelectedStates();
            },

            removeSongFromAlbum: (albumId, songId) => {
                set((state) => {
                    const editedAlbumMap = new Map(state.albumMap);
                    const editedSongMap = new Map(state.songMap);

                    const album = editedAlbumMap.get(albumId);
                    const song = editedSongMap.get(songId);

                    if (!album || !song) return state;

                    if (album.songs.includes(songId)) {
                        // Update album
                        editedAlbumMap.set(albumId, {
                            ...album,
                            songs: album.songs.filter((id) => id !== songId),
                            lastModified: getCurrentTimestamp(),
                        });

                        // Update song
                        editedSongMap.set(songId, {
                            ...song,
                            albumIds: song.albumIds.filter(
                                (id) => id !== albumId
                            ),
                        });

                        return {
                            albumMap: editedAlbumMap,
                            songMap: editedSongMap,
                        };
                    }

                    return state;
                });

                get().updateSelectedStates();
            },

            getRecentlyAddedSongs: () => {
                const songs = Array.from(get().songMap.values());
                return songs
                    .sort(
                        (a, b) =>
                            new Date(b.statistics.creationDate).getTime() -
                            new Date(a.statistics.creationDate).getTime()
                    )
                    .slice(0, 10);
            },

            // Algo
            getRecentlyPlayed: () => {
                const history = get().history;
                const likedPlaylist = get().getPlaylist("1");
                if (likedPlaylist === undefined) return [];

                const historyAlbums: Album[] = [];
                if (history.consciousHistory.length > 0) {
                    history.consciousHistory
                        .slice()
                        .reverse()
                        .forEach((item) => {
                            if (historyAlbums.length > 5) return;

                            if (item.containerId !== "0" && item.containerId) {
                                const album = get().getAlbum(item.containerId);
                                if (album && !historyAlbums.includes(album))
                                    historyAlbums.push(album);
                            } else {
                                const album = get().getAlbumBySong(item.song);
                                if (album && !historyAlbums.includes(album))
                                    historyAlbums.push(album);
                            }
                        });
                }

                return [likedPlaylist, ...historyAlbums];
            },
        }),
        {
            name: MARKED_SONGS_KEY,
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state): PersistedState => ({
                songs: mapToArray(state.songMap),
                albums: mapToArray(state.albumMap),
                playlists: mapToArray(state.playlistMap),
                history: state.history,
            }),
            onRehydrateStorage: () => (state) => {
                if (!state) return;

                // Type assertion to access the temporary array properties
                const persistedState = state as unknown as PersistedState;

                // Convert arrays to maps
                state.songMap = arrayToMap(persistedState.songs);
                state.albumMap = arrayToMap(persistedState.albums);
                state.playlistMap = arrayToMap(persistedState.playlists);

                // Clean up temporary arrays
                delete (state as any).songs;
                delete (state as any).albums;
                delete (state as any).playlists;
            },
        }
    )
);
