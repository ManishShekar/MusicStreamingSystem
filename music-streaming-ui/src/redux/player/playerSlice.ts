import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Song } from "@/types";

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
}

const initialState: PlayerState = {
  currentSong: null,
  isPlaying: false,
  queue: [],
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    // Playing a song is a UI-only toggle in this assignment — no real audio.
    playSong: (
      state,
      action: PayloadAction<{ song: Song; queue?: Song[] }>
    ) => {
      state.currentSong = action.payload.song;
      state.queue = action.payload.queue ?? [action.payload.song];
      state.isPlaying = true;
    },
    togglePlayPause: (state) => {
      if (state.currentSong) {
        state.isPlaying = !state.isPlaying;
      }
    },
    playNext: (state) => {
      if (!state.currentSong || state.queue.length === 0) return;
      const currentIndex = state.queue.findIndex(
        (s) => s.songId === state.currentSong!.songId
      );
      const nextIndex = (currentIndex + 1) % state.queue.length;
      state.currentSong = state.queue[nextIndex];
      state.isPlaying = true;
    },
    playPrevious: (state) => {
      if (!state.currentSong || state.queue.length === 0) return;
      const currentIndex = state.queue.findIndex(
        (s) => s.songId === state.currentSong!.songId
      );
      const prevIndex =
        (currentIndex - 1 + state.queue.length) % state.queue.length;
      state.currentSong = state.queue[prevIndex];
      state.isPlaying = true;
    },
    clearPlayer: (state) => {
      state.currentSong = null;
      state.isPlaying = false;
      state.queue = [];
    },
  },
});

export const {
  playSong,
  togglePlayPause,
  playNext,
  playPrevious,
  clearPlayer,
} = playerSlice.actions;
export default playerSlice.reducer;
