import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { router } from "expo-router";
import TrackPlayer, { RepeatMode } from "react-native-track-player";
import { Album, History, Playlist, Song } from "../types/song";

const MARKED_SONGS_KEY = "MarkedSongs";

type SongsStore = {
    songs: Song[];
    playlists: Playlist[];
    albums: Album[];
    history: History;

    selectedSong: Song | undefined;
    selectedPlaylist: Playlist | undefined;
    selectedAlbum: Album | undefined;

    selectedContainer: Playlist | Album | undefined;

    setSelectedSong: (song: Song) => void;

    // to be replaced by containers
    setSelectedPlaylist: (playlist: Playlist) => void;
    setSelectedAlbum: (album: Album) => void;

    setSelectedContainer: (container: Playlist | Album) => void;

    repeatMode: RepeatMode; // enum

    resetAll: () => void;

    // for music playback
    resetPlayer: () => Promise<void>;
    play: () => Promise<void>;
    pause: () => Promise<void>;
    next: () => Promise<void>;
    previous: () => Promise<void>;
    seekToPosition: (position: number) => Promise<void>;

    setRepeatMode: (mode: RepeatMode) => Promise<void>;

    addToQueue: (song: Song | Song[]) => Promise<void>;
    addListToQueue: (
        list: Song[],
        selectedSong?: Song,
        redirect?: boolean
    ) => Promise<void>;

    shuffle: () => void;
    shuffleList: (list: Song[], redirect?: boolean) => Promise<void>;

    // // songs
    setSongs: (songs: Song[]) => void;
    addSongs: (songs: Song[]) => void;
    doesSongExist: (id: string) => boolean;
    getSong: (id: string) => Song | undefined;
    likeSong: (id: string) => void;
    unlikeSong: (id: string) => void;
    hideSong: (id: string) => void;
    unhideSong: (id: string) => void;

    isSongInAnyAlbum: (songId: string) => boolean;
    autoUpdateSongTags: (songId: string) => void;
    updateSongTagsByAlbum: (albumId: string) => void;
    // // UPDATE SONG TAGS

    // // statistics
    updateSongSkip: (id: string) => void;
    updateSongStatistics: (id: string) => void;

    //  // history
    addSongToHistory: (id: string) => void;
    addSongToConsciousHistory: (id: string) => void;

    getHistory: () => History;
    clearHistory: () => void;

    getAlbumRanking: (albumId: string) => Song[] | undefined;
    getSongRanking: (songId: string) => number;

    // // container
    getSongsFromContainer: (id: string) => Song[];
    getContainer: (id: string) => Playlist | Album | undefined;

    // // playlists
    createPlaylist: (inputFields: Partial<Playlist>) => void;
    editPlaylist: (id: string, inputFields: Partial<Playlist>) => void;
    deletePlaylist: (id: string) => void;

    getPlaylist: (id: string) => Playlist | undefined;

    getAllPlaylistSongs: () => Song[] | undefined;
    getSongsFromPlaylist: (id: string) => Song[];

    addSongToPlaylist: (playlistId: string, songId: string) => void;
    removeSongFromPlaylist: (playlistId: string, songId: string) => void;

    // // albums
    createAlbum: (inputFields: Partial<Album>) => string;
    editAlbum: (id: string, inputFields: Partial<Album>) => void;
    deleteAlbum: (id: string) => void;

    doesAlbumExist: (name: string) => boolean;

    getAlbum: (id: string) => Album | undefined;
    getAlbumByName: (name: string) => Album | undefined;
    getAlbumBySong: (songId: string) => Album | undefined;

    getAllAlbumSongs: () => Song[] | undefined;
    getSongsFromAlbum: (id: string) => Song[];

    addSongToAlbum: (albumId: string, songId: string) => void;
    removeSongFromAlbum: (albumId: string, songId: string) => void;

    // Algo
    getRecentlyPlayed: () => (Album | Playlist)[];
    // getMostPlayed: () => (Album | Playlist)[];
};
export const useSongsStore = create<SongsStore>()(
    persist(
        (set, get) => ({
            songs: [],
            playlists: [
                {
                    id: "1",
                    title: "Liked songs",
                    description: "Your songs that you liked.",
                    artwork: undefined,
                    songs: [], //contains only id's
                    lastModified: undefined,
                    createdAt: new Date().toString(),
                },
            ],
            albums: [],
            history: {
                history: [],
                consciousHistory: [],
            },

            repeatMode: RepeatMode.Queue,

            // menus
            selectedSong: undefined,
            selectedPlaylist: undefined,
            selectedAlbum: undefined,

            selectedContainer: undefined,

            setSelectedSong: (song) => {
                set({ selectedSong: song });
            },

            setSelectedAlbum: (album) => {
                set({ selectedAlbum: album });
            },

            setSelectedPlaylist: (playlist) => {
                set({ selectedPlaylist: playlist });
            },

            setSelectedContainer: (container) => {
                set({ selectedContainer: container });
            },

            resetAll: () => {
                set({
                    songs: [],
                    playlists: [
                        {
                            id: "1",
                            title: "Liked songs",
                            description: "Your songs that you liked.",
                            artwork: undefined,
                            songs: [],
                            lastModified: undefined,
                            createdAt: new Date().toString(),
                        },
                    ],
                    albums: [],
                    history: {
                        history: [],
                        consciousHistory: [],
                    },
                });
                console.log("reset all!");
            },

            // Music playback ----------------------------------------------------------
            resetPlayer: async () => {
                await TrackPlayer.reset();
            },
            play: async () => {
                await TrackPlayer.play();
            },
            pause: async () => {
                await TrackPlayer.pause();
            },
            next: async () => {
                const current = await TrackPlayer.getActiveTrack();
                get().updateSongSkip(current?.id);

                await TrackPlayer.skipToNext();
            },
            previous: async () => {
                const playbackProgress = await TrackPlayer.getProgress();

                if (playbackProgress.position >= 3) {
                    await TrackPlayer.seekTo(0);
                } else {
                    await TrackPlayer.skipToPrevious();
                }
            },
            seekToPosition: async (position) => {
                await TrackPlayer.seekTo(position);
            },
            setRepeatMode: async (mode) => {
                await TrackPlayer.setRepeatMode(mode);
            },

            addToQueue: async (song) => {
                if (Array.isArray(song)) {
                    await TrackPlayer.add(song);
                    get().addSongToConsciousHistory(song[0].id);
                } else {
                    await TrackPlayer.add([song]);
                    get().addSongToConsciousHistory(song.id);
                }
            },

            addListToQueue: async (list, selectedSong, redirect = false) => {
                if (selectedSong) {
                    const selectedSongIndex = list.findIndex(
                        (song) => song.id === selectedSong.id
                    );

                    if (selectedSongIndex > 0) {
                        const songsBefore = list.slice(0, selectedSongIndex);
                        const songsAfter = list.slice(selectedSongIndex);
                        await TrackPlayer.setQueue([
                            ...songsAfter,
                            ...songsBefore,
                        ]);
                    } else {
                        await TrackPlayer.setQueue(list);
                    }
                    get().addSongToConsciousHistory(selectedSong.id);
                } else {
                    await TrackPlayer.setQueue(list);
                    get().addSongToConsciousHistory(list[0].id);
                }

                await TrackPlayer.play();
                if (redirect) router.push("/player");
            },

            shuffle: async () => {},

            shuffleList: async (list, redirect = false) => {
                const shuffledList = [...list].sort(() => Math.random() - 0.5);
                await TrackPlayer.setQueue(shuffledList);
                await TrackPlayer.play();
                get().addSongToConsciousHistory(shuffledList[0].id);
                if (redirect) router.push("/player");
            },

            // songs ----------------------------------------------------------
            setSongs: (songs) => set({ songs }),
            addSongs: (songs) => {
                set((state) => ({
                    songs: [...state.songs, ...songs],
                }));
            },
            getSong: (id) => get().songs.find((song) => song.id === id),
            doesSongExist: (id) => {
                return get().songs.some((song) => song.id === id);
            },

            likeSong: (id) => {
                get().addSongToPlaylist("1", id);
            },
            unlikeSong: (id) => {
                get().removeSongFromPlaylist("1", id);
            },

            hideSong: (id) => {
                set((state) => ({
                    songs: state.songs.map((song) =>
                        song.id === id ? { ...song, isHidden: true } : song
                    ),
                }));
            },

            unhideSong: (id) => {
                set((state) => ({
                    songs: state.songs.map((song) =>
                        song.id === id ? { ...song, isHidden: false } : song
                    ),
                }));
            },

            updateSongStatistics: (id) => {
                set((state) => ({
                    songs: state.songs.map((song) =>
                        song.id === id
                            ? {
                                  ...song,
                                  statistics: {
                                      ...song.statistics,
                                      lastPlayed: new Date().toString(),
                                      playCount: song.statistics.playCount + 1,
                                  },
                              }
                            : song
                    ),
                }));

                console.log("updated statistics for: " + id);
            },

            updateSongSkip: (id) => {
                set((state) => ({
                    songs: state.songs.map((song) =>
                        song.id === id
                            ? {
                                  ...song,
                                  statistics: {
                                      ...song.statistics,
                                      skipCount: song.statistics.skipCount + 1,
                                  },
                              }
                            : song
                    ),
                }));
            },
            // statistics ---------------------------------------------------------
            addSongToHistory: (id) => {
                const song = get().getSong(id);
                if (song === undefined) return;

                set((state) => ({
                    history: {
                        ...state.history,
                        history: [
                            ...state.history.history,
                            {
                                song: id,
                                date: new Date(),
                                containerId: song.albumIds[0],
                            },
                        ],
                    },
                }));

                console.log(
                    "added " +
                        song.title +
                        " to history at " +
                        new Date().toLocaleTimeString()
                );
            },

            addSongToConsciousHistory: (id) => {
                const song = get().getSong(id);
                if (song === undefined) return;

                const history = get().history;
                const newConsciousHistory = [
                    ...history.consciousHistory.slice(-5),
                    {
                        song: id,
                        date: new Date(),
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

                const songs = container?.songs
                    .map((songId) =>
                        get().songs.find((song) => song.id === songId)
                    )
                    .filter((s) => s !== undefined) as Song[];

                if (container?.id[0] === "P" || container?.id === "1") {
                    return songs?.slice().reverse();
                } else {
                    return songs;
                }
            },

            getContainer: (id) => {
                if (id[0] === "A") {
                    // album
                    return get().getAlbum(id);
                } else {
                    // playlist
                    return get().getPlaylist(id);
                }
            },

            // playlists ----------------------------------------------------------
            createPlaylist: (inputFields) => {
                const newPlaylist: Playlist = {
                    id: (
                        "P" +
                        Date.now().toString(36) +
                        Math.random().toString(36).substr(2, 5)
                    ).toUpperCase(),
                    title: inputFields.title
                        ? inputFields.title
                        : "Unnamed playlist",
                    description: inputFields.description
                        ? inputFields.description
                        : undefined,
                    artwork: inputFields.artwork
                        ? inputFields.artwork
                        : undefined,
                    songs: [],
                    lastModified: undefined,
                    createdAt: new Date().toString(),
                };

                set((state) => ({
                    playlists: [...state.playlists, newPlaylist],
                }));
            },

            editPlaylist: (id, inputFields) => {
                set((state) => ({
                    playlists: state.playlists.map((playlist) =>
                        playlist.id === id
                            ? {
                                  ...playlist,
                                  ...inputFields,
                              }
                            : playlist
                    ),
                }));
            },
            deletePlaylist: (id) => {
                set((state) => ({
                    playlists: state.playlists.filter(
                        (playlist) => playlist.id !== id
                    ),
                }));
            },

            getAllPlaylistSongs: () => {
                const songs = get()
                    .playlists.map((playlist) => playlist.songs)
                    .reduce((a, b) => a.concat(b), [])
                    .map((songId) => get().songs.find((s) => s.id === songId))
                    .filter((s) => s !== undefined) as Song[];

                return songs;
            },

            getPlaylist: (id) => {
                const playlists = get().playlists;
                const playlist = playlists.find(
                    (playlist) => playlist.id === id
                );

                return playlist;
            },

            getSongsFromPlaylist: (id) => {
                const playlist = get().getPlaylist(id);

                return playlist?.songs
                    .map((songId) =>
                        get().songs.find((song) => song.id === songId)
                    )
                    .filter((s) => s !== undefined) as Song[];
            },

            addSongToPlaylist: (playlistId, songId) => {
                const playlist = get().getPlaylist(playlistId);

                if (playlist?.songs.includes(songId)) return;

                if (playlistId === "1") {
                    set((state) => {
                        const song = state.songs.find((s) => s.id === songId);
                        if (song) song.isLiked = true;
                        return state;
                    });
                }

                set((state) => ({
                    playlists: state.playlists.map((playlist) =>
                        playlist.id === playlistId
                            ? {
                                  ...playlist,
                                  songs: [...playlist.songs, songId],
                              }
                            : playlist
                    ),
                }));
            },

            removeSongFromPlaylist: (playlistId, songId) => {
                set((state) => {
                    const playlist = state.playlists.find(
                        (p) => p.id === playlistId
                    );

                    if (playlistId === "1") {
                        const song = state.songs.find((s) => s.id === songId);
                        if (song) song.isLiked = false;
                    }

                    if (!playlist?.songs.includes(songId)) return state;

                    return {
                        playlists: state.playlists.map((playlist) =>
                            playlist.id === playlistId
                                ? {
                                      ...playlist,
                                      songs: playlist.songs.filter(
                                          (id) => id !== songId
                                      ),
                                  }
                                : playlist
                        ),
                    };
                });
            },

            // Albums ----------------------------------------------------------
            createAlbum: (inputFields) => {
                const id = (
                    "A" +
                    Date.now().toString(36) +
                    Math.random().toString(36).substr(2, 5)
                ).toUpperCase();
                const newAlbum: Album = {
                    id: id,
                    songs: [],
                    title: inputFields.title
                        ? inputFields.title
                        : "Unnamed album",
                    artist: inputFields.artist
                        ? inputFields.artist
                        : "No artist",
                    year: inputFields.year ? inputFields.year : "No year",
                    artwork: inputFields.artwork
                        ? inputFields.artwork
                        : undefined,
                    lastModified: undefined,
                    createdAt: new Date().toString(),
                };

                set((state) => ({
                    albums: [...state.albums, newAlbum],
                }));

                return id;
            },

            editAlbum: (id, inputFields) => {
                set((state) => ({
                    albums: state.albums.map((album) =>
                        album.id === id
                            ? {
                                  ...album,
                                  ...inputFields,
                              }
                            : album
                    ),
                }));

                get().updateSongTagsByAlbum(id);
            },

            deleteAlbum: (id) => {
                set((state) => ({
                    albums: state.albums.filter((a) => a.id !== id),
                }));
            },

            getAllAlbumSongs: () => {
                const songs = get()
                    .albums.map((album) => album.songs)
                    .reduce((a, b) => a.concat(b), [])
                    .map((songId) => get().songs.find((s) => s.id === songId))
                    .filter((s) => s !== undefined) as Song[];

                return songs;
            },

            getAlbum: (id) => {
                const albums = get().albums;
                const album = albums.find((a) => a.id === id);

                return album;
            },

            getAlbumByName: (name) => {
                const albums = get().albums;
                const album = albums.find((a) => a.title === name);

                return album;
            },

            isSongInAnyAlbum: (songId) => {
                const albums = get().albums;

                return albums.some((album) => album.songs.includes(songId));
            },

            doesAlbumExist: (name) => {
                const albums = get().albums;
                const album = albums.find((a) => a.title === name);
                if (album) return true;
                return false;
            },

            getSongsFromAlbum: (id) => {
                const album = get().getAlbum(id);

                return album?.songs
                    .map((songId) =>
                        get().songs.find((song) => song.id === songId)
                    )
                    .filter((s) => s !== undefined) as Song[];
            },

            getAlbumBySong: (songId) => {
                const song = get().getSong(songId);
                if (!song) return;

                return get().getAlbum(song.albumIds[0]);
            },

            addSongToAlbum: (albumId, songId) => {
                const album = get().getAlbum(albumId);

                if (!album) return;

                if (!album.songs.includes(songId)) {
                    set((state) => ({
                        albums: state.albums.map((album) =>
                            album.id === albumId
                                ? { ...album, songs: [...album.songs, songId] }
                                : album
                        ),
                    }));
                    set((state) => ({
                        songs: state.songs.map((song) =>
                            song.id === songId
                                ? {
                                      ...song,
                                      albumIds: [...song.albumIds, albumId],
                                  }
                                : song
                        ),
                    }));
                }

                get().autoUpdateSongTags(songId);
            },

            removeSongFromAlbum: (albumId, songId) => {
                const album = get().getAlbum(albumId);

                if (album?.songs.includes(songId)) {
                    set((state) => ({
                        albums: state.albums.map((album) =>
                            album.id === albumId
                                ? {
                                      ...album,
                                      songs: album.songs.filter(
                                          (id) => id !== songId
                                      ),
                                  }
                                : album
                        ),
                    }));

                    set((state) => ({
                        songs: state.songs.map((song) =>
                            song.id === songId
                                ? {
                                      ...song,
                                      albumIds: song.albumIds.filter(
                                          (id) => id !== albumId
                                      ),
                                  }
                                : song
                        ),
                    }));
                }

                get().autoUpdateSongTags(songId);
            },

            updateSongTagsByAlbum: (albumId) => {
                const album = get().getAlbum(albumId);
                if (!album) return;

                album.songs.forEach((song) => {
                    get().autoUpdateSongTags(song);
                });
            },

            autoUpdateSongTags: (songId) => {
                const song = get().getSong(songId);
                if (!song) return;

                const relatedAlbum = get().getAlbum(song.albumIds[0]);
                if (!relatedAlbum) {
                    // remove just the artwork for the song
                    set((state) => ({
                        songs: state.songs.map((s) =>
                            s.id === songId ? { ...s, artwork: undefined } : s
                        ),
                    }));

                    return;
                }

                set((state) => ({
                    songs: state.songs.map((s) =>
                        s.id === songId
                            ? {
                                  ...s,
                                  artist: relatedAlbum.artist,
                                  artwork: relatedAlbum.artwork,
                                  year: relatedAlbum.year,
                              }
                            : s
                    ),
                }));
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
            partialize: (state) => ({
                songs: state.songs,
                playlists: state.playlists,
                albums: state.albums,
                history: state.history,
            }),
        }
    )
);
