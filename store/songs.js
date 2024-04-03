import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";

const MARKED_SONGS_KEY = "MarkedSongs";

export const useSongsStore = create(
    persist(
        (set, get) => ({
            songs: [],
            selectedSong: null,
            playlists: [
                {
                    id: "1",
                    name: "Liked songs",
                    description: "Your songs that you liked.",
                    songs: [],
                },
            ],
            selectedPlaylist: null,

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
        }
    )
);
