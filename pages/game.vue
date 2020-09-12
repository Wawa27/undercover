<template>
  <div class="container mx-auto">
    <div class="flex flex-col items-center">
      <span class="text-5xl text-white font-bold pt-16">Votre mot est: </span> <span
      class="text-5xl text-white font-bold">{{ word }}</span>

      <div class="flex pt-16">
        <div class="flex flex-col">
          <div id="players" class="flex">
            <div class="flex flex-col items-center px-2"
                 v-for="player in players" :key="player.username">
              <div class="w-16 h-16" v-if="isPlayerTurn(player.playerIndex)">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-down animate-bounce" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z"/>
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="18" y1="13" x2="12" y2="19" />
                  <line x1="6" y1="13" x2="12" y2="19" />
                </svg>
              </div>
              <div v-else class="w-16 h-16"/>
              <Avatar :username="player.username" :avatar="player.avatar" :playerIndex="player.playerIndex"/>
              <div class="grid grid-cols-1 col-span-4 space-y-4 text-white text-center h-64 content-start">
                <span class="text-3xl font-semibold fade-in" v-for="hint in player.hints">
                  {{ hint }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <label class="flex flex-col" v-if="isPlayerTurn(undefined)">
        <input type="text" size="14" maxlength="16" v-model="hint" class="text-black" placeholder=""/>
        <Button :text="'Valider'" :color="'bg-green-600'" @click="addHint"/>
      </label>
    </div>
  </div>
</template>

<script>
import Avatar from '~/components/Avatar';
import Button from '../components/Button';

export default {
  components: { Button, Avatar },
  mounted () {
    this.socket = this.$nuxtSocket({ persist: 'main', teardown: false, reconnection: false });
  },
  data () {
    return {
      hint: undefined
    };
  },
  methods: {
    async addHint () {
      // TODO: check if not empty hint
      this.socket.emit('addHint', this.hint);
      this.$store.commit('room/addHint', { hint: this.hint });
      this.$store.commit('room/setPlayerTurn', undefined);
    },
    isPlayerTurn (playerIndex) {
      return this.$store.getters['room/isPlayerTurn'](playerIndex);
    }
  },
  computed: {
    word: {
      get () {
        return this.$store.getters['room/getWord']();
      }
    },
    players: {
      get () {
        return this.$store.getters['room/getPlayers'];
      }
    },
    playerIndex () {
      return this.$store.getters['room/getPlayerIndex'];
    }
  },
  transition (to,   from) {
    return 'slide';
  },
  beforeDestroy () {
    this.$off();
  }
};
</script>

<style>
  .fade-in {
    animation: .3s ease-out fade-in;
  }

  @keyframes fade-in {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0px);
      opacity: 1;
    }
  }
</style>
