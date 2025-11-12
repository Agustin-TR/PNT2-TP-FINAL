<template>
    <button v-if="counter === 1" type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#confirmResetModal"
    > Reset Movie</button>
    <button v-else-if="counter > 1" type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#confirmResetModal"
    > Reset Movies</button>

    <div>
        <div id="confirmResetModal" class="modal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Read Carefully BeforeD Confirming</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure you want to delete {{ counter }} movies from your watchlist?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="btnConfirm(false)">Close</button>
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="btnConfirm(true)">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
  name: "ConfirmResetModal",
  props: ['counter'],
  methods: {
    btnConfirm(value) {
        alert("Your watchlist has been reset.");
      this.$emit("confirmed", value);
    },
  },
};
</script>