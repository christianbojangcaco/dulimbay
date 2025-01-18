<template>
  <div>
    <NavBar :role="role" />
    <EventNotifications />
    <Attendance :view="'all'" />
    <Payments :view="'self'" />
    <BorrowedCostumes :view="'self'" />
    <EventScheduler />
    <MemberData />
    <BorrowedCostumeData />
    <ManageMembers />
  </div>
</template>

<script>
import NavBar from './NavBar.vue'
import EventNotifications from './NotificationVue.vue'
import Attendance from './AttendanceVue.vue'
import Payments from './PaymentsVue.vue'
import BorrowedCostumes from './BorrowedCostumes.vue'
import EventScheduler from './EventScheduler.vue'
import MemberData from './MemberData.vue'
import BorrowedCostumeData from './BorrowedCostumeData.vue'
import ManageMembers from './ManageMembers.vue'

export default {
  components: {
    NavBar,
    EventNotifications,
    Attendance,
    Payments,
    BorrowedCostumes,
    EventScheduler,
    MemberData,
    BorrowedCostumeData,
    ManageMembers,
  },
  data() {
    return {
      role: 'Admin',
      position: 'Choreographer',
    }
  },
}
</script>
