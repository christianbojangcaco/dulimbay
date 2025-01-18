<template>
  <v-toolbar>
    <v-toolbar-title>App Name</v-toolbar-title>
    <v-spacer></v-spacer>
    <template v-if="role === 'Member'">
      <v-btn>Member Data</v-btn>
    </template>
    <template v-if="role === 'Officer' && position === 'Secretary'">
      <v-btn>Attendance Sheet</v-btn>
      <v-btn>QR Code Attendance</v-btn>
    </template>
    <template
      v-if="role === 'Officer' && (position === 'President' || position === 'Vice President')"
    >
      <v-btn>Events & Announcements</v-btn>
      <v-btn>Member Data</v-btn>
    </template>
    <template v-if="role === 'Admin'">
      <v-btn>Manage Members</v-btn>
      <v-btn>All Borrowed Costumes</v-btn>
      <v-btn>All Attendance</v-btn>
    </template>
  </v-toolbar>
</template>

<script>
export default {
  props: ['role', 'position'],
}
</script>
