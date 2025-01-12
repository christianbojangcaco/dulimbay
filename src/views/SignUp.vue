<template>
  <v-container class="d-flex justify-center align-center fill-height">
    <v-card class="signup-card">
      <v-card-title>
        <span class="headline">Sign Up</span>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-select v-model="role" :items="roles" label="Role" required></v-select>
          <v-text-field v-model="id" label="ID" required></v-text-field>
          <v-text-field v-model="first_name" label="First Name" required></v-text-field>
          <v-text-field v-model="middle_name" label="Middle Name (optional)"></v-text-field>
          <v-text-field v-model="last_name" label="Last Name" required></v-text-field>
          <v-text-field v-model="name_extension" label="Name Extension (optional)"></v-text-field>
          <v-text-field v-model="contact_number" label="Contact Number" required></v-text-field>
          <v-text-field
            v-model="email"
            label="Email Address (optional)"
            type="email"
          ></v-text-field>
          <v-textarea v-model="address" label="Address" required></v-textarea>
          <template v-if="role === 'member' || role === 'officer'">
            <v-text-field v-model="college" label="College (abbreviation only)"></v-text-field>
            <v-text-field
              v-model="department"
              label="Department (abbreviation only)"
            ></v-text-field>
          </template>
          <template v-if="role === 'officer'">
            <v-text-field v-model="position" label="Position"></v-text-field>
          </template>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="signup" color="primary">Sign Up</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { supabase } from '@/router/supabaseClient' // Adjust path if necessary

export default {
  data() {
    return {
      roles: ['admin', 'member', 'officer'],
      role: '',
      id: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      name_extension: '',
      contact_number: '',
      email: '',
      address: '',
      college: '',
      department: '',
      position: '',
    }
  },
  methods: {
    async signup() {
      try {
        // Log the data to verify it's correct
        console.log({
          role: this.role,
          id: this.id,
          first_name: this.first_name,
          middle_name: this.middle_name,
          last_name: this.last_name,
          name_extension: this.name_extension,
          contact_number: this.contact_number,
          email: this.email,
          address: this.address,
          college: this.role !== 'admin' ? this.college : null,
          department: this.role !== 'admin' ? this.department : null,
          position: this.role === 'officer' ? this.position : null,
        })

        const { data, error } = await supabase.from('members').insert({
          role: this.role,
          id: this.id,
          first_name: this.first_name,
          middle_name: this.middle_name || null, // Ensure null if empty
          last_name: this.last_name,
          name_extension: this.name_extension || null, // Ensure null if empty
          contact_number: this.contact_number,
          email: this.email,
          address: this.address,
          college: this.role !== 'admin' ? this.college : null,
          department: this.role !== 'admin' ? this.department : null,
          position: this.role === 'officer' ? this.position : null,
        })

        if (error) {
          console.error('Error inserting data:', error.message)
          alert('Failed to sign up. Please try again.')
        } else {
          console.log('User signed up:', data)
          alert('Sign-up successful!')
        }
      } catch (err) {
        console.error('Unexpected error:', err)
        alert('An unexpected error occurred.')
      }
    },
  },
}
</script>

<style scoped>
.fill-height {
  height: 100vh;
  background-color: #f0f0f0;
  overflow-y: auto; /* Allow vertical scrolling */
}
.signup-card {
  width: 100%;
  max-width: 500px;
  padding: 20px;
  margin: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
