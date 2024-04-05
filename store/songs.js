import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import { Audio } from "expo-av";
import { useEffect } from "react";

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
                    songs: [], //contains only id's
                },
            ],
            // for menus, ect..
            selectedSong: null,
            selectedPlaylist: null,

            // for music playback
            currentTrack: [],
            isPlaying: false,
            playlist: [],
            audioRef: null,
            repeat: false,

            trackDuration: 0,
            trackPosition: 0,

            resetAll: () => {
                set({
                    songs: [], //full data (such as the uri)
                    playlists: [
                        {
                            id: "1",
                            name: "Liked songs",
                            description: "Your songs that you liked.",
                            image: null,
                            songs: [], //contains only id's
                        },
                    ],
                });
            },

            // Init & cleanup for playback
            loadTrack: async (song, playlist = null) => {
                await get().unloadTrack();
                try {
                    const { sound } = await Audio.Sound.createAsync(
                        { uri: song.uri },
                        { shouldPlay: true }
                    );

                    sound._onPlaybackStatusUpdate =
                        get().setOnPlaybackStatusUpdate;

                    set({
                        audioRef: sound,
                        currentTrack: song,
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
            play: async () => {
                const audioRef = get().audioRef;
                if (!audioRef) return;

                try {
                    await audioRef.playAsync();
                    set({ isPlaying: true });
                } catch (error) {
                    console.error("Error playing audio:", error);
                }
            },
            pause: async () => {
                const audioRef = get().audioRef;
                if (!audioRef) return;

                try {
                    await audioRef.pauseAsync();
                    set({ isPlaying: false });
                } catch (error) {
                    console.error("Error pausing audio:", error);
                }
            },

            next: async () => {
                const audioRef = get().audioRef;
                if (!audioRef) return;

                const playlist = get().playlist.songs;
                const currentTrack = get().currentTrack.id;

                const index = playlist.indexOf(currentTrack);
                const nextSongId = playlist[index + 1];

                if (nextSongId) {
                    const nextSong = get().getSong(nextSongId);
                    if (nextSong) {
                        await get().loadTrack(nextSong);
                    } else {
                        console.error(
                            "Next song not found in song data: ",
                            nextSongId
                        );
                    }
                } else {
                    await get().unloadTrack();
                }
            },

            previous: async () => {
                const audioRef = get().audioRef;
                if (!audioRef) return;

                if (get().positionMillis > 2000) {
                    await audioRef.replayAsync();
                }
                const playlist = get().playlist.songs;
                const currentTrack = get().currentTrack.id;

                const index = playlist.indexOf(currentTrack);
                const previousSongId = playlist[index - 1];

                if (previousSongId) {
                    const previousSong = get().getSong(previousSongId);
                    if (previousSong) {
                        await get().loadTrack(previousSong);
                    } else {
                        console.error(
                            "Previous song not found in song data: ",
                            previousSongId
                        );
                    }
                }
            },

            skipPosition: async (position) => {
                const audioRef = get().audioRef;
                if (!audioRef) return;
                const { durationMillis } = await audioRef.getStatusAsync();
                const newPosition = Math.floor(position * durationMillis);
                await audioRef.setPositionAsync(newPosition);
            },

            shuffle: () => {
                const playlists = get().playlists;
                if (playlists.length < 2) return;

                const shuffledPlaylists = [...playlists].sort(
                    () => 0.5 - Math.random()
                );
                set({ playlists: shuffledPlaylists });
            },

            turnOnRepeat: () => {
                const audioRef = get().audioRef;
                if (!audioRef) return;
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

            // playlists
            setPlaylists: (playlists) => set({ playlists }),
            setSelectedPlaylist: (playlist) =>
                set({ selectedPlaylist: playlist }),

            createPlaylist: (name, description) => {
                const newPlaylist = {
                    id: (
                        Date.now().toString(36) +
                        Math.random().toString(36).substr(2, 5)
                    ).toUpperCase(),
                    name,
                    description,
                    songs: [],
                };
                set((state) => ({
                    playlists: [...state.playlists, newPlaylist],
                }));
            },

            editPlaylist: (id, name, description, image) => {
                set((state) => ({
                    playlists: state.playlists.map((playlist) =>
                        playlist.id === id
                            ? {
                                  ...playlist,
                                  ...(name !== "" ? { name } : {}),
                                  ...(description !== ""
                                      ? { description }
                                      : {}),
                                  ...(image !== null ? { image } : {}),
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

                const songs = playlist.songs.map((songId) =>
                    get().songs.find((s) => s.id === songId)
                );

                return {
                    ...playlist,
                    songs,
                };
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
