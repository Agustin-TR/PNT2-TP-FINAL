<template>
  <div>
    <!-- Trigger Button -->
    <button
      type="button"
      class="btn btn-danger"
      data-bs-toggle="modal"
      data-bs-target="#confirmResetModal"
    >
      Reset {{ counter }} Movies
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
              Read Carefully Before Confirming
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body">
            <p>Type <strong>RESET</strong> to confirm resetting your {{ counter }} movie watchlist to zero.</p>
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

<script>
import { ref } from "vue";

export default {
  name: "ConfirmResetModal",
  props: ['counter'],
};
</script>
    