<template>
  <div class="container-with-footer">
    <NavBar :role="role" :firstName="firstName" />

    <v-container fluid class="main-content">
      <v-row>
        <v-col cols="12">
          <v-card class="table-card">
            <v-card-title>
              <h2 class="headline">Weekly Attendance</h2>
            </v-card-title>
            <v-card-text>
              <div class="top-section">
                <!-- Mark Attendance Button -->
                <v-btn @click="showDialog = true" color="primary">Mark Attendance</v-btn>

                <!-- Attendance Legend (Aligned Right) -->
                <div class="legend">
                  <span class="checkmark">✔️ - Present</span>
                  <span class="excused">➖ - Excused</span>
                  <span class="absent">❌ - Absent</span>
                </div>
              </div>

              <div class="table-container">
                <v-table>
                  <thead>
                    <tr>
                      <th class="centered-header">Last Name</th>
                      <th v-for="date in weekDates" :key="date" class="centered-header">
                        <div class="day-name">{{ getDayName(date) }}</div>
                        <div class="date-text">{{ formatDate(date) }}</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in sortedUsers" :key="user.id">
                      <td class="centered-cell">{{ user.last_name }}</td>
                      <td v-for="date in weekDates" :key="date" class="centered-cell">
                        <span v-if="isPresent(user.id, date)" class="checkmark">✔️</span>
                        <span v-else-if="isExcused(user.id, date)" class="excused">➖</span>
                        <span v-else-if="isAbsent(user.id, date)" class="absent">❌</span>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Pop-up Dialog for Attendance Input -->
    <v-dialog v-model="showDialog" max-width="400px">
      <v-card>
        <v-card-title>Mark Attendance</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="inputId"
            label="Enter User ID"
            placeholder="Enter ID"
          ></v-text-field>
          <v-select
            v-model="selectedStatus"
            :items="['Present', 'Excused', 'Absent']"
            label="Select Status"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-btn color="grey" @click="showDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="markAttendance">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <FooterBar class="footer-bar" />
  </div>
</template>

<script>
import { reactive, ref, computed, onMounted } from 'vue'
import FooterBar from '@/components/FooterBar.vue'
import NavBar from '@/components/NavBar.vue'
import { supabase } from '@/router/supabaseClient'

export default {
  components: {
    NavBar,
    FooterBar,
  },
  setup() {
    const role = ref('Admin')
    const firstName = ref('')
    const users = ref([])
    const weekDates = ref([])
    const attendance = reactive({})
    const inputId = ref('')
    const selectedStatus = ref('Present') // Default selection
    const showDialog = ref(false) // Controls pop-up visibility

    const fetchUsers = async () => {
      const { data, error } = await supabase.from('users').select('id, last_name')
      if (error) {
        console.error('Error fetching users:', error)
      } else {
        users.value = data
      }
    }

    const calculateWeekDates = () => {
      const today = new Date()
      const currentDay = today.getDay() // 0 (Sunday) - 6 (Saturday)
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - currentDay) // Move to last Sunday

      weekDates.value = []
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek)
        date.setDate(startOfWeek.getDate() + i)
        weekDates.value.push(date.toISOString().split('T')[0]) // Store as YYYY-MM-DD
      }
    }

    const fetchAttendance = async () => {
      if (!weekDates.value.length) return

      const { data, error } = await supabase
        .from('attendance')
        .select('user_id, date, status')
        .in('date', weekDates.value)

      if (error) {
        console.error('Error fetching attendance:', error)
        return
      }

      users.value.forEach((user) => {
        if (!attendance[user.id]) {
          attendance[user.id] = {}
        }
        weekDates.value.forEach((date) => {
          attendance[user.id][date] = null
        })
      })

      data.forEach((record) => {
        if (!attendance[record.user_id]) {
          attendance[record.user_id] = {}
        }
        attendance[record.user_id][record.date] = record.status
      })

      console.log('Attendance Data:', JSON.parse(JSON.stringify(attendance)))
    }

    const markAttendance = async () => {
      const userId = inputId.value.trim()
      const now = new Date()
      now.setHours(now.getHours() + 8) // ✅ Adjust to UTC+8
      const today = now.toISOString().split('T')[0] // Store as YYYY-MM-DD

      if (!userId) {
        alert('Please enter a valid User ID.')
        return
      }

      // ✅ Insert attendance with selected status
      const { error: insertError } = await supabase
        .from('attendance')
        .insert([{ user_id: userId, status: selectedStatus.value, date: today }])

      if (insertError) {
        console.error('Error inserting attendance:', insertError)
      } else {
        if (!attendance[userId]) {
          attendance[userId] = {}
        }
        attendance[userId][today] = selectedStatus.value

        alert('Attendance marked successfully!')
      }

      inputId.value = ''
      showDialog.value = false
      await fetchAttendance() // Refresh data after inserting
    }

    const sortedUsers = computed(() => {
      return [...users.value].sort((a, b) => a.last_name.localeCompare(b.last_name))
    })

    const isPresent = (userId, date) => attendance[userId]?.[date] === 'Present'
    const isExcused = (userId, date) => attendance[userId]?.[date] === 'Excused'
    const isAbsent = (userId, date) => attendance[userId]?.[date] === 'Absent'

    const formatDate = (date) =>
      new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(
        new Date(date),
      )
    const getDayName = (date) =>
      new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date(date))

    onMounted(async () => {
      await fetchUsers()
      calculateWeekDates()
      await fetchAttendance()
    })

    return {
      role,
      firstName,
      users,
      weekDates,
      attendance,
      inputId,
      selectedStatus,
      showDialog,
      markAttendance,
      sortedUsers,
      isPresent,
      isExcused,
      isAbsent,
      formatDate,
      getDayName,
    }
  },
}
</script>

<style scoped>
.container-with-footer {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 80px;
}

.top-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.legend {
  display: flex;
  gap: 15px;
}

.table-container {
  max-height: 50vh;
  overflow-y: auto;
}

.centered-header,
.centered-cell {
  text-align: center;
}

.checkmark {
  color: green;
}
.excused {
  color: blue;
}
.absent {
  color: red;
}

.footer-bar {
  position: sticky;
  bottom: 0;
  width: 100%;
  background-color: #f8f9fa;
  text-align: center;
  padding: 10px 0;
  z-index: 10;
}
</style>
