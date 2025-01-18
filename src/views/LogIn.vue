<template>
  <v-app>
    <v-main class="app-main">
      <div class="header-section">
        <h1 class="header-title">DULIMBAY</h1>
      </div>
      <v-container fluid fill-height class="d-flex align-center justify-center main-container">
        <v-row class="full-height">
          <v-col cols="4" class="d-flex align-center justify-center login-section">
            <v-card class="login-card">
              <v-card-text>
                <v-form @submit.prevent="login">
                  <v-text-field v-model="email" label="ID" required></v-text-field>
                  <v-text-field
                    v-model="password"
                    label="Password"
                    type="password"
                    required
                  ></v-text-field>
                  <v-btn color="maroon" block class="login-btn" type="submit"> Login </v-btn>
                  <div class="signup-link">
                    <p>
                      Don't have an account?
                      <a @click="navigateToSignUp" class="signup-link-hover">Sign Up Here</a>
                    </p>
                  </div>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="8" class="d-flex align-start justify-start carousel-section right-container">
            <div class="carousel-background" ref="carouselBackground"></div>
            <div class="carousel-highlight carousel-description">
              <h1>Welcome to <strong>Dulimbay's Website</strong>!</h1>
              <h3>
                Here, you can stay updated on event schedules, payments, and attendance. Login to
                keep track of all the exciting activities and important announcements!
              </h3>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <v-footer class="footer-section">
        <div class="footer-content">&copy; 2025 Dulimbay</div>
        <div class="">
          <h3 class="typing-effect">
            <span class="typed-text"></span>
          </h3>
        </div>
        <div class="footer-contact">
          Contact:
          <a href="mailto:dulimbay@example.com">
            <img src="/images/gmail.png" alt="Gmail" class="footer-logo" />
          </a>
          <span class="separator"> | </span>
          <a href="https://facebook.com/dulimbay" target="_blank">
            <img src="/images/fb.png" alt="Facebook" class="footer-logo" />
          </a>
          <span class="separator"> | </span>
          <a href="https://facebook.com/dulimbaypage" target="_blank">
            <img src="/images/fbpage.png" alt="Facebook Page" class="footer-logo" />
          </a>
        </div>
      </v-footer>
    </v-main>
  </v-app>
</template>

<script>
import { supabase } from '@/router/supabaseClient'

export default {
  data() {
    return {
      email: '',
      password: '',
      images: ['/images/dtag1.jpg', '/images/dtag2.jpg', '/images/dtag3.jpg'],
      currentIndex: 0,
      nextIndex: 1,
    }
  },
  mounted() {
    this.startCarousel()
    this.startTyping()
  },
  methods: {
    async login() {
      try {
        const { user, error } = await supabase.auth.signInWithPassword({
          email: this.email,
          password: this.password,
        })

        if (error || !user) {
          alert('Invalid ID or password.')
        } else {
          alert(`Welcome, ${user.email}!`)
          localStorage.setItem('userId', user.id)
          this.$router.push('/dashboard')
        }
      } catch (err) {
        console.error('Login error:', err)
        alert('An unexpected error occurred.')
      }
    },
    navigateToSignUp() {
      this.$router.push('/signup')
    },
    startCarousel() {
      setInterval(() => {
        this.nextIndex = (this.currentIndex + 1) % this.images.length
        const backgroundContainer = this.$refs.carouselBackground
        backgroundContainer.classList.remove('scroll-animation')
        void backgroundContainer.offsetWidth
        backgroundContainer.style.backgroundImage = `url(${this.images[this.nextIndex]})`
        backgroundContainer.classList.add('scroll-animation')
        this.currentIndex = this.nextIndex
      }, 5000)
    },
    startTyping() {
      const element = document.querySelector('.typed-text')
      const phrases = ['WE SING!', 'WE ACT!', 'WE DANCE!']
      let phraseIndex = 0

      const changeText = () => {
        element.textContent = phrases[phraseIndex]
        element.classList.remove('fade-in-out')
        void element.offsetWidth
        element.classList.add('fade-in-out')

        phraseIndex = (phraseIndex + 1) % phrases.length
      }

      changeText()
      setInterval(changeText, 1000)
    },
  },
}
</script>

<style>
/* General Reset */
html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Flexible Containers */
.main-container {
  height: calc(100vh - 100px - 90px); /* Adjust for header and footer */
  margin: 0;
  padding: 0;
}

.full-height {
  height: 100%;
}

/* Header */
.header-section {
  background: url('/images/Header-Footer-Background.jpg') no-repeat center;
  background-size: cover;
  color: white;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.header-title {
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
  font-size: 3rem; /* Enlarged title */
}

/* Footer */
.footer-section {
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

.footer-contact img {
  width: 24px;
  height: 24px;
  margin: 0 5px;
  vertical-align: middle;
}

/* Login Section */
.login-section {
  background: url('/images/Loginback.jpg') no-repeat center center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  width: 350px; /* Fixed width */
  max-width: 90%; /* Responsive constraint */
  height: auto; /* Dynamic height */
  padding: 20px; /* Inner spacing */
  border-radius: 8px; /* Rounded corners */
  box-shadow: 4px 0px 8px rgba(0, 0, 0, 0.4);
}

.login-btn {
  font-size: 14px; /* Smaller button font size */
  padding: 8px 10px; /* Reduce button size */
  background-color: maroon; /* Change button color to maroon */
  color: white; /* Ensure text color is white */
}

.signup-link a.signup-link-hover {
  color: maroon;
  text-decoration: none;
}

.signup-link a.signup-link-hover:hover {
  text-decoration: underline;
  cursor: pointer;
}

/* Carousel Section */
.carousel-section {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 20px; /* Adjust padding to move content inward */
}

.carousel-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: top center; /* Always start from the top */
  filter: blur(1px); /* Add blur effect to background */
  overflow-y: hidden; /* Hide vertical scroll bar */
}

.scroll-animation {
  animation: scroll 5s linear infinite;
}

@keyframes scroll {
  0% {
    background-position: top center;
  }
  100% {
    background-position: bottom center;
  }
}

.carousel-highlight {
  z-index: 1; /* Ensure text is above the blurred background */
  text-align: center;
  padding: 10px;
}

.carousel-description {
  background-color: rgba(0, 0, 0, 0.5); /* Added semi-transparent background */
  border-radius: 8px;
  word-wrap: break-word;
  color: white;
  text-shadow: 2px 2px 4px black; /* Added black outline to text */
  line-height: 1.5;
  word-break: break-word;
}

/* Typing Effect */
.typed-text {
  opacity: 0;
  transition: opacity 1.5s ease-in-out;
}

.fade-in-out {
  opacity: 1;
}
</style>
