<template>
  <v-container>
    <!-- Header Section -->
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>
        <v-btn text color="white" @click="redirectToDashboard"> Hi {{ userLastName }}! </v-btn>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text color="white">Members</v-btn>
      <v-btn text color="white">Log Out</v-btn>
    </v-app-bar>

    <!-- Main Content -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Dashboard</v-card-title>
          <v-card-text>
            <!-- Notifications Section -->
            <v-alert type="info" class="mb-4">
              <v-alert-text>
                Scheduled Events:
                <!-- Display notifications here -->
              </v-alert-text>
            </v-alert>

            <!-- Attendance Section -->
            <v-card class="mb-4">
              <v-card-title>My Attendance</v-card-title>
              <v-card-text>
                <!-- Display attendance data here -->
              </v-card-text>
            </v-card>

            <!-- Payments Section -->
            <v-card class="mb-4">
              <v-card-title>My Payments</v-card-title>
              <v-card-text>
                <!-- Display payments data here -->
              </v-card-text>
            </v-card>

            <!-- Borrowed Costumes Section -->
            <v-card>
              <v-card-title>My Borrowed Costumes</v-card-title>
              <v-card-text>
                <!-- Display borrowed costumes data here -->
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      userLastName: 'Doe', // Replace "Doe" with the actual user's last name fetched dynamically
      notifications: [],
      attendance: [],
      payments: [],
      borrowedCostumes: [],
    }
  },
  methods: {
    redirectToDashboard() {
      // Redirects to the same page (dashboard)
      this.$router.push({ name: 'Dashboard' })
    },
  },
  created() {
    // Fetch data from Supabase and assign to the above arrays
  },
}
</script>

<style scoped>
.mb-4 {
  margin-bottom: 1.5rem;
}
</style>
