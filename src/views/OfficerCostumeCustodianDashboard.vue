<template>
  <div>
    <NavBar :role="role" />
    <Notification />
    <Attendance :view="'self'" />
    <Payments :view="'self'" />
    <BorrowedCostumes :view="'self'" />
    <EventScheduler />
    <MemberData />
  </div>
</template>

<script>
import NavBar from './NavBar.vue'
import Notification from './NotificationVue.vue'
import Attendance from './AttendanceVue.vue'
import Payments from './PaymentsVue.vue'
import BorrowedCostumes from './BorrowedCostumes.vue'
import EventScheduler from './EventScheduler.vue'
import MemberData from './MemberData.vue'

export default {
  components: {
    NavBar,
    Notification,
    Attendance,
    Payments,
    BorrowedCostumes,
    EventScheduler,
    MemberData,
  },
  data() {
    return {
      role: 'Officer',
      position: 'President',
    }
  },
}
</script>
