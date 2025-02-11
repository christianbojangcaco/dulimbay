<template>
  <v-toolbar class="custom-toolbar">
    <v-toolbar-title class="welcome-container">
      <span v-if="loading" class="spinner"></span>
      <span v-else>{{ typingText }}</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-menu offset-y>
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" class="menu-button">
          <v-icon left>mdi-menu</v-icon>
          Menu
        </v-btn>
      </template>
      <v-list>
        <v-list-item>
          <router-link to="/ManageMembers" class="no-underline">
            <v-list-item-title class="menu-item">Manage Members</v-list-item-title>
          </router-link>
        </v-list-item>
        <v-list-item>
          <router-link to="/AllBorrowedCostumes" class="no-underline">
            <v-list-item-title class="menu-item">All Borrowed Costumes</v-list-item-title>
          </router-link>
        </v-list-item>
        <v-list-item>
          <router-link to="/Attendance" class="no-underline">
            <v-list-item-title class="menu-item">Attendance</v-list-item-title>
          </router-link>
        </v-list-item>
        <v-list-item>
          <router-link to="/VacantSchedules" class="no-underline">
            <v-list-item-title class="menu-item">Vacant Schedules</v-list-item-title>
          </router-link>
        </v-list-item>
        <v-list-item>
          <router-link to="/InstrumentUsage" class="no-underline">
            <v-list-item-title class="menu-item">Instrument Usage</v-list-item-title>
          </router-link>
        </v-list-item>
        <v-list-item @click="logout">
          <v-list-item-title class="menu-item">Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script>
export default {
  props: {
    role: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      typingText: '',
      fullText: '',
      typingIndex: 0,
      typingInterval: null,
      loading: true,
    }
  },
  computed: {
    welcomeMessage() {
      if (this.role === 'Admin') {
        return `Welcome, Sir ${this.firstName}`
      } else if (this.role === 'Officer') {
        return `Welcome, ${this.position} ${this.firstName}`
      } else {
        return `Welcome, ${this.firstName}`
      }
    },
  },
  methods: {
    logout() {
      console.log('Logging out...')
      this.$router.push('/')
    },
    startTyping() {
      this.typingText = ''
      const fullText = this.welcomeMessage
      let typingIndex = 0

      clearInterval(this.typingInterval)

      this.typingInterval = setInterval(() => {
        if (typingIndex < fullText.length) {
          this.typingText += fullText.charAt(typingIndex)
          typingIndex++
        } else {
          clearInterval(this.typingInterval)
        }
      }, 100)
    },
  },
  mounted() {
    console.log('Received role:', this.role)
    console.log('Received firstName:', this.firstName)
    console.log('Received position:', this.position)

    // Show loader before typing starts
    setTimeout(() => {
      this.loading = false
      this.startTyping()
    }, 1500)
  },
  beforeUnmount() {
    clearInterval(this.typingInterval)
  },
}
</script>

<style scoped>
.custom-toolbar {
  background-color: maroon;
  background: url('/images/Header-Footer-Background.jpg') no-repeat center;
  background-size: cover;
  border: 1px solid white;
  padding: 10px;
  color: white;
  font-family: 'Arial', sans-serif;
}

.menu-button {
  color: white;
}

.menu-item {
  color: black;
  transition: color 0.3s ease;
}

.menu-item:hover {
  color: yellow;
}

.v-toolbar-title {
  flex: 1;
  max-width: 100%;
  font-weight: bold;
  font-size: 20px;
  text-transform: uppercase;
  color: white;
  text-align: left;
}

.no-underline {
  text-decoration: none;
}

.welcome-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}

.typed-text {
  font-size: 1.25rem;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: white;
}

.spinner {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
