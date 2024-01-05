<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-btn
              href="/"
              text
      >
        <span class="mr-2">Hedera Theft Prevention Demo</span>
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn
        :href=topicUrl
        target="_blank"
        text
      >
        <span class="mr-2">Topic {{ topicId }} on 3rd Party Explorer</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
      <v-snackbar
              v-model="snackbar"
              :bottom=true
              :color="snackAlert"
              :multi-line=false
              :timeout=2000
              :vertical=true
      >
        {{ snackMessage }}
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script>
  import { bus } from './main'

export default {
  name: 'App',

  data: () => ({
    snackbar: false,
    snackMessage: '',
    snackAlert: 'alert',
    topicUrl: "https://hashscan.io/testnet/topic/".concat(process.env.VUE_APP_TOPIC_ID),
    topicId: process.env.VUE_APP_TOPIC_ID
  }),
  mounted() {
    bus.$on('showSuccess', (message) => {
      this.snackAlert = 'success'
      this.snackMessage = message
      this.snackbar = true
    })
    bus.$on('showProgress', (message) => {
      this.snackAlert = 'info'
      this.snackMessage = message
      this.snackbar = true
    })
    bus.$on('showError', (message) => {
      this.snackAlert = 'error'
      this.snackMessage = message
      this.snackbar = true
    })
    bus.$on('hideSnackbar', () => {
      this.snackbar = false
      this.snackMessage = ''
    })
  }
}
</script>
