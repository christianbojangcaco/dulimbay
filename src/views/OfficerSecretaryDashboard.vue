<template>
  <div class="container-with-footer">
    <NavBar :role="role" :firstName="firstName" />
    <v-container fluid class="main-bkg main-content">
      <v-row>
        <v-col cols="12" md="6" lg="3">
          <v-card class="notification-events bold-border">
            <v-card-title class="headline centered"> Events </v-card-title>
            <v-divider class="mb-2 gray-divider"></v-divider>
            <v-card-text>
              <v-list>
                <v-list-item-group>
                  <v-list-item v-for="(event, index) in events" :key="event.id">
                    <v-row>
                      <v-col class="shrink">
                        <v-list-item-content>
                          <v-list-item-title>{{ index + 1 }}. {{ event.title }}</v-list-item-title>
                          <v-list-item-subtitle>
                            <strong>When:</strong> {{ formatDateTime(event.date) }}
                          </v-list-item-subtitle>
                          <v-list-item-subtitle>
                            <strong>Dance Name:</strong> {{ event.dance_name }}
                          </v-list-item-subtitle>
                          <v-list-item-subtitle>
                            <strong>Description:</strong> {{ event.description }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
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
      </v-row>
    </v-container>
    <FooterBar />
  </div>
</template>

<script>
import FooterBar from '@/components/FooterBar.vue'
import NavBar from '../components/NavBar.vue'
import { supabase } from '@/router/supabaseClient'

export default {
  components: {
    NavBar,
    FooterBar,
  },
  data() {
    return {
      role: 'Officers',
      firstName: '',
      events: [],
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
  },
}
</script>

<style scoped>
.main-bkg {
  background: url('/images/background.jpg') no-repeat center;
  background-size: cover;
  background-color: 0.1;
  flex: 1;
  overflow-y: auto;
}

.notification-events {
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
</style>
