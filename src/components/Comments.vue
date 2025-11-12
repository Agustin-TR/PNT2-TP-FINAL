<template>
  <div class="container mt-4">
    <h3>User Comments</h3>

    <table v-if="comments.length" class="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>Comment</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(comment, index) in comments" :key="comment.id">
          <td>{{ index + 1 }}</td>
          <td>{{ comment.text }}</td>
          <td>{{ comment.date }}</td>
        </tr>
      </tbody>
    </table>

    <div v-else class="alert alert-info mt-3">
      No comments found.
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/authStore";

export default {
  name: "Comments",
  data() {
    return {
      comments: [],
    };
  },
  methods: {
    loadComments() {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        alert("You must be logged in to view comments.");
        return;
      }
      // Load user comments from the store
      this.comments = authStore.user.comments || [];
    },
  },
  mounted() {
    this.loadComments();
  },
};
</script>

<style scoped>
.container {
  max-width: 700px;
}
</style>
