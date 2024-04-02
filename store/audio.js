import { create } from "zustand";

const useAudioStore = create((set) => ({
    currentSong: [], //metadata
    currentSongObject: null, //soundObject
    isPlaying: false, //paused/playing
    nextSong: [], //metadata
    setSong: (song, soundObject) =>
        set({ currentSong: song, currentSongObject: soundObject }),
    toggleIsPlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),
    setNextSong: (nextSong) => set({ nextSong }),
}));

export default useAudioStore;
