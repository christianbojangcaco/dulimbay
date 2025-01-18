<template>
  <v-container class="d-flex justify-center align-center fill-height">
    <v-card class="signup-card">
      <v-card-title>
        <span class="headline">Sign Up</span>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="signup" ref="form">
          <v-select v-model="role" :items="roles" label="Role" required></v-select>
          <v-text-field
            v-model="id"
            label="ID"
            required
            hint="ID format: 211-01312 or similar"
            persistent-hint
            :rules="[(id) => /^\d{3}-\d{5}$/.test(id) || 'ID must be in format 211-01312']"
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            required
            hint="Password must be at least 6 characters long."
            persistent-hint
          ></v-text-field>
          <v-text-field v-model="first_name" label="First Name" required></v-text-field>
          <v-text-field v-model="middle_name" label="Middle Name (optional)"></v-text-field>
          <v-text-field v-model="last_name" label="Last Name" required></v-text-field>
          <v-text-field v-model="name_extension" label="Name Extension (optional)"></v-text-field>
          <v-text-field v-model="contact_number" label="Contact Number" required></v-text-field>
          <v-textarea v-model="address" label="Address" required></v-textarea>
          <template v-if="role === 'Member' || role === 'Officer'">
            <v-text-field v-model="college" label="College (abbreviation only)"></v-text-field>
            <v-text-field
              v-model="department"
              label="Department (abbreviation only)"
            ></v-text-field>
          </template>
          <template v-if="role === 'Officer'">
            <v-text-field v-model="position" label="Position"></v-text-field>
          </template>
          <v-btn type="submit" color="primary">Sign Up</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { supabase } from '@/router/supabaseClient'

export default {
  data() {
    return {
      roles: ['Admin', 'Member', 'Officer'],
      role: '',
      id: '',
      password: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      name_extension: '',
      contact_number: '',
      address: '',
      college: '',
      department: '',
      position: '',
    }
  },
  methods: {
    async signup() {
      if (this.$refs.form.validate()) {
        if (this.password.length < 6) {
          alert('Password should be at least 6 characters long.')
          return
        }

        try {
          // Check if the user already exists
          const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('id')
            .eq('id', this.id)

          console.log('Existing user check result:', existingUser)
          console.log('Fetch error:', fetchError)

          if (fetchError) {
            console.error('Error checking existing user:', fetchError)
            alert('Failed to check existing user. Please try again.')
            return
          }

          if (existingUser.length > 0) {
            alert('Already Signed Up.')
            return
          }

          // Insert user data into custom 'users' table
          const { data, error } = await supabase.from('users').insert({
            role: this.role,
            id: this.id,
            password: this.password,
            first_name: this.first_name,
            middle_name: this.middle_name || null,
            last_name: this.last_name,
            name_extension: this.name_extension || null,
            contact_number: this.contact_number,
            address: this.address,
            college: this.role !== 'Admin' ? this.college : null,
            department: this.role !== 'Admin' ? this.department : null,
            position: this.role === 'Officer' ? this.position : null,
          })

          if (error) {
            console.error('Error inserting data:', error)
            alert('Failed to sign up. Please try again.')
          } else {
            console.log('User data inserted:', data)
            alert('Sign-up successful!')
            this.$router.push('/') // Redirect to login page after sign-up
          }
        } catch (err) {
          console.error('Unexpected error:', err)
          alert('An unexpected error occurred.')
        }
      }
    },
  },
}
</script>

<style scoped>
.fill-height {
  height: 100vh;
  background-color: #f0f0f0;
  overflow-y: auto;
}
.signup-card {
  width: 100%;
  max-width: 500px;
  padding: 20px;
  margin: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
