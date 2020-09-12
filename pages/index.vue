<template>
  <v-app light>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item>
          <v-container><v-btn>Create event</v-btn></v-container>
        </v-list-item>
        <v-list-item>
          <v-date-picker> </v-date-picker>
        </v-list-item>
        <v-list-item>
          <v-treeview selectable selected-color="accent" :items="items">
          </v-treeview>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      outlined
      class="calendar-app-bar"
      :src="navbarBackground"
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon
        style="color: white"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title style="color: white" v-text="title" />
      <v-spacer />
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-layout column justify-center align-center>
          <div class="toolbarContainer">
            <div class="toolbar">
              <v-row>
                <v-col>
                  <v-btn class="today" @click="setToday"> Today </v-btn>
                </v-col>
                <v-col>
                  <v-row>
                    <v-btn
                      fab
                      small
                      absolute
                      left
                      color="primary"
                      @click="$refs.calendar.prev()"
                    >
                      <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-btn
                      fab
                      small
                      absolute
                      right
                      color="primary"
                      @click="$refs.calendar.next()"
                    >
                      <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                  </v-row>
                </v-col>
                <v-col>
                  <!--TODO: calendar v-if-->
                  <v-toolbar-title v-if="$refs.calendar">
                    {{ $refs.calendar.title }}
                  </v-toolbar-title>
                </v-col>
                <v-col>
                  <v-select
                    v-model="type"
                    :items="typeOptions"
                    label="Type"
                    hide-details
                    outlined
                    dense
                  ></v-select>
                </v-col>
              </v-row>
            </div>
          </div>
          <v-sheet class="calendarContainer">
            <v-calendar
              ref="calendar"
              v-model="focus"
              :type="type"
              :events="events"
              @change="retrieveEvents"
            >
            </v-calendar>
          </v-sheet>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import EventRetrievalService from '~/service/events/EventRetrievalService'

export default {
  data: () => ({
    type: 'month',
    typeOptions: [
      { text: 'Day', value: 'day' },
      { text: 'Week', value: 'week' },
      { text: 'Month', value: 'month' }
    ],
    mode: 'stack',
    focus: '',
    clipped: true,
    drawer: false,
    fixed: false,
    items: [
      {
        id: 1,
        name: 'Event Categories',
        children: [
          { id: 2, name: 'Academic' },
          { id: 3, name: 'UNIV 101' },
          { id: 4, name: 'Sports' },
          { id: 5, name: 'Career' }
        ]
      }
    ],
    miniVariant: false,
    right: true,
    rightDrawer: false,
    navbarBackground: require('../assets/navbar.jpg'),
    title: 'KU-Calendar',
    events: []
  }),
  mounted() {
    this.$refs.calendar.checkChange()
  },
  methods: {
    setToday() {
      this.focus = ''
    },
    retrieveEvents({ start, end }) {
      const events = []
      EventRetrievalService.retrieveEvents(start, end).then((res) => {
        const eventResponse = res.data
        for (const event of eventResponse) {
          events.push({
            name: event.title,
            start: event.start,
            end: event.end,
            timed: true,
            color: 'secondary'
          })
        }
      })
    }
  }
}
</script>

<style>
@media all {
  .container {
    display: flex;
    flex-direction: row;
    height: 100%;
    max-width: 100%;
  }
  .toolbarContainer {
    display: flex;
    flex-direction: row;
    max-width: 100%;
  }
}

.toolbar {
  display: flex;
  flex-direction: row;
}

.calendarContainer {
  width: 100%;
  height: 600px;
  flex: 1 1 auto;
}
</style>
