import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { router } from "expo-router";
import TrackPlayer, {
    AppKilledPlaybackBehavior,
    Capability,
    RatingType,
    RepeatMode,
} from "react-native-track-player";
import { Album, Playlist, Song } from "../types/song";
import { PlaybackService } from "../../PlaybackService";

const MARKED_SONGS_KEY = "MarkedSongs";

type SongsStore = {
    songs: Song[];
    playlists: Playlist[];
    albums: Album[];

    selectedSong: Song | null;
    selectedPlaylist: Playlist | null;
    selectedAlbum: Album | null;

    setSelectedSong: (song: Song) => void;
    setSelectedPlaylist: (playlist: Playlist) => void;
    setSelectedAlbum: (album: Album) => void;

    repeatMode: RepeatMode; // enum

    resetAll: () => void;

    // for music playback
    setup: () => Promise<void>;
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
    getSong: (id: string) => Song | undefined;
    likeSong: (id: string) => void;
    unlikeSong: (id: string) => void;
    hideSong: (id: string) => void;
    unhideSong: (id: string) => void;
    // // UPDATE SONG TAGS

    // // statistics

    // // playlists
    createPlaylist: (inputFields: Partial<Playlist>) => void;
    editPlaylist: (id: string, inputFields: Partial<Playlist>) => void;
    deletePlaylist: (id: string) => void;

    getPlaylist: (id: string) => Playlist | undefined;
    getSongsFromPlaylist: (id: string) => Song[];

    addSongToPlaylist: (playlistId: string, songId: string) => void;
    removeSongFromPlaylist: (playlistId: string, songId: string) => void;

    // // albums
    createAlbum: (inputFields: Partial<Album>) => void;
    editAlbum: (id: string, inputFields: Partial<Album>) => void;
    deleteAlbum: (id: string) => void;

    getAlbum: (id: string) => Album | undefined;
    getSongsFromAlbum: (id: string) => Song[];

    addSongToAlbum: (albumId: string, songId: string) => void;
    removeSongFromAlbum: (albumId: string, songId: string) => void;

    copyAlbumTagsToSongs: (albumId: string) => void;
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
                },
            ],
            albums: [],
            repeatMode: RepeatMode.Queue,

            // menus
            selectedSong: null,
            selectedPlaylist: null,
            selectedAlbum: null,

            setSelectedSong: (song) => {
                set({ selectedSong: song });
            },

            setSelectedAlbum: (album) => {
                set({ selectedAlbum: album });
            },

            setSelectedPlaylist: (playlist) => {
                set({ selectedPlaylist: playlist });
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
                            songs: [], //contains only id's
                        },
                    ],
                    albums: [],
                });
            },

            // Music playback ----------------------------------------------------------
            setup: async () => {
                try {
                    await TrackPlayer.getActiveTrack();
                } catch (error) {
                    TrackPlayer.registerPlaybackService(() => PlaybackService);

                    await TrackPlayer.setupPlayer({
                        autoHandleInterruptions: true,
                    });

                    await TrackPlayer.updateOptions({
                        ratingType: RatingType.Heart,
                        android: {
                            appKilledPlaybackBehavior:
                                AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
                        },
                        notificationCapabilities: [
                            Capability.Play,
                            Capability.Pause,
                            Capability.SkipToNext,
                            Capability.SkipToPrevious,
                            Capability.SeekTo,
                            Capability.SetRating,
                        ],
                    });
                    await TrackPlayer.setRepeatMode(RepeatMode.Queue);
                }
            },
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
                await TrackPlayer.skipToNext();
            },
            previous: async () => {
                await TrackPlayer.skipToPrevious();
            },
            seekToPosition: async (position) => {
                await TrackPlayer.seekTo(position);
            },
            setRepeatMode: async (mode) => {
                await TrackPlayer.setRepeatMode(mode);
            },

            addToQueue: async (song) => {
                if (Array.isArray(song)) await TrackPlayer.add(song);
                else await TrackPlayer.add([song]);
            },

            addListToQueue: async (list, selectedSong, redirect = false) => {
                await TrackPlayer.setQueue(list);
                if (selectedSong) {
                    const currentIndex = list.findIndex(
                        (song) => song.id === selectedSong.id
                    );
                    await TrackPlayer.skip(currentIndex);
                }
                await TrackPlayer.play();
                if (redirect) router.push("/player");
            },

            shuffle: async () => {},
            shuffleList: async (list, redirect = false) => {
                const shuffledList = [...list].sort(() => Math.random() - 0.5);
                await TrackPlayer.setQueue(shuffledList);
                await TrackPlayer.play();
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

            // playlists ----------------------------------------------------------
            createPlaylist: (inputFields) => {
                const newPlaylist: Playlist = {
                    id: (
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
                const newAlbum: Album = {
                    id: (
                        Date.now().toString(36) +
                        Math.random().toString(36).substr(2, 5)
                    ).toUpperCase(),
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
                };

                set((state) => ({
                    albums: [...state.albums, newAlbum],
                }));
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
            },

            deleteAlbum: (id) => {
                set((state) => ({
                    albums: state.albums.filter((a) => a.id !== id),
                }));
            },

            getAlbum: (id) => {
                const albums = get().albums;
                const album = albums.find((a) => a.id === id);

                return album;
            },

            getSongsFromAlbum: (id) => {
                const album = get().getAlbum(id);

                return album?.songs
                    .map((songId) =>
                        get().songs.find((song) => song.id === songId)
                    )
                    .filter((s) => s !== undefined) as Song[];
            },

            addSongToAlbum: (albumId, songId) => {
                const album = get().getAlbum(albumId);

                if (!album?.songs.includes(songId)) {
                    set((state) => ({
                        albums: state.albums.map((album) =>
                            album.id === albumId
                                ? { ...album, songs: [...album.songs, songId] }
                                : album
                        ),
                    }));
                }
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
                }
            },

            copyAlbumTagsToSongs: (albumId) => {
                const album = get().getAlbum(albumId);

                set((state) => ({
                    songs: state.songs.map((song) =>
                        album?.songs.includes(song.id)
                            ? {
                                  ...song,
                                  artist: album.artist,
                                  artwork: album.artwork,
                                  year: album.year,
                              }
                            : song
                    ),
                }));
            },
        }),
        {
            name: MARKED_SONGS_KEY,
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                songs: state.songs,
                playlists: state.playlists,
                albums: state.albums,
            }),
        }
    )
);
