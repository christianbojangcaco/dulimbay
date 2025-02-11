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
                <v-btn @click="showDialog = true" color="primary">Mark Attendance</v-btn>
                <v-btn @click="showQRScanner = true" color="success">Scan QR Code</v-btn>
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
                      <th class="bold-header centered-header">Last Name</th>
                      <th v-for="date in weekDates" :key="date" class="bold-header centered-header">
                        <div class="bold-day">{{ getDayName(date) }}</div>
                        <div>{{ formatDate(date) }}</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in sortedUsers" :key="user.id">
                      <td class="bold-cell centered-cell">{{ user.last_name }}</td>
                      <td v-for="date in weekDates" :key="date" class="status-cell">
                        <span v-if="isPresent(user.id, date)" class="checkmark">✔️</span>
                        <span v-else-if="isExcused(user.id, date)" class="excused">➖</span>
                        <span v-else-if="isPastDate(user.id, date)" class="absent">❌</span>
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

    <!-- QR Code Scanner Dialog -->
    <v-dialog v-model="showQRScanner" max-width="500px">
      <v-card>
        <v-card-title>Scan QR Code</v-card-title>
        <v-card-text>
          <qrcode-stream
            @detect="onQRCodeScanned"
            @camera-on="onCameraReady"
            @camera-off="onCameraStopped"
          ></qrcode-stream>
          <v-alert v-if="scanError" type="error" dense>{{ scanError }}</v-alert>
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" @click="resetCamera">Reset Camera</v-btn>
          <v-btn color="grey" @click="showQRScanner = false">Close</v-btn>
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
import { QrcodeStream } from 'vue-qrcode-reader'

export default {
  components: {
    NavBar,
    FooterBar,
    QrcodeStream,
  },
  setup() {
    const role = ref('Admin')
    const firstName = ref('')
    const users = ref([])
    const weekDates = ref([])
    const attendance = reactive({})
    const showQRScanner = ref(false)
    const scanError = ref('')
    const scannerKey = ref(0) // Used to force re-render the scanner

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
      const currentDay = today.getDay()
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - currentDay)

      weekDates.value = []
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek)
        date.setDate(startOfWeek.getDate() + i)
        weekDates.value.push(date.toISOString().split('T')[0])
      }
    }

    const markAttendance = async (userId) => {
      const today = new Date().toISOString().split('T')[0]

      if (!userId) {
        scanError.value = 'Invalid QR Code. Please try again.'
        return
      }

      scanError.value = ''

      const { error } = await supabase
        .from('attendance')
        .upsert([{ user_id: userId, status: 'Present', date: today }], {
          onConflict: ['user_id', 'date'],
        })

      if (!error) {
        attendance[userId][today] = 'Present'
        alert('Attendance marked successfully!')
      } else {
        console.error('Error updating attendance:', error)
      }
    }

    const onQRCodeScanned = async (decodedResults) => {
      if (decodedResults.length > 0) {
        const userId = decodedResults[0].rawValue.trim()
        showQRScanner.value = false
        await markAttendance(userId)
      }
    }

    const resetCamera = () => {
      scannerKey.value += 1
      scanError.value = ''
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
        attendance[record.user_id][record.date] = record.status
      })
    }

    const onCameraReady = () => {
      scanError.value = ''
    }

    const onCameraStopped = () => {
      scanError.value = 'Camera stopped unexpectedly. Try resetting.'
    }

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
      showQRScanner,
      scanError,
      scannerKey,
      markAttendance,
      onQRCodeScanned,
      resetCamera,
      fetchAttendance,
      onCameraReady,
      onCameraStopped,
      sortedUsers: computed(() =>
        [...users.value].sort((a, b) => a.last_name.localeCompare(b.last_name)),
      ),
      isPresent: (userId, date) => attendance[userId]?.[date] === 'Present',
      isExcused: (userId, date) => attendance[userId]?.[date] === 'Excused',
      isPastDate: (userId, date) => new Date(date) < new Date() && !attendance[userId]?.[date],
      formatDate: (date) =>
        new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(date)),
      getDayName: (date) =>
        new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date(date)),
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
  margin-left: auto;
}

.bold-header,
.centered-header {
  text-align: center;
  font-weight: bold;
}

.bold-day {
  font-weight: bold;
}

.centered-cell {
  text-align: center;
}

.status-cell {
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
</style>
