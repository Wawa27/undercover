export const state = () => ({
  undercoverCount: undefined,
  misterWhite: undefined,
  wordPerRoundCount: undefined,
  roundPerGameCount: undefined,
  roomID: undefined,
  roomBaseURL: undefined,
  version: process.env.version
});

export const getters = {
  getUndercoverCount (state) { return state.undercoverCount; },
  getMisterWhite (state) { return state.misterWhite; },
  getWordPerRoundCount (state) { return state.wordPerRoundCount; },
  getRoundPerGameCount (state) { return state.roundPerGameCount; },
  getRoomID (state) { return state.roomID; },
  getRoomURL (state) { return `${state.roomBaseURL}?room=${state.roomID}`; },
  getVersion (state) { return state.version; }
};

export const mutations = {
  setUndercoverCount (state, undercoverCount) {
    state.undercoverCount = undercoverCount;
  },
  setMisterWhite (state, misterWhite) {
    state.misterWhite = misterWhite;
  },
  setWordPerRoundCount (state, wordPerRoundCount) {
    state.wordPerRoundCount = wordPerRoundCount;
  },
  setRoundPerGameCount (state, roundPerGameCount) {
    state.roundPerGameCount = roundPerGameCount;
  },
  setSettings (state, payload) {
    state.undercoverCount = payload.undercoverCount;
    state.misterWhite = payload.misterWhite;
    state.wordPerRoundCount = payload.wordPerRoundCount;
    state.roundPerGameCount = payload.roundPerGameCount;
    state.roomID = payload.roomID;
  },
  setRoomBaseURL (state, roomBaseURL) {
    state.roomBaseURL = roomBaseURL;
  },
  setVersion (state, version) {
    state.version = version;
  }
};
