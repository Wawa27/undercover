<template>
  <div class="container mx-auto">
    <div class="flex flex-col items-center">
      <span class="text-5xl text-white font-bold pt-16">Trouvez l'Undercover</span>

      <div class="flex pt-8">
        <div class="flex flex-col">
          <div id="players" class="flex space-x-16">
            <div class="flex flex-col items-center text-white w-48"
                 v-for="target in players" :key="target.username">
              <div class="grid col-span-4 text-center font-bold">
                <span v-for="hint in target.hints">{{ hint }}</span>
              </div>
              <Avatar :username="target.username" :avatar="target.avatar" :playerIndex="target.playerIndex"/>
              <div class="grid col-span-5 space-y-1 mt-4 content-center">
                <div v-for="guesser in players" :key="guesser.index">
                  <div class="w-12 h-12 rounded flex justify-center items-center mx-auto"
                       :class="[isGuessedByPlayer(target.playerIndex, guesser.playerIndex) && hasConfirmedGuess(guesser.playerIndex) ? 'bg-green-600' : 'bg-red-600']">
                    <img v-if="isGuessedByPlayer(target.playerIndex, guesser.playerIndex)"
                         class="w-12 h-12 self-center zoom-in"
                         :src="getAvatar(guesser.playerIndex)" alt="avatar">
                  </div>
                </div>
              </div>

              <button v-if="target.playerIndex !== playerIndex && currentGuess !== target.playerIndex && !validated"
                      class="bg-pink-600 mt-4 px-8 py-2 rounded-lg font-semibold h-10 w-48"
                      @click="setGuess(target.playerIndex)">
                Undercover?
              </button>
              <div v-else-if="currentGuess === target.playerIndex && !validated"
                   class="bg-pink-600 mt-4 rounded-lg font-semibold h-10 w-10"/>
              <div v-else class="h-10 w-48"/>

              <button
                v-if="target.playerIndex !== playerIndex && currentMisterWhiteGuess !== target.playerIndex && !validated && misterWhite"
                class="bg-gray-800 mt-4 px-8 py-2 rounded-lg font-semibold h-10 w-48"
                @click="setMisterWhiteGuess(target.playerIndex)">
                Mister White?
              </button>
              <div v-else-if="currentMisterWhiteGuess === target.playerIndex && !validated"
                   class="bg-gray-800 mt-4 rounded-lg font-semibold h-10 w-10"/>
            </div>
          </div>
        </div>
      </div>
      <button class="bg-green-600 mt-4 px-8 py-2 rounded-lg font-semibold text-white"
              @click="validate" v-if="!this.validated && currentGuess !== undefined && misterWhiteGuess">Valider
      </button>
    </div>

    <div v-if="startGuessWord"
         class="flex items-center justify-center fixed left-0 bottom-0 w-full h-full bg-transparent bg-gray-600 bg-opacity-75">
      <div class="bg-white rounded-lg w-1/4">
        <div class="flex flex-col items-start p-4">
          <hr>
          <div class="relative text-gray-600">
            <label>
              <input v-model="guessWord" type="text" size="59" placeholder="Devinez le mot"
                     class="bg-gray-200 h-10 px-5 pr-10 rounded-full text-sm focus:outline-none">
            </label>
          </div>
          <div class="mx-auto pt-2">
            <button
              @click="setGuessWord"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Deviner
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from '~/components/Avatar';

export default {
  components: { Avatar },
  mounted () {
    this.socket = this.$nuxtSocket({ persist: 'main', teardown: false, reconnection: false });
  },
  methods: {
    isGuessedByPlayer (targetPlayerIndex, guesserPlayerIndex) {
      if (targetPlayerIndex === undefined || guesserPlayerIndex === undefined) return false;
      return targetPlayerIndex === this.$store.getters['room/getPlayers'][guesserPlayerIndex].guess;
    },
    setGuess (playerIndex) {
      this.$store.commit('room/setGuess', { target: playerIndex });
      this.socket.emit('setGuess', playerIndex);
    },
    setMisterWhiteGuess (playerIndex) {
      this.$store.commit('room/setMisterWhiteGuess', { target: playerIndex });
      this.socket.emit('setMisterWhiteGuess', playerIndex);
    },
    validate () {
      this.socket.emit('setHasConfirmedGuess');
      this.$store.commit('room/setHasConfirmedGuess');
    },
    getAvatar (playerIndex) {
      return this.$store.getters['room/getAvatar'](playerIndex);
    },
    hasConfirmedGuess (playerIndex) {
      return this.$store.getters['room/hasConfirmedGuess'](playerIndex);
    },
    setGuessWord () {
      this.socket.emit('setGuessWord', this.guessWord);
      this.$store.commit('room/stopGuessWord');
    }
  },
  computed: {
    validated: {
      get () {
        return this.$store.getters['room/hasConfirmedGuess']();
      }
    },
    currentGuess () {
      return this.$store.getters['room/getGuess']();
    },
    currentMisterWhiteGuess () {
      return this.$store.getters['room/getMisterWhiteGuess']();
    },
    players: {
      get () {
        return this.$store.getters['room/getPlayers'];
      }
    },
    playerIndex () {
      return this.$store.getters['room/getPlayerIndex'];
    },
    startGuessWord () {
      return this.$store.getters['room/startGuessWord'];
    },
    guessWord: {
      get () {
        return this.$store.getters['room/getGuessWord'];
      },
      set (guessWord) {
        this.$store.commit('room/setGuessWord', guessWord);
      }
    },
    misterWhiteGuess: {
      get () {
        return !this.$store.getters['settings/getMisterWhite'] || this.$store.getters['room/getMisterWhiteGuess'];
      }
    },
    misterWhite: {
      get () {
        return this.$store.getters['settings/getMisterWhite'];
      }
    }
  },
  transition (to, from) {
    return 'slide';
  },
  beforeDestroy () {
    this.$off();
  }
};
</script>

<style>
.zoom-in {
  animation: .3s ease-out zoom-in;
}

@keyframes zoom-in {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
</style>
