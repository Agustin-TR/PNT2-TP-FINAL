<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-7 col-lg-6">
        <div class="card border-0 rounded-lg mt-5">
          <div class="card-body p-4 p-md-5">
            <form novalidate @submit.prevent="submit()">
              <div class="mb-4">
                <label for="email" class="form-label fw-bold"
                  >Email address</label
                >
                <input
                  type="email"
                  id="email"
                  class="form-control form-control-lg"
                  :class="{
                    'is-invalid': errorEmail.show,
                    'is-valid': formDirty.email && errorEmail.ok,
                  }"
                  v-model.trim="formData.email"
                  @input="formDirty.email = true"
                  placeholder="name@example.com"
                />
              </div>

              <div class="mb-4">
                <label for="password" class="form-label fw-bold"
                  >Password</label
                >
                <input
                  type="password"
                  id="password"
                  class="form-control form-control-lg"
                  :class="{
                    'is-invalid': errorPassword.show,
                    'is-valid': formDirty.password && errorPassword.ok,
                  }"
                  v-model.trim="formData.password"
                  @input="formDirty.password = true"
                  placeholder="Enter your password"
                />
              </div>

              <div class="mb-4">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="rememberMe"
                    v-model="formData.rememberMe"
                  />
                  <label class="form-check-label" for="rememberMe">
                    Remember me?
                  </label>
                </div>
              </div>

              <div v-if="errorMessage" class="alert alert-danger">
                {{ errorMessage }}
              </div>

              <div class="d-grid mb-4">
                <button
                  class="btn btn-dark btn-lg"
                  :disabled="!canSend"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>

            <div class="text-center mt-4">
              <p class="text-muted">
                Don't have an account?
                <router-link
                  to="/signup"
                  class="text-dark fw-bold text-decoration-none"
                  >Sign Up</router-link
                >
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/authStore";
import authService from "@/services/auth";

export default {
  name: "Login",
  data() {
    return {
      formData: this.getInputs(),
      formDirty: this.getInputs(),
      submittedData: {},
      errorMessage: null,
    };
  },
  methods: {
    getInputs() {
      return {
        password: null,
        email: "",
        rememberMe: false,
      };
    },
    async submit() {
      if (!this.canSend) return;

      this.errorMessage = null;

      const authStore = useAuthStore();

      const submitted = { ...this.formData };
      this.submittedData = submitted;

      this.formData = this.getInputs();
      this.formDirty = this.getInputs();

      try {
        const user = await authService.login(
          submitted.email,
          submitted.password,
          submitted.rememberMe
        );

        authStore.login(user);
        this.$router.push("/");
      } catch (error) {
        this.errorMessage = error.message || "Login failed. Please try again.";
      }
    },
    submissionEntries() {
      return Object.keys(this.submittedData).length === 0
        ? { message: "No info yet" } // Return an object for consistent display
        : this.submittedData;
    },
  },
  computed: {
    errorPassword() {
      let msg = "";
      const password = this.formData.password;

      // On a login form, we ONLY check if the field is empty.
      // All other complexity rules should be removed.
      if (!password) {
        msg = "Password is required";
      }

      return {
        message: msg,
        show: msg !== "" && this.formDirty.password,
        ok: msg === "",
      };
    },

    isValidEmail() {
      const email = this.formData.email;
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    },

    errorEmail() {
      let msg = "";
      if (!this.formData.email) msg = "Email is required";
      else if (!this.isValidEmail) msg = "Please enter a valid email address.";
      return {
        message: msg,
        show: msg != "" && this.formDirty.email,
        ok: msg == "",
      };
    },

    canSend() {
      return this.errorPassword.ok && this.errorEmail.ok;
    },
  },
};
</script>

<style scoped></style>
