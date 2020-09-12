<template>
  <div class="container mx-auto">
    <div class="flex flex-col items-center">
      <span class="text-6xl text-white font-bold pt-16">Undercover<span class="text-xl">({{ version }})</span></span>

      <div class="flex pt-4 w-full justify-around">
        <div class="flex flex-col justify-center">
          <div id="customize" class="flex flex-col items-center">
            <div class="flex items-center justify-center">
              <a href="#" @click="previousAvatar">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-narrow-left"
                     width="44"
                     height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none"
                     stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <line x1="5" y1="12" x2="9" y2="16"/>
                  <line x1="5" y1="12" x2="9" y2="8"/>
                </svg>
              </a>
              <div>
                <img class="h-32 w-32" :src="avatar" alt="avatar"/>
              </div>
              <a href="#" @click="nextAvatar">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-narrow-right"
                     width="44"
                     height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none"
                     stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <line x1="15" y1="16" x2="19" y2="12"/>
                  <line x1="15" y1="8" x2="19" y2="12"/>
                </svg>
              </a>
            </div>
            <label>
              <input type="text" v-model="username"/>
            </label>
          </div>
        </div>

        <div class="flex flex-col space-y-2 border-2 border-white px-8 py-4 rounded-lg" id="settings">
          <span class="text-4xl text-white font-semibold"> Parametres de la partie </span>
          <label>
            <span class="text-white"> Nombre d'undercover </span>
            <input type="number" v-model.number="undercoverCount">
          </label>
          <label>
            <span class="text-white"> Mister white ? </span>
            <input type="checkbox" v-model="misterWhite">
          </label>
          <label>
            <span class="text-white"> Mot par tour </span>
            <input type="number" v-model.number="wordPerRoundCount">
          </label>
          <label>
            <span class="text-white"> Nombre de round</span>
            <input type="number" disabled v-model.number="roundPerGameCount">
          </label>
        </div>
      </div>

      <span class="text-white text-5xl font-bold mt-8">Lobby<span class="text-xl">(max 6)</span></span>
      <div id="players" class="grid grid-cols-6 items-center w-full space-x-2 mt-4">
        <div v-for="player in players">
          <Avatar :username="player.username" :avatar="player.avatar"
                  :playerIndex="player.playerIndex"
                  :key="player.playerIndex"
                  class="col-start-1"
          />
        </div>
        <div v-for="i in 6 - players.length">
          <Avatar :class="'col-start-' + i"/>
        </div>
      </div>

      <div id="play" class="pt-16 flex flex-col w-2/5 items-center">
        <Button class="mt-2" :text="'Lancer la partie'" :color="'bg-green-600'" @click="startGame"/>
        <div class="flex items-center justify-center w-full mt-2">
          <label class="w-full" @mouseover="showText = true" @mouseleave="showText = false">
            <input class="w-full h-full bg-white p-2" type="text" disabled v-model="roomURLOver"/>
          </label>
          <Button class="not-rounded" color="bg-blue-600" text="Copier" @click="copy">Copier</Button>
        </div>
      </div>
    </div>

    <div class="absolute bottom-0 left-0 w-64">
      <span class="text-white font-bold">
        Made with
        <svg xmlns="http://www.w3.org/2000/svg" class="animate-bounce inline-block align-bottom" width="24" height="24"
             viewBox="0 0 24 24" stroke-width="2" stroke="#ff0000" fill="none">
          <path stroke="none" d="M0 0h24v24H0z"/>
          <path d="M12 20l-7 -7a4 4 0 0 1 6.5 -6a.9 .9 0 0 0 1 0a4 4 0 0 1 6.5 6l-7 7"/>
        </svg>
        by Wawa#2003
      </span>
    </div>
  </div>
</template>

<script>
import Avatar from '~/components/Avatar';
import Button from '../components/Button';

export default {
  components: { Button, Avatar },
  data () {
    return {
      avatars: [
        'delivery-man.png',
        'girl.png',
        'man.png',
        'man2.png',
        'man3.png',
        'man4.png',
        'nurse.png',
        'woman.png',
        'woman2.png',
        'woman3.png'
      ],
      showText: false
    };
  },
  mounted () {
    const room = this.$nuxt.$route.query.room ? `room=${this.$nuxt.$route.query.room}` : undefined;
    this.socket = this.$nuxtSocket({
      persist: 'main',
      teardown: false,
      reconnection: false,
      vuex: {
        mutations: [
          'setSettings --> settings/setSettings',
          'setUndercoverCount --> settings/setUndercoverCount',
          'setMisterWhite --> settings/setMisterWhite',
          'setWordPerRoundCount --> settings/setWordPerRoundCount',
          'setRoundPerGameCount --> settings/setRoundPerGameCount',
          'setUsername --> room/setUsername',
          'setAvatar --> room/setAvatar',
          'setPlayerIndex --> room/setPlayerIndex',
          'addPlayer --> room/addPlayer',
          'addScore --> room/addScore',
          'setWord --> room/setWord',
          'setPlayerTurn --> room/setPlayerTurn',
          'setHasConfirmedGuess --> room/setHasConfirmedGuess',
          'setGuess --> room/setGuess',
          'setGuessWord --> room/setGuessWord',
          'addHint --> room/addHint',
          'startGuessWord --> room/startGuessWord',
          'onDisconnect --> room/onDisconnect',
        ],
      },
      query: room
    });
    this.socket.on('startGame', () => {
      this.$store.commit('room/startGame');
      this.$router.push({ path: '/game' });
    });
    this.socket.on('startRound', () => {
      this.$store.commit('room/startRound');
      this.$router.push({ path: '/game' });
    });
    this.socket.on('startGuess', () => {
      this.$router.push({ path: '/guess' });
    });
    this.socket.on('startScoreboard', payload => {
      this.$store.commit('room/startScoreboard', payload);
      this.$router.push({ path: '/scoreboard' });
    });
    this.socket.on('stopGame', () => {
      this.$store.commit('room/startRound');
      this.$router.push({ path: '/result' });
    });
    this.$store.commit('settings/setRoomBaseURL', window.location.origin);
  },
  computed: {
    username: {
      get: function () {
        return this.$store.getters['room/getUsername']();
      },
      set: function (username) {
        this.$store.commit('room/setUsername', { username });
        this.socket.emit('setUsername', username);
      }
    },
    avatar: {
      get () {
        return this.$store.getters['room/getAvatar']();
      },
      set (avatar) {
        this.$store.commit('room/setAvatar', { avatar: avatar });
        this.socket.emit('setAvatar', avatar);
      }
    },
    players: {
      get () {
        return this.$store.getters['room/getPlayers'];
      }
    },
    roomURLOver: {
      get () {
        return this.showText ? this.$store.getters['settings/getRoomURL'] : 'Survoler pour afficher le lien';
      }
    },
    roomURL: {
      get () {
        return this.$store.getters['settings/getRoomURL'];
      }
    },
    undercoverCount: {
      get () {
        return this.$store.getters['settings/getUndercoverCount'];
      },
      set (undercoverCount) {
        this.$store.commit('settings/setUndercoverCount', undercoverCount);
        this.socket.emit('setUndercoverCount', undercoverCount);
      }
    },
    misterWhite: {
      get () {
        return this.$store.getters['settings/getMisterWhite'];
      },
      set (misterWhite) {
        this.$store.commit('settings/setMisterWhite', misterWhite);
        this.socket.emit('setMisterWhite', misterWhite);
      }
    },
    wordPerRoundCount: {
      get () {
        return this.$store.getters['settings/getWordPerRoundCount'];
      },
      set (wordPerRoundCount) {
        this.$store.commit('settings/setWordPerRoundCount', wordPerRoundCount);
        this.socket.emit('setWordPerRoundCount', wordPerRoundCount);
      }
    },
    roundPerGameCount: {
      get () {
        return this.$store.getters['settings/getRoundPerGameCount'];
      },
      set (roundPerGameCount) {
        this.$store.commit('settings/setRoundPerGameCount', roundPerGameCount);
        this.socket.emit('setRoundPerGameCount', roundPerGameCount);
      }
    },
    version: {
      get () {
        return this.$store.getters['settings/getVersion'];
      }
    }
  },
  methods: {
    startGame () {
      this.socket.emit('startGame');
    },
    copy () {
      navigator.clipboard.writeText(this.roomURL);
    },
    nextAvatar () {
      const newAvatar = this.avatars[Math.abs((this.avatars.indexOf(this.$store.getters['room/getAvatar']()) + 1) % this.avatars.length)];
      this.$store.commit('room/setAvatar', { avatar: newAvatar });
      this.socket.emit('setAvatar', newAvatar);
    },
    previousAvatar () {
      let newIndex = this.avatars.indexOf(this.$store.getters['room/getAvatar']()) - 1;
      if (newIndex < 0) newIndex = this.avatars.length + newIndex;
      const newAvatar = this.avatars[newIndex];
      this.$store.commit('room/setAvatar', { avatar: newAvatar });
      this.socket.emit('setAvatar', newAvatar);
    }
  },
  transition (to, from) {
    return 'slide';
  }
};
</script>

<style>
.slide-enter-active {
  animation: .1s ease-out slide-enter;
}

.slide-leave-active {
  animation: .1s ease-in slide-leave;
}

@keyframes slide-enter {
  from {
    transform: translateX(-500px);
    opacity: 0;
  }
  to {
    transform: translateX(0px);
    opacity: 1;
  }
}

@keyframes slide-leave {
  from {
    transform: translateX(0px);
    opacity: 1;
  }
  to {
    transform: translateX(500px);
    opacity: 0;
  }
}
</style>
