<template>
  <div>
    <h3>Notifications</h3>
    <div v-for="notification in notifications" :key="notification.id">
      {{ notification.title }} - {{ notification.date }}
    </div>
  </div>
</template>

<script>
import { supabase } from '@/router/supabaseClient'

export default {
  data() {
    return {
      notifications: [],
    }
  },
  async mounted() {
    const { data, error } = await supabase.from('events').select('*')
    if (error) {
      console.error('Error fetching notifications:', error)
    } else {
      this.notifications = data
    }
  },
}
</script>
