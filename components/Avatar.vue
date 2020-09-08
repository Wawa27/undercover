<template>
    <div class="flex flex-col items-center text-white truncate" :class="username ? 'zoom-in' : ''">
      <div v-if="username" class="text-5xl font-semibold" :class="[
      isPlayer ? 'text-gray-600' : 'text-white',
      isUndercover ? 'text-red-600' : 'text-white',
      isMisterWhite ? 'text-teal-600' : 'text-white'
      ]">
        {{ this.username }}
      </div>
      <div v-else class="bg-gray-600 w-full h-10 mt-4 mb-3 animate-pulse"/>
      <div>
        <img v-if="avatar" :src="`${avatar}`" class="h-32 w-32" alt="avatar"/>
        <div v-else class="w-32 h-32 bg-gray-600 rounded-full animate-pulse"/>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Avatar',
  props: [
    'avatar',
    'username',
    'playerIndex'
  ],
  computed: {
    isPlayer() {
      return this.$store.getters['room/getPlayerIndex'] === this.playerIndex;
    },
    isUndercover() {
      return this.$store.getters['room/getUndercovers'].includes(this.playerIndex);
    },
    isMisterWhite() {
      return this.$store.getters['room/getMisterWhite'] === this.playerIndex;
    }
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
