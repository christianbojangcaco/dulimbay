<template>
  <div>
    <NavBar :role="role" :position="position" />
    <Notification />
    <Attendance :view="'self'" />
    <Payments :view="'self'" />
    <BorrowedCostumes :view="'self'" />
  </div>
</template>

<script>
import NavBar from './NavBar.vue'
import Notification from './NotificationVue.vue'
import Attendance from './AttendanceVue.vue'
import Payments from './PaymentsVue.vue'
import BorrowedCostumes from './BorrowedCostumes.vue'

export default {
  components: {
    NavBar,
    Notification,
    Attendance,
    Payments,
    BorrowedCostumes,
  },
  data() {
    return {
      role: 'Member',
      position: '',
    }
  },
}
</script>
