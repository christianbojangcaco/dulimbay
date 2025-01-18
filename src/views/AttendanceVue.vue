<template>
  <div>
    <h3>Attendance</h3>
    <div v-if="view === 'self'">
      <!-- Self attendance content -->
    </div>
    <div v-else>
      <!-- All attendance content with editable option if applicable -->
    </div>
  </div>
</template>

<script>
export default {
  props: ['view', 'editable'],
}
</script>
