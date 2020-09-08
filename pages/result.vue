<template>
  <div class="container mx-auto">
    <div class="flex flex-col items-center">
      <div class="text-5xl text-white font-bold pt-16">Résultats</div>

      <div class="flex pt-8">
        <div class="flex flex-col">
          <div id="players" class="flex space-x-8">
            <div class="flex flex-col items-center space-y-1 text-white"
                 v-for="player in players" :key="player.username">
              <img v-if="isWinner(player.playerIndex)" src="/crown.png" class="h-16 w-16 animate-bounce" alt="crown"/>
              <div v-else class="w-16 h-16"/>
              <Avatar :username="player.username" :avatar="player.avatar" :playerIndex="player.playerIndex"/>
              <span class="text-3xl font-bold">
                {{ getScore(player.playerIndex) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <button class="bg-green-600 mt-4 px-8 py-2 rounded-lg font-semibold text-white"
              @click="goToHome">
        Nouvelle partie
      </button>
    </div>
  </div>
</template>

<script>
import Avatar from '~/components/Avatar';

export default {
  components: { Avatar },
  methods: {
    getScore (playerIndex) {
      return this.$store.getters['room/getPlayers'][playerIndex].score;
    },
    goToHome () {
      this.$router.push({
        path: '/'
      });
    },
    isWinner (playerIndex) {
      let winnerPoint = 0;
      this.$store.getters['room/getPlayers'].forEach(player => {
        if (player.score > winnerPoint) {
          winnerPoint = player.score;
        }
      });
      return this.$store.getters['room/getPlayers'][playerIndex].score === winnerPoint;
    }
  },
  computed: {
    players: {
      get () {
        return this.$store.getters['room/getPlayers'];
      }
    }
  },
  beforeDestroy () {
    this.$off();
  },
  transition (to, from) {
    return 'slide';
  },
};
</script>

<style>
</style>
