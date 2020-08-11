<template>
  <v-container>
    <v-row class="text-center" align="stretch">
      <v-col cols="6" class="d-flex flex-column">
        <v-card class="flex d-flex flex-column">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="headline">Point of Sale Demo</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-card-text>Demonstrates support for point of sale activities such as purchasing or returning an item</v-card-text>
          <v-card-actions>
            <v-col class="text-right">
              <v-btn
                      right
                      color="deep-purple lighten-2"
                      text
                      @click="navigateToPointOfSale"
              >
                Proceed
              </v-btn>
            </v-col>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="6" class="d-flex flex-column">
        <v-card class="flex d-flex flex-column">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="headline">Lifecycle Demo</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-card-text>Demonstrates support for managing the lifecycle of an item</v-card-text>
          <v-card-actions>
            <v-col class="text-right">
              <v-btn
                      right
                      color="deep-purple lighten-2"
                      text
                      @click="navigateToLifecycle"
              >
                Proceed
              </v-btn>
            </v-col>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import router from '../router'

  export default {
    name: 'Landing',

    data: () => ({
    }),
    methods: {
      navigateToLifecycle: function () {
        router.push('/Lifecycle')
      },
      navigateToPointOfSale: function() {
        router.push('/pointOfSale')
      }
    }
  }
</script>
