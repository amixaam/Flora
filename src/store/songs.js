import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio, InterruptionModeAndroid } from "expo-av";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import TrackPlayer, {
    AppKilledPlaybackBehavior,
    Capability,
    RepeatMode,
} from "react-native-track-player";

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
                    image: null,
                    year: null,
                    artist: null,
                    date: null,
                    songs: [], //contains only id's
                },
            ],

            // for menus, ect..
            selectedSong: null,
            selectedPlaylist: null,
            activeBottomSheet: null, // would be cool maybe?

            // for music playback
            currentTrack: null, //song id
            playlist: [],
            audioRef: null,
            isPlaying: false,
            repeat: false,

            trackDuration: 0,
            trackPosition: 0,

            isSetup: false,
            playbackState: null, // would be nice for me to use this variable as a check in other components to change the ui
            setPlaybackState: (state) => set({ playbackState: state }),

            setup: async () => {
                if (get().isSetup) return console.log("already setup");

                await TrackPlayer.setupPlayer({
                    autoHandleInterruptions: true,
                });
                await TrackPlayer.updateOptions({
                    progressUpdateInterval: 500,
                    android: {
                        appKilledPlaybackBehavior:
                            AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
                    },
                    capabilities: [
                        Capability.Play,
                        Capability.Pause,
                        Capability.SkipToNext,
                        Capability.SkipToPrevious,
                        Capability.SeekTo,
                    ],
                    compactCapabilities: [
                        Capability.Play,
                        Capability.Pause,
                        Capability.SkipToNext,
                    ],
                });
                await TrackPlayer.setRepeatMode(RepeatMode.Off);
                set({ isSetup: true });
            },
            addToQueue: async (song) => {
                await TrackPlayer.add(song);
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
                            image: null,
                            year: null,
                            artist: null,
                            date: null,
                            songs: [], //contains only id's
                        },
                    ],
                });
            },

            // Init & cleanup for playback
            loadTrack: async (song, playlist = null, shuffle = false) => {
                if (!song) return console.log("No song provided.");

                await get().unloadTrack();
                try {
                    Audio.setAudioModeAsync({
                        staysActiveInBackground: true,
                        playsInSilentModeIOS: true,
                        interruptionModeAndroid:
                            InterruptionModeAndroid.DoNotMix,
                    });
                    const { sound } = await Audio.Sound.createAsync(
                        { uri: song.uri },
                        { shouldPlay: true }
                    );

                    sound._onPlaybackStatusUpdate =
                        get().setOnPlaybackStatusUpdate;

                    set({
                        audioRef: sound,
                        currentTrack: song.id,
                        playlist: playlist ? playlist : get().playlist,
                        isPlaying: true,
                        songs: get().songs.map((s) =>
                            s.id === song.id
                                ? {
                                      ...s,
                                      timesPlayed: s.timesPlayed + 1,
                                      lastPlayed: new Date(),
                                  }
                                : s
                        ),
                    });
                    if (shuffle) get().shuffle();
                } catch (error) {
                    console.error("Error loading audio:", error);
                }
            },

            setOnPlaybackStatusUpdate: (playbackStatus) => {
                if (playbackStatus.isLoaded) {
                    set({
                        trackPosition: playbackStatus.positionMillis,
                        trackDuration: playbackStatus.durationMillis,
                    });

                    if (
                        playbackStatus.didJustFinish &&
                        !playbackStatus.isLooping
                    ) {
                        get().next();
                    }
                }
            },

            unloadTrack: async () => {
                const audioRef = get().audioRef;
                if (audioRef) {
                    await audioRef.unloadAsync();
                    set({ audioRef: null, isPlaying: false });
                }
            },

            // Playback & controls
            // play: async () => {
            //     const audioRef = get().audioRef;
            //     if (!audioRef) return;

            //     try {
            //         await audioRef.playAsync();
            //         set({ isPlaying: true });
            //     } catch (error) {
            //         console.error("Error playing audio:", error);
            //     }
            // },
            // pause: async () => {
            //     const audioRef = get().audioRef;
            //     if (!audioRef) return;

            //     try {
            //         await audioRef.pauseAsync();
            //         set({ isPlaying: false });
            //     } catch (error) {
            //         console.error("Error pausing audio:", error);
            //     }
            // },

            // next: async () => {
            //     const audioRef = get().audioRef;
            //     if (!audioRef) return;

            //     const playlist = get().playlist.songs;
            //     const currentTrack = get().currentTrack;

            //     const index = playlist.indexOf(currentTrack);
            //     const nextSongs = playlist.slice(index + 1);
            //     const nextSong = nextSongs.find(
            //         (songId) => !get().getSong(songId).isHidden
            //     );

            //     if (nextSong) {
            //         const nextSongData = get().getSong(nextSong);
            //         await get().loadTrack(nextSongData);
            //     } else {
            //         await get().unloadTrack();
            //     }
            // },

            // previous: async () => {
            //     const audioRef = get().audioRef;
            //     if (!audioRef) return;

            //     const playlist = get().playlist.songs;
            //     const currentTrack = get().currentTrack;
            //     const currentSong = get().getSong(currentTrack);

            //     const index = playlist.indexOf(currentTrack);
            //     const previousSongs = playlist.slice(0, index).reverse();
            //     const previousSong = previousSongs.find(
            //         (songId) => !get().getSong(songId).isHidden
            //     );

            //     if (previousSong) {
            //         const previousSongData = get().getSong(previousSong);
            //         const { positionMillis } = await audioRef.getStatusAsync();
            //         if (positionMillis >= 1000) {
            //             await audioRef.setPositionAsync(0);
            //         } else {
            //             await get().loadTrack(previousSongData);
            //         }
            //     }
            // },

            skipPosition: async (position) => {
                const audioRef = get().audioRef;
                if (!audioRef) return;
                const { durationMillis } = await audioRef.getStatusAsync();
                const newPosition = Math.floor(position * durationMillis);
                await audioRef.setPositionAsync(newPosition);
            },

            shuffle: () => {
                const playlist = get().playlist;

                const currentSongId = get().currentTrack;
                if (playlist.length < 2) return;

                const shuffledSongs = [...playlist.songs];
                const currentSongIndex = shuffledSongs.indexOf(currentSongId);
                shuffledSongs.splice(currentSongIndex, 1);

                for (let i = shuffledSongs.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffledSongs[i], shuffledSongs[j]] = [
                        shuffledSongs[j],
                        shuffledSongs[i],
                    ];
                }
                shuffledSongs.unshift(currentSongId);
                set({ playlist: { ...playlist, songs: shuffledSongs } });
            },

            turnOnRepeat: () => {
                const audioRef = get().audioRef;
                if (!audioRef) return;

                audioRef.setIsLoopingAsync(true);
                set({ repeat: true });
            },

            turnOffRepeat: () => {
                const audioRef = get().audioRef;
                if (!audioRef) return;

                audioRef.setIsLoopingAsync(false);
                set({ repeat: false });
            },

            // songs, selectedSong
            setSongs: (songs) => set({ songs }),
            getSong: (id) => get().songs.find((song) => song.id === id),
            setSelectedSong: (song) => set({ selectedSong: song }),

            inheritPlatlistDataToSongs: (playlistId) => {
                const playlist = get().getPlaylist(playlistId);
                const image = playlist.image;
                const artist = playlist.artist;
                const date = playlist.date;

                set((state) => ({
                    songs: state.songs.map((song) =>
                        playlist.songs.includes(song.id)
                            ? { ...song, image, artist, date }
                            : song
                    ),
                }));
            },

            // deleteSongFromDevice: async (id) => {
            //     set((state) => ({
            //         songs: state.songs.filter((song) => song.id !== id),
            //     }));

            //     const songUri = get().getSong(id).uri;
            //     const playlists = get().playlists;
            //     set({
            //         playlists: playlists.map((playlist) => ({
            //             ...playlist,
            //             songs: playlist.songs.filter((songId) => songId !== id),
            //         })),
            //     });
            //     await FileSystem.deleteAsync(songUri).catch((e) =>
            //         console.log("error deleting song", e)
            //     );
            // },

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

            // playlists
            setPlaylists: (playlists) => set({ playlists }),
            setSelectedPlaylist: (playlist) =>
                set({ selectedPlaylist: playlist }),

            createPlaylist: (name, description, image = null, artist, date) => {
                name = name ? name : "Unnamed playlist";
                const newPlaylist = {
                    id: (
                        Date.now().toString(36) +
                        Math.random().toString(36).substr(2, 5)
                    ).toUpperCase(),
                    name,
                    description,
                    image,
                    artist,
                    date,
                    songs: [],
                };
                set((state) => ({
                    playlists: [...state.playlists, newPlaylist],
                }));
            },

            editPlaylist: (id, name, description, image, artist, date) => {
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
                                  ...(image !== null ? { image } : {}),
                                  ...(artist !== null ? { artist } : {}),
                                  ...date,
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

                return {
                    ...playlist,
                };
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
        }),
        {
            name: MARKED_SONGS_KEY,
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                songs: state.songs,
                playlists: state.playlists,
            }),
        }
    )
);

export const useAudioStore = create(
    persist(
        (set, get) => ({
            songs: [
                {
                    id: 1,
                    uri: null, // file path
                    duration: 0, // in milliseconds

                    name: "song3",
                    image: null, // image path
                    artist: null, // artist name
                    albumId: null, // album id

                    liked: false,
                    hidden: false,
                    statistics: {
                        lastPlayed: new Date(), // date when song was last played
                        timesPlayed: 0,
                        timesSkipped: 0,
                    },
                },
            ],
            playlists: [
                {
                    id: 1,
                    name: "playlist2",
                    description: "Your songs that you liked.",
                    image: null, // image path
                    created_at: new Date(),
                    songs: [], // array of song id's
                },
            ],
            albums: [
                {
                    id: 1,
                    name: "album1",
                    artist: null, // artist name
                    date: new Date(), // date album was created
                },
            ],
            statistics: {
                totalPlaytime: 0, // in seconds
                history: [], // array of song id's
            },

            // for menus, ect..
            selectedSong: null,
            selectedPlaylist: null,

            // for music playback
            currentTrack: null, //song id that is currently playing
            queue: [], // array of song id's
            audioRef: null,
            isPlaying: false,
            onRepeat: false,

            currentTrackDuration: 0,
            currentTrackPosition: 0,
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
