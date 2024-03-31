import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";

const MARKED_SONGS_KEY = "MarkedSongs";

export const useSongsStore = create(
    persist(
        (set) => ({
            songs: [],
            playlists: [],

            setSongs: (songs) => set({ songs }),
            setPlaylists: (playlists) => set({ playlists }),
            createPlaylist: (name) => {
                const newPlaylist = {
                    id: (
                        Date.now().toString(36) +
                        Math.random().toString(36).substr(2, 5)
                    ).toUpperCase(), // Generate a random playlist ID in base 36
                    name,
                    songs: [],
                };
                set((state) => ({
                    playlists: [...state.playlists, newPlaylist],
                }));
            },

            addSongToPlaylist: (playlistId, songId) => {
                const playlists = [...state.playlists];
                const playlistIndex = playlists.findIndex(
                    (p) => p.id === playlistId
                );
                playlists[playlistIndex].songs.push(songId);
                set({ playlists });
            },

            removeSongFromPlaylist: (playlistId, songId) => {
                const playlists = [...state.playlists];
                const playlistIndex = playlists.findIndex(
                    (p) => p.id === playlistId
                );
                playlists[playlistIndex].songs = playlists[
                    playlistIndex
                ].songs.filter((s) => s !== songId);
                set({ playlists });
            },
            setLikeSong: (id) => {
                set((state) => ({
                    songs: state.songs.map((song) =>
                        song.id === id ? { ...song, isLiked: true } : song
                    ),
                }));
            },
            setUnlikeSong: (id) => {
                set((state) => ({
                    songs: state.songs.map((song) =>
                        song.id === id ? { ...song, isLiked: false } : song
                    ),
                }));
            },
        }),
        {
            name: MARKED_SONGS_KEY,
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
