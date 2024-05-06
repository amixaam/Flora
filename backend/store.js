import { create } from "zustand";

export const useAudioStore = create((set, get) => ({
    songs: [],
    albums: [],
}));

export const useAudioStore1 = create(
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
                    image: null, // image path
                    year: null,
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
