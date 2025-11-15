<template>
  <div class="container mt-4">
    <!-- Tabs -->
    <ul class="nav nav-tabs">
      <li class="nav-item" v-for="tab in tabs" :key="tab">
        <button
          class="nav-link"
          :class="{ active: activeTab === tab }"
          :style="{ fontWeight: activeTab === tab ? 'bold' : 'normal' }"
          @click="setActiveTab(tab)"
          type="button"
        >
          {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
        </button>
      </li>
    </ul>

    <div class="tab-content mt-3">
      <!-- TAB: PROFILE -->
      <div v-if="activeTab === 'profile'">
        <Spinner v-if="loading" />
        <form v-else @submit.prevent="saveProfile" class="row g-3" novalidate>
          <div
            class="col-md-6"
            v-for="(value, key) in editableFields"
            :key="key"
          >
            <label :for="key" class="form-label">
              {{ key.charAt(0).toUpperCase() + key.slice(1) }}
            </label>
            <input
              :id="key"
              :type="
                key === 'email' ? 'email' : key === 'age' ? 'number' : 'text'
              "
              class="form-control"
              v-model.trim="profile[key]"
              required
            />
          </div>

          <div
            class="col-12 d-flex flex-column flex-lg-row gap-2 justify-content-between"
          >
            <button type="submit" class="btn btn-primary" :disabled="saving">
              {{ saving ? "Saving..." : "Save" }}
            </button>

            <button
              type="button"
              class="btn btn-danger"
              :disabled="deleting"
              @click="openDeleteModal"
            >
              {{ deleting ? "Deleting..." : "Delete" }}
            </button>
          </div>

          <div v-if="errorMessage" class="alert alert-danger mt-3">
            {{ errorMessage }}
          </div>
          <div v-if="successMessage" class="alert alert-success mt-3">
            {{ successMessage }}
          </div>
        </form>
      </div>
      <!-- TAB: WATCHLIST -->
      <div v-if="activeTab === 'watchlist'">
        <Spinner v-if="loading" />
        <Watchlist ref="watchlist" @counter="updateCounter" />
        <ConfirmResetModal :counter="counter" @confirmed="confirmed" />
      </div>

      <!-- Modal -->
      <div
        class="modal fade"
        id="deleteModal"
        tabindex="-1"
        aria-labelledby="deleteModalLabel"
        aria-hidden="true"
        ref="deleteModal"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="deleteModalLabel">
                Confirm Deletion
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                class="btn btn-danger"
                @click="confirmDelete"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap";
import { useAuthStore } from "@/stores/authStore";
import authService from "@/services/auth";
import Spinner from "./Spinner.vue";
import ConfirmResetModal from "./ConfirmResetModal.vue";
import Watchlist from "./Watchlist.vue";
import WatchlistService from "@/services/watchlist";

export default {
  name: "Profile",
  components: { Spinner, ConfirmResetModal, Watchlist },
  data() {
    return {
      activeTab: "profile",
      tabs: ["profile", "watchlist", "favorites", "reviews"],
      editableFields: {
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        age: null,
      },
      profile: {},
      watchlist: [],
      favorites: [],
      reviews: [],
      loading: false,
      saving: false,
      deleting: false,
      errorMessage: "",
      successMessage: "",
      modalInstance: null,
      authStore: useAuthStore(),
      counter: 0
    };
  },
  computed: {
    currentList() {
      if (this.activeTab === "watchlist") return this.watchlist;
      if (this.activeTab === "favorites") return this.favorites;
      if (this.activeTab === "reviews") return this.reviews;
      return [];
    },
  },
  methods: {
    updateCounter(newCount) {
        this.counter = newCount;
    },
    async confirmed(res) {
        console.log("🧉 ~ res ➡️ ", res)
        if (res) {
            const a = await WatchlistService.resetWatchlist();
            if(a){
                await this.reloadComponent();
            }            
        }
    },
    async reloadComponent() {
        Object.assign(this.$data, this.$options.data.call(this));
        await this.loadProfile();
        this.activeTab = "watchlist";
    },
    setActiveTab(tab) {
      this.activeTab = tab;
    },
    async loadProfile() {
      this.loading = true;
      try {
        const user = await authService.loadAccount();
        this.profile = { ...user };
      } catch (err) {
        this.errorMessage = err.message || "Failed to load profile.";
      } finally {
        this.loading = false;
      }
    },
    async saveProfile() {
      this.saving = true;
      this.errorMessage = "";
      this.successMessage = "";
      try {
        const updated = await authService.updateAccount(this.profile);
        this.profile = { ...updated };
        this.successMessage = "Profile updated successfully.";
      } catch (err) {
        this.errorMessage = err.message || "Failed to update profile.";
      } finally {
        this.saving = false;
      }
    },
    openDeleteModal() {
      const modalEl = this.$refs.deleteModal;
      this.modalInstance = new Modal(modalEl);
      this.modalInstance.show();
    },
    async confirmDelete() {
      this.deleting = true;
      try {
        await authService.deleteAccount();

        this.successMessage = "Account deleted successfully.";
        this.modalInstance.hide();

        setTimeout(() => {
          this.authStore.logout();
          this.$router.push("/");
        }, 2000);
      } catch (err) {
        this.errorMessage = err.message || "Failed to delete account.";
      } finally {
        this.deleting = false;
      }
    },
  },
  mounted() {
    this.loadProfile();
  },
  unmounted() {
    this.loadProfile();
  },
};
</script>

<style scoped>
.nav-tabs .nav-link {
  cursor: pointer;
}
</style>
