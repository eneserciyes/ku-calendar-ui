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
          <v-row justify="center">
            <v-dialog v-model="dialog" persistent max-width="600px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" dark v-bind="attrs" v-on="on">
                  Create Event
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Event Details</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-combobox
                          v-model="clubSelected"
                          label="Student Club"
                          :items="clubs"
                          outlined
                        ></v-combobox>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="eventTitle"
                          label="Event Title*"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="eventDescription"
                          label="Description*"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" lg="4">
                        <v-menu
                          ref="dateMenu"
                          v-model="menu1"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="dateFormatted"
                              label="Date"
                              hint="YYYY/MM/DD format"
                              persistent-hint
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="date"
                            no-title
                            @input="menu1 = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>

                      <v-col cols="12" lg="4">
                        <v-menu
                          ref="menu"
                          v-model="menu2"
                          :close-on-content-click="false"
                          :return-value.sync="time"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          max-width="250px"
                          min-width="250px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="time"
                              label="Start Time"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-time-picker
                            v-if="menu2"
                            v-model="time"
                            :allowed-minutes="allowedMinutes"
                            full-width
                            scrollable
                            @click:minute="$refs.menu.save(time)"
                          ></v-time-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" lg="4">
                        <v-menu
                          ref="endTimeMenu"
                          v-model="menu3"
                          :close-on-content-click="false"
                          :return-value.sync="endTime"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          max-width="250px"
                          min-width="250px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="endTime"
                              label="End Time"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-time-picker
                            v-if="menu3"
                            v-model="endTime"
                            :allowed-minutes="allowedMinutes"
                            full-width
                            scrollable
                            @click:minute="$refs.endTimeMenu.save(endTime)"
                          ></v-time-picker>
                        </v-menu>
                      </v-col>
                    </v-row>
                  </v-container>
                  <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="dialog = false"
                    >Close</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="createEvent"
                    >Save</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>
        </v-list-item>
        <v-list-item>
          <v-row justify="center">
            <v-date-picker v-model="focus" no-title width="250px">
            </v-date-picker>
          </v-row>
        </v-list-item>
        <v-list-item>
          <v-treeview selectable selected-color="accent" :items="items">
          </v-treeview>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      height="80px"
      class="calendar-app-bar"
      :src="navbarBackground"
      color="primary"
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon
        style="color: white"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-img
        style="margin-left: 10px"
        :src="iconKoc"
        max-width="64px"
        max-height="64"
      ></v-img>
      <v-toolbar-title
        style="color: white; font-family: stymiebold,serif; margin-left: 10px; font-size: 36px"
        v-text="title"
      />
      <v-spacer />
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-layout column justify-center align-center>
          <div class="toolbarContainer">
            <v-row class="fill-height">
              <v-col cols="12" lg="2">
                <v-row justify="center">
                  <v-btn color="primary" class="today" @click="setToday">
                    Today
                  </v-btn>
                </v-row>
              </v-col>
              <v-col cols="12" lg="3">
                <v-row class="fill-height" align-content="center">
                  <v-btn
                    fab
                    x-small
                    class="arrows"
                    color="primary"
                    @click="$refs.calendar.prev()"
                  >
                    <v-icon>mdi-chevron-left</v-icon>
                  </v-btn>
                  <v-btn
                    fab
                    x-small
                    class="arrows"
                    color="primary"
                    @click="$refs.calendar.next()"
                  >
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>
                  <v-toolbar-title v-if="$refs.calendar">
                    {{ $refs.calendar.title }}
                  </v-toolbar-title>
                </v-row>
              </v-col>
              <v-col style="margin-left: auto" cols="12" lg="2">
                <v-select
                  v-model="type"
                  :items="typeOptions"
                  label="Type"
                  hide-details
                  color="primary"
                  outlined
                  dense
                ></v-select>
              </v-col>
            </v-row>
          </div>
          <v-sheet class="calendarContainer">
            <v-calendar
              ref="calendar"
              v-model="focus"
              :type="type"
              :events="events"
              first-time="08:00"
              @change="retrieveEvents"
              event-color="accent"
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
import EventCreationService from '~/service/events/EventCreationService'

export default {
  data: (vm) => ({
    iconKoc: require('../assets/koc.png'),
    type: 'month',
    dialog: false,
    clubSelected: '',
    time: null,
    endTime: null,
    date: new Date().toISOString().substr(0, 10),
    dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    clubs: [
      'KU AIRS',
      'Google DSC',
      'GLLP',
      'KU Musical',
      'KU SWE',
      'Business Club',
      'KU Orkestra',
      'KU ACM',
      'IEEE',
      'KU Entrepreneurship',
      'KU Awareness Club'
    ],
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
    menu1: false,
    menu2: false,
    menu3: false,
    eventTitle: '',
    eventDescription: '',
    miniVariant: false,
    right: true,
    rightDrawer: false,
    navbarBackground: require('../assets/navbar.jpg'),
    title: 'KUlendar',
    events: []
  }),
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date)
    }
  },

  watch: {
    date(val) {
      this.dateFormatted = this.formatDate(this.date)
    }
  },
  mounted() {
    this.$refs.calendar.checkChange()
  },
  methods: {
    setToday() {
      this.focus = ''
    },
    retrieveEvents() {
      const events = []
      EventRetrievalService.retrieveEvents().then((res) => {
        const eventResponse = res.data
        for (const event of eventResponse) {
          events.push({
            name: event.eventTitle,
            start: new Date(event.start),
            end: new Date(event.end),
            timed: true,
            color: 'indigo'
          })
        }
      })
      this.events = events
    },
    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${year}-${month}-${day}`
    },
    parseDate(date) {
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    allowedMinutes: (m) => m % 15 === 0,
    createEvent() {
      EventCreationService.createEvent(
        this.clubSelected,
        this.eventTitle,
        this.eventDescription,
        this.dateFormatted,
        this.time,
        this.endTime
      )
      this.dialog = false
      this.retrieveEvents()
    }
  }
}
</script>

<style>
@media all {
  body,
  html {
    overflow: hidden;
  }
  .container {
    display: flex;
    flex-direction: row;
    height: 100%;
    max-width: 100%;
  }
  .toolbarContainer {
    display: flex;
    flex-direction: row;
    width: 100%;
  }
}

.toolbar {
  display: flex;
  flex-direction: row;
}

.arrows {
  margin-right: 10px;
}

.calendarContainer {
  width: 100%;
  height: 500px;
  flex: 1 1 auto;
}

.v_image__image {
  background-position-y: -75px;
}
</style>
