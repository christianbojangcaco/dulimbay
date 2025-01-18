<template>
  <div>
    <h3>Payments</h3>
    <div v-if="view === 'self'">
      <!-- Self payments content -->
    </div>
    <div v-else>
      <!-- All payments content -->
    </div>
  </div>
</template>

<script>
export default {
  props: ['view'],
}
</script>
