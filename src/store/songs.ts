import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { router } from "expo-router";
import TrackPlayer, { RepeatMode, Track } from "react-native-track-player";
import { Album, History, Playlist, Song } from "../types/song";

const MARKED_SONGS_KEY = "MarkedSongs";

type SongsStore = {
    songs: Song[];
    playlists: Playlist[];
    albums: Album[];
    history: History;
    queue: Track[];

    isReadingSongs: boolean;
    selectedSong: Song | undefined;
    activeSong: Song | undefined;

    selectedContainer: Playlist | Album | undefined;

    setIsReadingSongs: (value: boolean) => void;
    setSelectedSong: (song: Song) => Promise<void>;
    setSelectedContainer: (container: Playlist | Album) => Promise<void>;

    // updateSong: (songId: string) => void;
    updateSelectedAndActiveSong: (songId: string) => void;
    updateSelectedContainer: (containerId: string) => void;

    repeatMode: RepeatMode; // enum

    resetAll: () => void;

    // for music playback
    resetPlayer: () => Promise<void>;
    startup: () => Promise<void>;
    play: () => Promise<void>;
    pause: () => Promise<void>;
    next: () => Promise<void>;
    previous: () => Promise<void>;
    seekToPosition: (position: number) => Promise<void>;

    setRepeatMode: (mode: RepeatMode) => Promise<void>;
    toggleRepeatMode: () => Promise<void>;

    updateActiveSong: (songId: string) => void;
    setActiveSong: () => Promise<void>;

    shuffle: () => void;
    shuffleList: (list: Song[], redirect?: boolean) => Promise<void>;

    // // Queue

    addToQueue: (song: Song | Song[]) => Promise<void>;
    addToQueueFirst: (
        song: Song,
        redirect?: boolean,
        override?: boolean
    ) => Promise<void>;
    addListToQueue: (
        list: Song[],
        selectedSong?: Song,
        redirect?: boolean
    ) => Promise<void>;

    getQueue: () => Promise<Song[]>;
    setQueue: (queue: Song[]) => void;

    // // songs
    setSongs: (songs: Song[]) => void;
    addSongs: (songs: Song[]) => void;
    getSong: (id: string) => Song | undefined;
    removeSongs: (ids: string[]) => void;

    doesSongExist: (id: string) => boolean;
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
    checkForDeletedSongs: () => void;

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
    addAlbums: (
        albumFields: { [key: Album["title"]]: Partial<Album> },
        songIds: { [key: Album["title"]]: Song["id"][] }
    ) => void;
    editAlbum: (id: string, inputFields: Partial<Album>) => void;
    deleteAlbum: (id: string) => void;
    removeEmptyAutoAlbums: () => void;

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
                    artwork: "Liked songs",
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

            queue: [],
            repeatMode: RepeatMode.Off,
            activeSong: undefined,

            isReadingSongs: false,
            // menus
            selectedSong: undefined,
            selectedContainer: undefined,

            setIsReadingSongs: (value) => {
                set({ isReadingSongs: value });
            },

            setSelectedSong: async (song) => {
                set({ selectedSong: song });
            },

            setSelectedContainer: async (container) => {
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
                            artwork: "Liked songs",
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
                    queue: [],
                });
                console.log("reset all!");
            },

            // Music playback ----------------------------------------------------------
            resetPlayer: async () => {
                await TrackPlayer.reset();
                set({ queue: [] });
            },
            startup: async () => {
                set({
                    queue: await TrackPlayer.getQueue(),
                    repeatMode: await TrackPlayer.getRepeatMode(),
                    activeSong: (await TrackPlayer.getActiveTrack()) as Song,
                });
            },

            updateActiveSong: (songId) => {
                const song = get().getSong(songId);
                set({ activeSong: song });
            },

            setActiveSong: async () => {
                const activeTrack =
                    (await TrackPlayer.getActiveTrack()) as Song;
                set({
                    activeSong: activeTrack,
                });
            },

            play: async () => {
                await TrackPlayer.play();
            },
            pause: async () => {
                await TrackPlayer.pause();
            },
            next: async () => {
                get().updateSongSkip(get().activeSong?.id as string);

                await TrackPlayer.skipToNext();

                await get().setActiveSong();
            },
            previous: async () => {
                const playbackProgress = await TrackPlayer.getProgress();

                if (playbackProgress.position >= 3) {
                    return await TrackPlayer.seekTo(0);
                }

                await TrackPlayer.skipToPrevious();
                await get().setActiveSong();
            },
            seekToPosition: async (position) => {
                await TrackPlayer.seekTo(position);
            },
            setRepeatMode: async (mode) => {
                await TrackPlayer.setRepeatMode(mode);
            },

            toggleRepeatMode: async () => {
                const current = await TrackPlayer.getRepeatMode();
                let setRepeat: RepeatMode;

                switch (current) {
                    case RepeatMode.Off:
                        setRepeat = RepeatMode.Track;
                        break;
                    case RepeatMode.Track:
                        setRepeat = RepeatMode.Queue;
                        break;
                    case RepeatMode.Queue:
                        setRepeat = RepeatMode.Off;
                        break;
                    default:
                        setRepeat = RepeatMode.Off;
                        break;
                }
                await TrackPlayer.setRepeatMode(setRepeat);
                set({ repeatMode: setRepeat });
            },

            addToQueue: async (song) => {
                let consciousHistory: string;

                if (Array.isArray(song)) {
                    consciousHistory = song[0].id;
                    await TrackPlayer.add(song);
                } else {
                    consciousHistory = song.id;
                    await TrackPlayer.add([song]);
                }

                get().addSongToConsciousHistory(consciousHistory);
                set({ queue: await TrackPlayer.getQueue() });
            },

            // meant for 1 song at a time + conscious press
            addToQueueFirst: async (
                song,
                redirect = false,
                override = false
            ) => {
                if (!override) {
                    // do nothing if same song playing
                    const current = await TrackPlayer.getActiveTrack();
                    if (song.id === current?.id) {
                        console.log("same song playing! Not adding to queue.");

                        return;
                    }
                }

                await TrackPlayer.load(song);
                await get().setActiveSong();

                get().addSongToConsciousHistory(song.id);
                set({ queue: await TrackPlayer.getQueue() });
                if (redirect) router.push("/overlays/player");
            },

            addListToQueue: async (list, selectedSong, redirect = false) => {
                if (redirect) router.push("/overlays/player");

                let queue: Song[] = list;
                let consciousHistory: Song["id"] =
                    selectedSong?.id ?? list[0].id;

                if (selectedSong) {
                    const selectedSongIndex = list.findIndex(
                        (song) => song.id === selectedSong.id
                    );

                    if (selectedSongIndex > 0) {
                        const songsBefore = list.slice(0, selectedSongIndex);
                        const songsAfter = list.slice(selectedSongIndex);
                        queue = [...songsBefore, ...songsAfter];
                    }
                }

                await TrackPlayer.setQueue(queue);
                await TrackPlayer.play();

                set({ queue: await TrackPlayer.getQueue() });
                get().addSongToConsciousHistory(consciousHistory);
            },

            getQueue: async (): Promise<Song[]> => {
                const queue = await TrackPlayer.getQueue();
                const songs = await Promise.all(
                    queue.map(async (track) => {
                        const song = get().getSong(track.id);
                        if (song === undefined) {
                            console.error(
                                `could not find song with id ${track.id}`
                            );
                            return;
                        }
                        return song;
                    })
                );
                return songs.filter((song) => song !== undefined) as Song[];
            },

            setQueue: async (queue) => {
                await TrackPlayer.setQueue(queue);
                set({ queue: queue });
            },

            shuffle: async () => {
                const queue = await TrackPlayer.getQueue();
                const current = await TrackPlayer.getActiveTrackIndex();
                if (!current) return;

                const futureTracks = queue.slice(current + 1);
                await TrackPlayer.removeUpcomingTracks();
                await TrackPlayer.add(
                    futureTracks.sort(() => Math.random() - 0.5)
                );

                set({ queue: await TrackPlayer.getQueue() });
            },

            shuffleList: async (list, redirect = false) => {
                if (redirect) router.push("/overlays/player");

                const shuffledList = [...list].sort(() => Math.random() - 0.5);
                get().updateActiveSong(shuffledList[0].id);

                await TrackPlayer.setQueue(shuffledList);
                await TrackPlayer.play();

                set({ queue: shuffledList });
                get().addSongToConsciousHistory(shuffledList[0].id);
            },

            // songs ----------------------------------------------------------
            setSongs: (songs) => set({ songs }),
            addSongs: (songs) => {
                set((state) => ({
                    songs: [...state.songs, ...songs],
                }));
            },
            getSong: (id) => get().songs.find((song) => song.id === id),
            removeSongs: (ids) => {
                set((state) => ({
                    songs: state.songs.filter((song) => !ids.includes(song.id)),
                }));

                get().checkForDeletedSongs();
            },

            updateSelectedAndActiveSong: (songId) => {
                const currentlySelected = get().selectedSong;
                const currentlyActive = get().activeSong;

                const updatedSong = get().getSong(songId);

                if (songId === currentlySelected?.id) {
                    set({
                        selectedSong: updatedSong,
                    });
                }

                if (songId === currentlyActive?.id) {
                    set({
                        activeSong: updatedSong,
                    });
                }
            },

            updateSelectedContainer: (containerId) => {
                const selectedContainer = get().selectedContainer;
                if (containerId === selectedContainer?.id) {
                    const updatedContainer = get().getContainer(containerId);
                    set({
                        selectedContainer: {
                            ...selectedContainer,
                            ...updatedContainer,
                        },
                    });
                }
            },

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

                get().updateSelectedAndActiveSong(id);
            },

            unhideSong: (id) => {
                set((state) => ({
                    songs: state.songs.map((song) =>
                        song.id === id ? { ...song, isHidden: false } : song
                    ),
                }));

                get().updateSelectedAndActiveSong(id);
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

                get().updateSelectedAndActiveSong(id);

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

                get().updateSelectedAndActiveSong(id);
            },
            // statistics ---------------------------------------------------------
            addSongToHistory: (id) => {
                const song = get().getSong(id);
                if (song === undefined) return;

                const history = get().history.history;

                const index = history.findIndex((item) => item.song === id);
                if (index !== -1) {
                    history.splice(index, 1);
                }

                history.unshift({
                    song: id,
                    date: new Date(),
                    containerId: song.albumIds[0],
                });

                set((state) => ({
                    history: {
                        ...state.history,
                        history: history,
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

            checkForDeletedSongs: () => {
                const songIds = get().songs.map((song) => song.id);
                // checks songs array for albums and playlists for songs that no longer exist
                set((state) => ({
                    albums: state.albums.map((album) => ({
                        ...album,
                        songs: album.songs.filter((id) => songIds.includes(id)),
                    })),
                    playlists: state.playlists.map((playlist) => ({
                        ...playlist,
                        songs: playlist.songs.filter((id) =>
                            songIds.includes(id)
                        ),
                    })),
                }));

                get().removeEmptyAutoAlbums();
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
                    lastModified: new Date().toString(),
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
                                  lastModified: new Date().toString(),
                              }
                            : playlist
                    ),
                }));

                get().updateSelectedContainer(id);
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
                set((state) => ({
                    playlists: state.playlists.map((playlist) =>
                        playlist.id === playlistId
                            ? {
                                  ...playlist,
                                  // Check if song already exists before adding
                                  songs: playlist.songs.includes(songId)
                                      ? playlist.songs
                                      : [...playlist.songs, songId],
                              }
                            : playlist
                    ),
                    // Update isLiked if default playlist
                    songs:
                        playlistId === "1"
                            ? state.songs.map((song) =>
                                  song.id === songId
                                      ? { ...song, isLiked: true }
                                      : song
                              )
                            : state.songs,
                }));

                get().updateSelectedContainer(playlistId);
                get().updateSelectedAndActiveSong(songId);
            },

            removeSongFromPlaylist: (playlistId, songId) => {
                set((state) => ({
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
                    // Update isLiked if default playlist
                    songs:
                        playlistId === "1"
                            ? state.songs.map((song) =>
                                  song.id === songId
                                      ? { ...song, isLiked: false }
                                      : song
                              )
                            : state.songs,
                }));

                get().updateSelectedContainer(playlistId);
                get().updateSelectedAndActiveSong(songId);
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
                    autoCreated: false,
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
                    lastModified: new Date().toString(),
                    createdAt: new Date().toString(),
                };

                set((state) => ({
                    albums: [...state.albums, newAlbum],
                }));

                return id;
            },

            addAlbums: (albumFields, songIds) => {
                set((state) => {
                    const newAlbums = Object.entries(albumFields).map(
                        ([title, albumData]) => {
                            const songList = songIds[title] || [];

                            return {
                                id: albumData.id,
                                title: title,
                                artist: albumData.artist || "No artist",
                                artwork: albumData.artwork || undefined,
                                year: albumData.year || "No year",
                                songs: songList,
                                lastModified: new Date().toString(),
                                createdAt: new Date().toString(),
                            } as Album;
                        }
                    );

                    return {
                        albums: [...state.albums, ...newAlbums],
                    };
                });
            },

            editAlbum: (id, inputFields) => {
                set((state) => ({
                    albums: state.albums.map((album) =>
                        album.id === id
                            ? {
                                  ...album,
                                  ...inputFields,
                                  lastModified: new Date().toString(),
                              }
                            : album
                    ),
                }));

                get().updateSongTagsByAlbum(id);
                get().updateSelectedContainer(id);
            },

            deleteAlbum: (id) => {
                set((state) => ({
                    albums: state.albums.filter((a) => a.id !== id),
                }));
            },

            removeEmptyAutoAlbums: () => {
                set((state) => ({
                    // remove albums that has an empty songs array and has autoCreated to True
                    albums: state.albums.filter(
                        (album) => album.songs.length > 0 && !album.autoCreated
                    ),
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
                get().updateSelectedContainer(albumId);
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

                get().updateSelectedContainer(albumId);
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
                                  //   artist: relatedAlbum.artist,
                                  //   year: relatedAlbum.year,
                                  artwork: relatedAlbum.artwork,
                              }
                            : s
                    ),
                }));

                get().updateSelectedAndActiveSong(songId);
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
