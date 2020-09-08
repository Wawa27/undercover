import Vue from 'vue';

export const state = () => ({
  players: [],
  playerTurn: undefined,
  playerIndex: undefined,

  startGuessWord: undefined,
  guessWord: undefined,

  normalWord: undefined,
  undercoverWord: undefined,

  undercovers: [],
  misterWhite: undefined
});

export const getters = {
  getUsername: state => index => state.players[index !== undefined ? index : state.playerIndex] ? state.players[index !== undefined ? index : state.playerIndex].username : 'Player',
  getAvatar: state => index => state.players[index !== undefined ? index : state.playerIndex] ? state.players[index !== undefined ? index : state.playerIndex].avatar : 'man.png',
  getHints: state => index => state.players[index !== undefined ? index : state.playerIndex].hints,
  getGuess: state => index => state.players[index !== undefined ? index : state.playerIndex].guess,
  getMisterWhiteGuess: state => index => state.players[index !== undefined ? index : state.playerIndex].misterWhiteGuess,
  getWord: state => index => state.players[index !== undefined ? index : state.playerIndex].word,
  hasConfirmedGuess: state => index => state.players[index !== undefined ? index : state.playerIndex].hasConfirmedGuess,
  getPlayerIndex: state => state.playerIndex,
  getUndercovers: state => state.undercovers,
  getMisterWhite: state => state.misterWhite,
  startGuessWord: state => state.startGuessWord,
  getGuessWord: state => state.guessWord,
  isPlayerTurn (state) {
    return state.playerTurn === state.playerIndex;
  },
  getScore (state) {
    return state.players[state.playerIndex].score;
  },
  getPlayers (state) {
    return state.players;
  },
  getPlayerTurn (state) {
    return state.getPlayerTurn;
  },
  getNormalWord (state) {
    return state.normalWord;
  },
  getUndercoverWord (state) {
    return state.undercoverWord;
  }
};

export const mutations = {
  setUsername: (state, { username, playerIndex }) => state.players[playerIndex !== undefined ? playerIndex : state.playerIndex].username = username,
  setAvatar: (state, { avatar, playerIndex }) => state.players[playerIndex !== undefined ? playerIndex : state.playerIndex].avatar = avatar,
  startGame: state => {
    state.players.forEach(player => {
      player.score = 0;
    });
  },
  startRound: state => {
    state.normalWord = undefined;
    state.undercoverWord = undefined;
    state.undercovers = [];
    state.misterWhite = undefined;
    state.players.forEach(player => {
      player.hints = [];
      player.guess = undefined;
      player.misterWhiteGuess = undefined;
      player.word = undefined;
      player.hasConfirmedGuess = false;
    });
  },
  addPlayer (state, player) {
    state.players = [...state.players, {
      ...player,
      guess: undefined,
      misterWhiteGuess: undefined,
      hasConfirmedGuess: false,
      reason: undefined
    }];
  },
  onDisconnect (state, playerIndex) {
    if (playerIndex === state.players.length - 1) {
      state.players.splice(playerIndex, 1);
    } else {
      const lastPlayerIndex = state.players.length - 1;
      state.players[playerIndex] = state.players[lastPlayerIndex];
      state.players[playerIndex].playerIndex = playerIndex;
      state.players.splice(lastPlayerIndex, 1);

      if (state.playerIndex > playerIndex) {
        state.playerIndex--;
      }
    }
  },
  setWord: (state, word) => state.players[state.playerIndex].word = word,
  removePlayer (state, player) {
    state.players[player.playerIndex] = undefined;
  },
  setGuess (state, { target, guesser }) {
    state.players[guesser !== undefined ? guesser : state.playerIndex].guess = target;
  },
  setMisterWhiteGuess (state, { target, guesser }) {
    state.players[guesser !== undefined ? guesser : state.playerIndex].misterWhiteGuess = target;
  },
  addHint (state, { hint, playerIndex }) {
    state.players[playerIndex !== undefined ? playerIndex : state.playerIndex].hints.push(hint);
  },
  setPlayerIndex (state, playerIndex) {
    state.playerIndex = playerIndex;
  },
  setPlayerTurn (state, playerIndex) {
    state.playerTurn = playerIndex;
  },
  setNormalWord (state, word) {
    state.normalWord = word;
  },
  setUndercoverWord (state, word) {
    state.undercoverWord = word;
  },
  setMisterWhite (state, playerIndex) {
    state.misterWhite = playerIndex;
  },
  setHasConfirmedGuess (state, playerIndex) {
    state.players[playerIndex !== undefined ? playerIndex : state.playerIndex].hasConfirmedGuess = true;
  },
  addScore (state, { score, reason, playerIndex }) {
    state.players[playerIndex !== undefined ? playerIndex : state.playerIndex].score += score;
    state.players[playerIndex !== undefined ? playerIndex : state.playerIndex].reason = reason;
  },
  clearReason (state, playerIndex) {
    state.players[playerIndex !== undefined ? playerIndex : state.playerIndex].reason = undefined;
  },
  startScoreboard (state, { normalWord, undercoverWord, undercovers, misterWhite }) {
    state.normalWord = normalWord;
    state.undercoverWord = undercoverWord;
    state.undercovers = undercovers;
    state.misterWhite = misterWhite;
  },
  startGuessWord (state) {
    state.startGuessWord = true;
  },
  stopGuessWord (state) {
    state.startGuessWord = false;
  },
  setGuessWord (state, guessWord) {
    state.guessWord = guessWord;
  }
};
