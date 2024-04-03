import { create } from "zustand";

const useAudioStore = create((set) => ({
    playingSongData: [], //metadata
    playingSongObject: null, //soundObject
    isPlaying: false, //paused/playing
    playlingPlaylist: [], //metadata
    toggleIsPlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),
    setupMusic: async (song, playlist) => {
        const { Sound } = await require("expo-av").Audio.Sound.createAsync(
            song.path
        );
        set(() => ({
            playingSongObject: Sound,
            playingSongData: song,
            playlingPlaylist: playlist,
            isPlaying: true,
        }));
    },

}));

export default useAudioStore;
