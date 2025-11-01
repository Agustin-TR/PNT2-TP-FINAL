<template>
  <div class="container">
    <div class="row justify-content-center mb-4">
      <div class="col-md-7 col-lg-6">
        <div class="card border-0 rounded-lg mt-5">
          <div class="card-body p-4 p-md-5">
            <form novalidate @submit.prevent="send()">
              <div class="mb-4">
                <label for="firstName" class="form-label fw-bold"
                  >First Name</label
                >
                <input
                  type="text"
                  id="firstName"
                  class="form-control form-control-lg"
                  :class="{
                    'is-invalid': firstNameError.show,
                    'is-valid': formDirty.firstName && firstNameError.isValid,
                  }"
                  v-model.trim="formData.firstName"
                  @input="formDirty.firstName = true"
                  placeholder="e.g., John"
                />
                <div v-if="firstNameError.show" class="invalid-feedback">
                  {{ firstNameError.message }}
                </div>
                <div
                  v-if="formDirty.name && firstNameError.isValid"
                  class="valid-feedback"
                >
                  Looks good!
                </div>
              </div>

              <div class="mb-4">
                <label for="lastName" class="form-label fw-bold"
                  >Last Name</label
                >
                <input
                  type="text"
                  id="lastName"
                  class="form-control form-control-lg"
                  :class="{
                    'is-invalid': lastNameError.show,
                    'is-valid': formDirty.lastName && lastNameError.isValid,
                  }"
                  v-model.trim="formData.lastName"
                  @input="formDirty.lastName = true"
                  placeholder="e.g., Doe"
                />
                <div v-if="lastNameError.show" class="invalid-feedback">
                  {{ lastNameError.message }}
                </div>
                <div
                  v-if="formDirty.lastName && lastNameError.isValid"
                  class="valid-feedback"
                >
                  Looks good!
                </div>
              </div>

              <div class="mb-4">
                <label for="email" class="form-label fw-bold">Email</label>
                <input
                  type="email"
                  id="email"
                  class="form-control form-control-lg"
                  :class="{
                    'is-invalid': emailError.show,
                    'is-valid': formDirty.email && emailError.isValid,
                  }"
                  v-model.trim="formData.email"
                  @input="formDirty.email = true"
                  placeholder="name@example.com"
                />
                <div v-if="emailError.show" class="invalid-feedback">
                  {{ emailError.message }}
                </div>
                <div
                  v-if="formDirty.email && emailError.isValid"
                  class="valid-feedback"
                >
                  Looks good!
                </div>
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
                    'is-invalid': passwordError.show,
                    'is-valid': formDirty.password && passwordError.isValid,
                  }"
                  v-model.trim="formData.password"
                  @input="formDirty.password = true"
                  placeholder="Create a strong password"
                />
                <div v-if="passwordError.show" class="invalid-feedback">
                  {{ passwordError.message }}
                </div>
                <div
                  v-if="formDirty.password && passwordError.isValid"
                  class="valid-feedback"
                >
                  Strong password!
                </div>
              </div>

              <div v-if="error" class="alert alert-danger">
                {{ error }}
              </div>

              <div class="d-grid mb-4">
                <button
                  class="btn btn-dark btn-lg"
                  :disabled="!canSend || isLoading"
                  type="submit"
                >
                  {{ isLoading ? "Creating Account..." : "Create Account" }}
                </button>
              </div>
            </form>

            <div class="text-center mt-4">
              <p class="text-muted">
                Already have an account?
                <router-link
                  to="/login"
                  class="text-dark fw-bold text-decoration-none"
                  >Sign In</router-link
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
import authService from "@/services/auth";

export default {
  name: "Signup",
  data() {
    return {
      formData: this.getInputs(),
      formDirty: this.getInputs(),
      submittedData: {},
      minNameChars: 5,
      maxNameChars: 15,
      minLastNameChars: 2,
      maxLastNameChars: 20,
      error: "",
      isLoading: false,
    };
  },
  methods: {
    getInputs() {
      return {
        firstName: null,
        lastName: null,
        email: "",
        password: null,
      };
    },
    async send() {
      if (!this.canSend) {
        Object.keys(this.formDirty).forEach((key) => {
          this.formDirty[key] = true;
        });
        this.error = "Please correct all errors in the form.";
        return;
      }

      this.isLoading = true;
      this.error = "";
      const data = { ...this.formData };

      try {
        const newUser = await authService.register(data);

        // Success
        this.submittedData = newUser;
        this.formData = this.getInputs();
        this.formDirty = this.getInputs();

        this.$router.push("/login");
      } catch (error) {
        this.error = error.message || "Registration failed. Please try again.";
        this.formData = this.getInputs();
        this.formDirty = this.getInputs();
      } finally {
        this.isLoading = false;
      }
    },
  },
  computed: {
    // All your computed properties were perfect and required no changes!
    firstNameError() {
      let msg = "";
      const firstName = this.formData.firstName;
      if (!firstName) msg = "This field is required";
      else if (firstName.length < this.minNameChars)
        msg = `The firstName must be at least ${this.minNameChars} characters`;
      else if (firstName.length > this.maxNameChars)
        msg = `The firstName cannot exceed ${this.maxNameChars} characters`;

      return {
        message: msg,
        show: msg !== "" && this.formDirty.firstName,
        isValid: msg === "",
      };
    },
    lastNameError() {
      let msg = "";
      const lastName = this.formData.lastName;
      if (!lastName) msg = "This field is required";
      else if (lastName.length < this.minLastNameChars)
        msg = `The last name must be at least ${this.minLastNameChars} characters`;
      else if (lastName.length > this.maxLastNameChars)
        msg = `The last name cannot exceed ${this.maxLastNameChars} characters`;

      return {
        message: msg,
        show: msg !== "" && this.formDirty.lastName,
        isValid: msg === "",
      };
    },
    passwordError() {
      let msg = "";
      const password = this.formData.password;

      if (!password) {
        msg = "This field is required";
      } else if (password.length < 8) {
        msg = "Must be at least 8 characters";
      } else if (!/[A-Z]/.test(password)) {
        msg = "Must include at least one uppercase letter";
      } else if (!/[a-z]/.test(password)) {
        msg = "Must include at least one lowercase letter";
      } else if (!/[0-9]/.test(password)) {
        msg = "Must include at least one number";
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        msg = "Must include at least one special symbol";
      }

      return {
        message: msg,
        show: msg !== "" && this.formDirty.password,
        isValid: msg === "",
      };
    },
    isValidEmail() {
      const email = this.formData.email;
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    },
    emailError() {
      let msg = "";
      if (!this.formData.email) msg = "This field is required";
      else if (!this.isValidEmail) msg = `Please enter a valid email address`;

      return {
        message: msg,
        show: msg !== "" && this.formDirty.email,
        isValid: msg === "",
      };
    },
    canSend() {
      return (
        this.firstNameError.isValid &&
        this.lastNameError.isValid &&
        this.emailError.isValid &&
        this.passwordError.isValid
      );
    },
  },
};
</script>

<style scoped></style>
