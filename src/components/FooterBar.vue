<template>
  <v-footer class="footer">
    <v-container fluid>
      <v-row justify="end" align="center" class="footer-row">
        <v-col cols="auto" class="font text-right">
          <span>&copy; DULIMBAY 2025</span>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: 'FooterBar',
}
</script>

<style scoped>
.footer {
  background: url('/images/Header-Footer-Background.jpg') no-repeat center;
  background-size: cover;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 33px 20px;
  position: fixed;
  bottom: 0;
  width: 100%;
  color: white;
}

.footer-row {
  height: 100%; /* Ensure row takes full height of footer */
  margin: 0; /* Remove margin */
  display: flex;
  align-items: center; /* Center vertically */
}

.font {
  margin: 0; /* Remove margin */
  font-weight: bold;
  text-align: right;
}
</style>
