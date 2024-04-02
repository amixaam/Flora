import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";

const MARKED_SONGS_KEY = "MarkedSongs";

export const useSongsStore = create(
    persist(
        (set, get) => ({
            songs: [],
            playlists: [
                {
                    id: "1",
                    name: "Liked songs",
                    songs: [],
                },
            ],

            setSongs: (songs) => set({ songs }),
            setPlaylists: (playlists) => set({ playlists }),
            createPlaylist: (name) => {
                const newPlaylist = {
                    id: (
                        Date.now().toString(36) +
                        Math.random().toString(36).substr(2, 5)
                    ).toUpperCase(),
                    name,
                    songs: [],
                };
                set((state) => ({
                    playlists: [...state.playlists, newPlaylist],
                }));
            },
            getPlaylist: (id) => {
                const playlists = get().playlists;
                const playlist = playlists.find((p) => p.id === id);
                if (!playlist) return null;

                const songs = playlist.songs.map((songId) =>
                    get().songs.find((s) => s.id === songId)
                );

                return {
                    ...playlist,
                    songs,
                };
            },
            getSong: (id) => get().songs.find((song) => song.id === id),

            addSongToPlaylist: (playlistId, songId) => {
                const playlists = [...get().playlists];

                const playlistIndex = playlists.findIndex(
                    (p) => p.id === playlistId
                );
                playlists[playlistIndex].songs.push(songId);
                set({ playlists });
            },

            removeSongFromPlaylist: (playlistId, songId) => {
                const playlists = [...get().playlists];
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
                get().addSongToPlaylist("1", id);
            },
            setUnlikeSong: (id) => {
                set((state) => ({
                    songs: state.songs.map((song) =>
                        song.id === id ? { ...song, isLiked: false } : song
                    ),
                }));
                get().removeSongFromPlaylist("1", id);
            },
        }),
        {
            name: MARKED_SONGS_KEY,
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
