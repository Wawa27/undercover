<template>
  <div class="container mx-auto h-screen">
    <div class="flex flex-col items-center justify-around h-full">
      <div class="flex flex-col items-center">
        <div class="text-4xl text-white font-bold pt-16">
          Le mot était :
          <span class="text-green-600">
          {{ normalWord }}
        </span>
        </div>
        <div class="text-4xl text-white font-bold">
          Le mot d'undercover était :
          <span class="text-red-600">
          {{ undercoverWord }}
        </span>
        </div>

        <div class="text-4xl text-white font-bold">
          Undercovers :
          <span class="text-red-600" v-for="undercover of undercovers">
          {{ $store.getters['room/getUsername'](undercover) }}
        </span>
        </div>
        <div v-if="misterWhite" class="text-4xl text-white font-bold">
          Misterwhite :
          <span class="text-red-600">{{ misterWhite.username }}</span>
          ({{guessWord}})
        </div>

        <div class="flex pt-8 space-x-16">
          <div class="flex flex-col">
            <div id="players" class="flex space-x-8">
              <div class="flex flex-col items-center space-y-1 text-white"
                   v-for="player in players" :key="player.username">
                <div class="grid col-span-4 text-center font-bold">
                  <span v-for="hint in player.hints">{{ hint }}</span>
                </div>
                <Avatar :username="player.username" :avatar="player.avatar" :playerIndex="player.playerIndex"/>
                <div class="flex flex-col items-center relative">
                  <span class="text-3xl font-bold">
                    {{ getScore(player.playerIndex) }}
                  </span>
                  <transition
                    appear
                    name="fade" @after-enter="clearReason(player.playerIndex)">
                    <span v-if="player.reason" class="text-xl font-bold absolute pt-16 whitespace-no-wrap">
                      {{ player.reason }}
                    </span>
                  </transition>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col">
        <button class="bg-green-600 w-64 mt-4 px-8 py-2 rounded-lg font-semibold text-white"
                @click="startRound">
          Nouvelle manche
        </button>

        <button class="bg-red-600 w-64 mt-4 px-8 py-2 rounded-lg font-semibold text-white"
                @click="stopGame">
          Fin de partie
        </button>
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
    getScore (playerIndex) {
      return this.$store.getters['room/getPlayers'][playerIndex].score;
    },
    startRound () {
      this.socket.emit('startRound');
    },
    stopGame () {
      this.socket.emit('stopGame');
    },
    clearReason (playerIndex) {
      this.$store.commit('room/clearReason', playerIndex);
    }
  },
  computed: {
    players: {
      get () {
        return this.$store.getters['room/getPlayers'];
      }
    },
    normalWord: {
      get () {
        return this.$store.getters['room/getNormalWord'];
      }
    },
    undercoverWord: {
      get () {
        return this.$store.getters['room/getUndercoverWord'];
      }
    },
    undercovers: {
      get () {
        return this.$store.getters['room/getUndercovers'];
      }
    },
    misterWhite: {
      get () {
        return this.$store.getters['room/getPlayers'][this.$store.getters['room/getMisterWhite']];
      }
    },
    guessWord: {
      get () {
        return this.$store.getters['room/getGuessWord'];
      }
    }
  },
  beforeDestroy () {
    this.$off();
  },
  transition (to, from) {
    return 'slide';
  }
};
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
{
  opacity: 0;
}
</style>
