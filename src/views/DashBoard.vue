<template>
  <div>
    <NavBar :role="role" />
    <div v-if="role === 'Member'">
      <Notification />
      <Attendance :view="'self'" />
      <Payments :view="'self'" />
      <BorrowedCostumes :view="'self'" />
    </div>
    <div v-else-if="role === 'Officer' && position === 'Secretary'">
      <Notification />
      <Attendance :view="'all'" :editable="true" />
      <Payments :view="'self'" />
      <BorrowedCostumes :view="'self'" />
    </div>
    <div
      v-else-if="role === 'Officer' && (position === 'President' || position === 'Vice President')"
    >
      <Notification />
      <Attendance :view="'self'" />
      <Payments :view="'self'" />
      <BorrowedCostumes :view="'self'" />
      <EventScheduler />
      <MemberData />
    </div>
    <div v-else-if="role === 'Admin'">
      <Notification />
      <Attendance :view="'all'" />
      <Payments :view="'self'" />
      <BorrowedCostumes :view="'self'" />
      <EventScheduler />
      <MemberData />
      <BorrowedCostumeData />
      <ManageMembers />
    </div>
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
import BorrowedCostumeData from './BorrowedCostumeData.vue'
import ManageMembers from './ManageMembers.vue'

export default {
  components: {
    NavBar,
    Notification,
    Attendance,
    Payments,
    BorrowedCostumes,
    EventScheduler,
    MemberData,
    BorrowedCostumeData,
    ManageMembers,
  },
  props: ['role', 'position'],
}
</script>
