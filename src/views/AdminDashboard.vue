<template>
  <div class="container-with-footer">
    <NavBar :role="role" :firstName="firstName" />
    <v-container fluid class="main-bkg main-content">
      <v-row>
        <v-col cols="12" md="6" lg="3" class="event-column">
          <v-container class="notification-events white-bg bold-border">
            <v-row class="align-center">
              <v-col class="headline centered"> Events </v-col>
              <v-col class="d-flex justify-end">
                <v-btn @click="showAddEventCard" class="add-event-btn">Add Event</v-btn>
              </v-col>
            </v-row>
            <v-divider class="mb-2 gray-divider"></v-divider>
            <v-container class="event-list-container">
              <v-row
                v-for="(event, index) in events"
                :key="event.id"
                class="d-flex event-row align-center"
              >
                <v-col class="event-details" cols="10">
                  <div class="event-title">{{ index + 1 }}. {{ event.title }}</div>
                  <div class="event-subtitle">When: {{ formatDate(event.date) }}</div>
                  <div class="event-subtitle">Time: {{ formatTime(event.time) }}</div>
                  <div class="event-description">{{ event.description }}</div>
                </v-col>
                <v-col cols="2" class="d-flex justify-center align-center">
                  <v-btn small color="red" @click="deleteEvent(event.id)" class="delete-button">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-col>
                <v-divider class="gray-divider my-2" v-if="index < events.length - 1"></v-divider>
              </v-row>
            </v-container>
          </v-container>
        </v-col>

        <v-col cols="12" md="6" lg="9">
          <v-row>
            <v-col cols="12">
              <v-card class="attendance bold-border">
                <Attendance
                  :view="'admin'"
                  :data="attendanceData"
                  @next="fetchNextWeek"
                  @prev="fetchPrevWeek"
                />
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card class="borrowed-costumes bold-border">
                <BorrowedCostumes :data="borrowedCostumes" />
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card class="borrowed-instruments bold-border">
                <BorrowedInstruments :data="borrowedInstruments" />
              </v-card>
            </v-col>
          </v-row>
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
        const { data, error } = await supabase.from('events').select('*')

        if (error) throw error

        // Get the current date and time
        const currentDateTime = new Date()

        // Filter out events that have already passed
        this.events = data.filter((event) => {
          const eventDateTime = new Date(event.date) // Assuming event.date is a valid date string
          return eventDateTime >= currentDateTime // Only keep future events
        })
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
    formatDate(date) {
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Manila',
      }
      return new Intl.DateTimeFormat('en-US', options).format(new Date(date))
    },
    formatTime(time) {
      const [hours, minutes] = time.split(':')
      let formattedHours = parseInt(hours, 10)
      const suffix = formattedHours >= 12 ? 'PM' : 'AM'

      // Convert to 12-hour format
      if (formattedHours > 12) {
        formattedHours -= 12
      } else if (formattedHours === 0) {
        formattedHours = 12 // Handle midnight case
      }

      return `${formattedHours}:${minutes} ${suffix}` // Format as HH:mm AM/PM
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
      try {
        const { data, error } = await supabase
          .from('attendance')
          .select('*')
          .order('date', { ascending: false })

        if (error) throw error
        this.attendanceData = data
      } catch (err) {
        console.error('Error fetching attendance:', err.message)
      }
    },
    async fetchBorrowedCostumes() {
      try {
        const { data, error } = await supabase
          .from('borrowed_costumes')
          .select('*')
          .order('borrowed_date', { ascending: false })

        if (error) throw error
        this.borrowedCostumes = data
      } catch (err) {
        console.error('Error fetching borrowed costumes:', err.message)
      }
    },
    async fetchBorrowedInstruments() {
      try {
        const { data, error } = await supabase
          .from('borrowed_instruments')
          .select('*')
          .order('borrowed_date', { ascending: false })

        if (error) throw error
        this.borrowedInstruments = data
      } catch (err) {
        console.error('Error fetching borrowed instruments:', err.message)
      }
    },
    async checkEventExpiry() {
      const currentDateTime = new Date().toISOString()

      // Loop through events and check if any event has passed
      for (let event of this.events) {
        const eventDateTime = new Date(event.date).toISOString() // Assuming event.date contains the full date and time
        if (eventDateTime < currentDateTime) {
          // Event has passed, reload the page
          window.location.reload()
          break // Exit the loop after reloading
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
  background-color: rgba(0, 0, 0, 0.1);
  flex: 1;
  overflow-y: auto;
}

.notification-events,
.attendance,
.borrowed-costumes,
.borrowed-instruments {
  flex: 1;
}

.white-bg {
  background-color: white !important;
}

.event-column {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 160px); /* Adjust height based on header and footer */
}

.event-list-container {
  flex: 1;
  overflow-y: auto;
  height: 100%; /* Fill available space */
}

.event-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  margin-right: 8px;
}

.bold-border {
  border: 2px solid black;
}

.container-with-footer {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  overflow-y: auto;
}

.footer {
  background: url('images/Header-Footer-Background.jpg') no-repeat;
  background-size: cover;
  color: white;
  padding: 0;
}

.footer-bar {
  height: 80px;
  width: 100%;
  text-align: center;
}

.footer-bar span {
  font-size: 18px;
  line-height: 80px;
}

.footer-bar a {
  color: white;
  text-decoration: none;
}

.notification-events .event-details {
  overflow: hidden;
  white-space: normal;
  word-wrap: break-word;
}

.notification-events .event-title,
.notification-events .event-subtitle {
  text-overflow: unset;
  overflow: unset;
  white-space: normal;
}

.event-title {
  white-space: normal;
  word-wrap: break-word;
}

.event-description,
.event-subtitle {
  white-space: normal;
  word-wrap: break-word;
}

.v-list-item-content {
  display: block;
}

.v-row {
  flex-wrap: wrap;
}

.v-col {
  flex: 1 1 auto;
}

.v-btn {
  min-width: 40px;
}

.delete-btn {
  display: flex;
  justify-content: flex-end;
}

.delete-button {
  background-color: red;
  color: white;
  border-radius: 50%;
  margin-left: 10px;
}

.add-event-btn {
  width: 100%;
  text-align: center;
  background-color: #1976d2;
  color: white;
}

/* Media Queries for Responsive Design */
@media only screen and (max-width: 768px) {
  .event-column {
    height: auto; /* Allow height to adjust */
  }

  .event-list-container {
    height: auto; /* Allow height to adjust */
  }

  .headline {
    font-size: 20px; /* Smaller headline for mobile */
  }

  .add-event-btn {
    font-size: 14px; /* Smaller button font size */
  }

  .event-title {
    font-size: 16px; /* Smaller event title */
  }

  .event-subtitle {
    font-size: 14px; /* Smaller subtitle */
  }

  .event-description {
    font-size: 12px; /* Smaller description */
  }
}
</style>
