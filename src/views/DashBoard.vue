<template>
  <div class="container-with-footer">
    <NavBar :role="role" :firstName="firstName" />
    <v-container fluid class="main-bkg main-content">
      <v-row>
        <v-col cols="12" md="6" lg="3">
          <v-card class="notification-events bold-border">
            <v-card-title class="headline centered">
              Events
              <v-spacer></v-spacer>
              <v-btn icon @click="showAddEventCard">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-card-title>
            <v-divider class="mb-2 gray-divider"></v-divider>
            <v-card-text>
              <v-list>
                <v-list-item-group>
                  <v-list-item v-for="(event, index) in events" :key="event.id">
                    <v-row>
                      <v-col class="shrink">
                        <v-list-item-content class="mr-1">
                          <v-list-item-title>{{ index + 1 }}. {{ event.title }}</v-list-item-title>
                          <v-list-item-subtitle
                            >When: {{ formatDateTime(event.date) }}</v-list-item-subtitle
                          >
                          <v-list-item-subtitle
                            >Dances Name: {{ event.dance_name }}</v-list-item-subtitle
                          >
                          <v-list-item-subtitle>{{ event.description }}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-col>
                      <v-col class="shrink">
                        <v-btn icon @click="deleteEvent(event.id)">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-divider
                      class="gray-divider my-2"
                      v-if="index < events.length - 1"
                    ></v-divider>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6" lg="3">
          <v-card class="attendance bold-border">
            <Attendance
              :view="'admin'"
              :data="attendanceData"
              @next="fetchNextWeek"
              @prev="fetchPrevWeek"
            />
          </v-card>
        </v-col>

        <v-col cols="12" md="6" lg="3">
          <v-card class="borrowed-costumes bold-border">
            <BorrowedCostumes :data="borrowedCostumes" />
          </v-card>
        </v-col>

        <v-col cols="12" md="6" lg="3">
          <v-card class="borrowed-instruments bold-border">
            <BorrowedInstruments :data="borrowedInstruments" />
          </v-card>
        </v-col>
      </v-row>

      <!-- Add Event Card Popup -->
      <v-dialog v-model="showEventCard" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Add New Event</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid">
              <v-text-field v-model="newEvent.title" label="Event Name" required></v-text-field>
              <v-text-field
                v-model="newEvent.date"
                label="When"
                type="date"
                required
              ></v-text-field>
              <v-text-field
                v-model="newEvent.time"
                label="Time"
                type="time"
                required
              ></v-text-field>
              <v-text-field v-model="newEvent.description" label="Description"></v-text-field>
              <v-textarea
                v-model="newEvent.dance_name"
                label="Dances Name"
                auto-grow
                required
              ></v-textarea>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue darken-1" text @click="checkDate">Save</v-btn>
            <v-btn color="blue darken-1" text @click="showEventCard = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Confirmation Dialog -->
      <v-dialog v-model="showConfirmDialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Confirm Event Date</span>
          </v-card-title>
          <v-card-text>
            The date for the event is in the past. Are you sure you want to continue?
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue darken-1" text @click="confirmSaveEvent(true)">Yes</v-btn>
            <v-btn color="blue darken-1" text @click="confirmSaveEvent(false)">No</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
    <FooterBar />
  </div>
</template>

<script>
import FooterBar from '@/components/FooterBar.vue'
import NavBar from '../components/NavBar.vue'
import Attendance from './AttendanceVue.vue'
import BorrowedCostumes from './BorrowedCostumes.vue'
import BorrowedInstruments from './BorrowedInstruments.vue'
import { supabase } from '@/router/supabaseClient'

export default {
  components: {
    NavBar,
    Attendance,
    BorrowedCostumes,
    BorrowedInstruments,
    FooterBar,
  },
  data() {
    return {
      role: 'Admin',
      firstName: '',
      showEventCard: false,
      showConfirmDialog: false,
      newEvent: {
        title: '',
        date: '',
        time: '',
        description: '',
        dance_name: '',
      },
      events: [],
      attendanceData: [],
      borrowedCostumes: [],
      borrowedInstruments: [],
      valid: true,
    }
  },
  async created() {
    try {
      const userId = localStorage.getItem('userId')
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('first_name')
        .eq('id', userId)
        .single()

      if (userError) throw userError
      this.firstName = userData.first_name
      console.log('First name fetched:', this.firstName)

      await this.fetchEvents()
      await this.fetchAttendance()
      await this.fetchBorrowedCostumes()
      await this.fetchBorrowedInstruments()

      // Set an interval to check the events every 60 seconds
      setInterval(this.checkEventExpiry, 60000) // Check every 60 seconds
    } catch (err) {
      console.error('Error fetching data:', err.message)
    }
  },
  methods: {
    async fetchEvents() {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .filter('date', 'gte', new Date().toISOString())

        if (error) throw error
        this.events = data
      } catch (err) {
        console.error('Error fetching events:', err.message)
      }
    },
    showAddEventCard() {
      this.showEventCard = true
    },
    checkDate() {
      const eventDate = new Date(`${this.newEvent.date} ${this.newEvent.time}`)
      const currentDate = new Date()
      if (eventDate < currentDate) {
        this.showConfirmDialog = true
      } else {
        this.saveEvent()
      }
    },
    async confirmSaveEvent(proceed) {
      this.showConfirmDialog = false
      if (proceed) {
        await this.saveEvent()
        // Refresh events after saving
        await this.fetchEvents()
      }
    },
    async saveEvent() {
      if (this.$refs.form.validate()) {
        try {
          const dateTime = `${this.newEvent.date} ${this.newEvent.time}:00+08:00`
          const eventWithDateTime = {
            ...this.newEvent,
            date: dateTime,
          }
          const { data, error } = await supabase.from('events').insert([eventWithDateTime])

          if (error) throw error

          console.log('Insert response data:', data)

          if (data && data.length > 0) {
            this.events.push(data[0])
          } else {
            console.error('No data returned from insert operation')
          }

          // Refresh events after saving
          await this.fetchEvents()

          this.showEventCard = false
          this.newEvent = {
            title: '',
            date: '',
            time: '',
            description: '',
            dance_name: '',
          }
        } catch (err) {
          console.error('Error saving event:', err.message)
        }
      }
    },
    formatDateTime(dateTime) {
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: 'Asia/Manila',
      }
      return new Intl.DateTimeFormat('en-US', options).format(new Date(dateTime))
    },
    async deleteEvent(eventId) {
      try {
        const { error } = await supabase.from('events').delete().match({ id: eventId })

        if (error) throw error
        this.events = this.events.filter((event) => event.id !== eventId)
      } catch (err) {
        console.error('Error deleting event:', err.message)
      }
    },
    async fetchAttendance() {
      // Fetch attendance logic here...
    },
    async fetchBorrowedCostumes() {
      // Fetch borrowed costumes logic here...
    },
    async fetchBorrowedInstruments() {
      // Fetch borrowed instruments logic here...
    },
    async checkEventExpiry() {
      const currentDateTime = new Date().toISOString()

      // Loop through events and check if any event has passed
      for (let event of this.events) {
        if (event.date < currentDateTime) {
          // Event has passed, refresh the events list
          await this.fetchEvents()
          break
        }
      }
    },
  },
}
</script>

<style scoped>
.main-bkg {
  background: url('/images/background.jpg') no-repeat center;
  background-size: cover;
  background-color: 0.1;
  flex: 1; /* Allow the main content to grow and shrink */
  overflow-y: auto; /* Enable vertical scrolling */
}

.notification-events,
.attendance,
.borrowed-costumes,
.borrowed-instruments {
  flex: 1;
}

.headline {
  font-weight: bold;
  font-size: 24px;
}

.centered {
  text-align: center;
}

.gray-divider {
  background-color: gray;
}

.mr-1 {
  margin-right: 8px; /* Reduced margin-right space */
}

.bold-border {
  border: 2px solid black;
}

.container-with-footer {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Ensure the container takes the full height of the viewport */
}

.main-content {
  flex: 1; /* Take remaining space */
  overflow-y: auto; /* Enable vertical scrolling */
}

.footer {
  background: url('images/Header-Footer-Background.jpg') no-repeat;
  background-size: cover;
  color: white;
  padding: 0; /* Remove padding */
}

.footer-bar {
  height: 80px; /* Fixed footer height */
  width: 100%;
  text-align: center;
}

.footer-bar span {
  font-size: 18px;
  line-height: 80px; /* Vertically center the text */
}

.footer-bar a {
  color: white;
  text-decoration: none;
}
</style>
