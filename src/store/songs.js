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
// import { PlaybackService } from "../../PlaybackService";

const MARKED_SONGS_KEY = "MarkedSongs";

export const useSongsStore = create(
    persist(
        (set, get) => ({
            songs: [], //full data (such as the uri)
            playlists: [
                {
                    id: "1",
                    name: "Liked songs",
                    description: "Your songs that you liked.",
                    artwork: null,
                    songs: [], //contains only id's
                },
            ],
            albums: [],

            // for menus, ect..
            selectedSong: null,
            selectedPlaylist: null,
            selectedAlbum: null,
            activeBottomSheets: [], // would be cool maybe?
            safeAreaInsets: 0,
            setSafeAreaInsets: (insets) => {
                set({ safeAreaInsets: insets });
            },

            // for music playback
            repeat: false,
            playingFrom: null,

            setRepeat: (mode) => {},
            shuffle: () => {},

            setup: async () => {
                try {
                    await TrackPlayer.getActiveTrack();
                } catch (error) {
                    // TrackPlayer.registerPlaybackService(() => PlaybackService);

                    await TrackPlayer.setupPlayer({
                        autoHandleInterruptions: true,
                    });

                    await TrackPlayer.updateOptions({
                        progressUpdateInterval: 250,
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
            addToQueue: async (song) => {
                await TrackPlayer.add(song);
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
            shuffleList: async (list, redirect = false) => {
                const shuffledList = [...list].sort(() => Math.random() - 0.5);
                await TrackPlayer.setQueue(shuffledList);
                await TrackPlayer.play();
                if (redirect) router.push("/player");
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
            seekToPosition: async (position = 0) => {
                await TrackPlayer.seekTo(position);
            },

            logQueue: async () => {
                console.log(await TrackPlayer.getQueue());
            },
            logCurrentTrack: async () => {
                console.log(await TrackPlayer.getActiveTrack());
            },

            resetAll: () => {
                set({
                    songs: [], //full data (such as the uri)
                    playlists: [
                        {
                            id: "1",
                            name: "Liked songs",
                            description: "Your songs that you liked.",
                            artwork: null,
                            songs: [], //contains only id's
                        },
                    ],
                    albums: [],
                });
            },

            // songs, selectedSong
            setSongs: (songs) => set({ songs }),
            getSong: (id) => get().songs.find((song) => song.id === id),
            setSelectedSong: (song) => set({ selectedSong: song }),

            // like, unlike
            addSongLike: (id) => {
                get().addSongToPlaylist("1", id);
            },
            removeSongLike: (id) => {
                get().removeSongFromPlaylist("1", id);
            },

            hideSong: (id) => {
                set((state) => ({
                    songs: state.songs.map((song) =>
                        song.id === id
                            ? { ...song, isHidden: true, isLiked: false }
                            : song
                    ),
                    playlists: state.playlists.map((playlist) => ({
                        ...playlist,
                        songs: playlist.songs.filter((songId) => songId !== id),
                    })),
                }));
            },

            unhideSong: (id) => {
                set((state) => ({
                    songs: state.songs.map((song) =>
                        song.id === id ? { ...song, isHidden: false } : song
                    ),
                }));
            },

            updateStatistics: (songId) => {
                set((state) => ({
                    songs: state.songs.map((song) =>
                        song.id === songId
                            ? {
                                  ...song,
                                  timesPlayed: song.timesPlayed + 1,
                                  lastPlayed: new Date(),
                              }
                            : song
                    ),
                }));
            },

            updateSongTags: (songId, tags) => {},

            // playlists
            setPlaylists: (playlists) => set({ playlists }),
            setSelectedPlaylist: (playlist) =>
                set({ selectedPlaylist: playlist }),

            createPlaylist: (name, description, artwork = null) => {
                name = name ? name : "Unnamed playlist";
                const newPlaylist = {
                    id: (
                        Date.now().toString(36) +
                        Math.random().toString(36).substr(2, 5)
                    ).toUpperCase(),
                    name,
                    description,
                    artwork,
                    songs: [],
                };
                set((state) => ({
                    playlists: [...state.playlists, newPlaylist],
                }));
            },

            editPlaylist: (id, name, description, artwork) => {
                name = name ? name : "Unnamed playlist";
                set((state) => ({
                    playlists: state.playlists.map((playlist) =>
                        playlist.id === id
                            ? {
                                  ...playlist,
                                  ...name,
                                  ...(description !== ""
                                      ? { description }
                                      : {}),
                                  ...(artwork !== null ? { artwork } : {}),
                              }
                            : playlist
                    ),
                }));
            },
            deletePlaylist: (id) => {
                set((state) => ({
                    playlists: state.playlists.filter((p) => p.id !== id),
                }));
            },
            getPlaylistsFromSongID: (id, isInverted = false) => {
                if (isInverted) {
                    return get().playlists.filter((playlist) =>
                        playlist.songs.includes(id)
                    );
                }
                return get().playlists.filter(
                    (playlist) => !playlist.songs.includes(id)
                );
            },

            getPlaylist: (id) => {
                const playlists = get().playlists;
                const playlist = playlists.find((p) => p.id === id);

                return playlist;
            },

            getSongDataFromPlaylist: (id) => {
                const playlists = get().playlists;
                const playlist = playlists.find((p) => p.id === id);

                const songData = playlist.songs.map((songId) =>
                    get().songs.find((s) => s.id === songId)
                );

                return songData;
            },

            addSongToPlaylist: (playlistId, songId) => {
                const playlists = get().playlists;
                const playlist = playlists.find((p) => p.id === playlistId);

                if (!playlist.songs.includes(songId)) {
                    if (playlistId == 1) {
                        set((state) => ({
                            songs: state.songs.map((song) =>
                                song.id === songId
                                    ? { ...song, isLiked: true }
                                    : song
                            ),
                        }));
                    }
                    set((state) => ({
                        playlists: state.playlists.map((p) =>
                            p.id === playlistId
                                ? { ...p, songs: [...p.songs, songId] }
                                : p
                        ),
                    }));
                }
            },

            removeSongFromPlaylist: (playlistId, songId) => {
                const playlists = get().playlists;
                const playlist = playlists.find((p) => p.id === playlistId);

                if (playlist.songs.includes(songId)) {
                    if (playlistId == 1) {
                        set((state) => ({
                            songs: state.songs.map((song) =>
                                song.id === songId
                                    ? { ...song, isLiked: false }
                                    : song
                            ),
                        }));
                    }
                    set((state) => ({
                        playlists: state.playlists.map((p) =>
                            p.id === playlistId
                                ? {
                                      ...p,
                                      songs: p.songs.filter(
                                          (id) => id !== songId
                                      ),
                                  }
                                : p
                        ),
                    }));
                }
            },

            // Albums
            createAlbum: (formInputs) => {
                const newAlbum = {
                    id: (
                        Date.now().toString(36) +
                        Math.random().toString(36).substr(2, 5)
                    ).toUpperCase(),
                    ...formInputs,

                    title: formInputs.title
                        ? formInputs.title
                        : "Unnamed album",
                    artist: formInputs.artist ? formInputs.artist : "No artist",
                    year: formInputs.year ? formInputs.year : "No year",
                    songs: [],
                };

                set((state) => ({
                    albums: [...state.albums, newAlbum],
                }));
            },

            setSelectedAlbum: (album) => {
                set({ selectedAlbum: album });
            },

            deleteAlbum: (id) => {
                set((state) => ({
                    albums: state.albums.filter((a) => a.id !== id),
                }));
            },

            editAlbum: (id, formInputs) => {
                set((state) => ({
                    albums: state.albums.map((album) =>
                        album.id === id
                            ? {
                                  ...album,
                                  ...formInputs,
                                  title: formInputs.title
                                      ? formInputs.title
                                      : "Unnamed album",
                                  artist: formInputs.artist
                                      ? formInputs.artist
                                      : "No artist",
                                  year: formInputs.year
                                      ? formInputs.year
                                      : "No year",
                              }
                            : album
                    ),
                }));
            },

            getAlbumByID: (albumId) => {
                const albums = get().albums;
                const album = albums.find((a) => a.id === albumId);

                return album;
            },

            getAlbumSongData: (albumId) => {
                const albums = get().albums;
                const album = albums.find((a) => a.id === albumId);

                const songData = album.songs.map((songId) =>
                    get().songs.find((s) => s.id === songId)
                );

                return songData;
            },

            addSongToAlbum: (albumId, songId) => {
                const album = get().getAlbumByID(albumId);

                if (!album.songs.includes(songId)) {
                    set((state) => ({
                        albums: state.albums.map((a) =>
                            a.id === albumId
                                ? { ...a, songs: [...a.songs, songId] }
                                : a
                        ),
                    }));
                }
            },

            removeSongFromAlbum: (albumId, songId) => {
                const album = get().getAlbumByID(albumId);

                if (album.songs.includes(songId)) {
                    set((state) => ({
                        albums: state.albums.map((a) =>
                            a.id === albumId
                                ? {
                                      ...a,
                                      songs: a.songs.filter(
                                          (id) => id !== songId
                                      ),
                                  }
                                : a
                        ),
                    }));
                }
            },

            copyAlbumTagsToSongs: (albumId) => {
                const album = get().getAlbumByID(albumId);
                const artwork = album.artwork;
                const artist = album.artist;
                const year = album.year;

                set((state) => ({
                    songs: state.songs.map((song) =>
                        album.songs.includes(song.id)
                            ? { ...song, artwork, artist, year }
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
