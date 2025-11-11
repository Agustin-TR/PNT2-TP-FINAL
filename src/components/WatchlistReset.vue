<template>
  <div>
    <!-- Trigger Button -->
    <button
      type="button"
      class="btn btn-danger"
      data-bs-toggle="modal"
      data-bs-target="#confirmResetModal"
    >
      Reset Watchlist
    </button>

    <!-- Modal -->
    <div
      class="modal fade"
      id="confirmResetModal"
      tabindex="-1"
      aria-labelledby="confirmResetModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="confirmResetModalLabel">
              Confirm Reset
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body">
            <p>Type <strong>RESET</strong> to confirm clearing your watchlist.</p>
            <input
              type="text"
              class="form-control"
              v-model="confirmationText"
              placeholder="Type RESET"
            />
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
              :disabled="confirmationText !== 'RESET'"
              @click="handleConfirm"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Emits an event to the parent
const emit = defineEmits(["confirmed"]);

const confirmationText = ref("");

// Handle confirmation logic
const handleConfirm = () => {
  const modalElement = document.getElementById("confirmResetModal");
  const modalInstance = bootstrap.Modal.getInstance(modalElement);
  modalInstance.hide();

  emit("confirmed", true); // ✅ Send confirmation to parent
  confirmationText.value = "";
};
</script>
