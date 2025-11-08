<template>
  <div
    class="d-flex flex-column flex-lg-row align-items-center justify-content-center gap-4 mt-5"
  >
    <div class="text-center text-lg-start">
      <h1 class="title">
        Houston, we have a
        <span class="text-danger text-decoration-underline">problem</span>
      </h1>
      <p class="fs-4 fw-semibold">
        The page you were looking for could not be found.
      </p>

      <p class="fs-5">
        Go back to the
        <router-link to="/" class="text-primary fw-bold">homepage</router-link>.
      </p>
    </div>
    <img src="../assets/not-found.svg" class="" alt="Not found" />
  </div>
</template>
<script>
export default {
  name: "NotFound",
};
</script>
<style scoped>
.title {
  font-size: 3rem;
  font-weight: bold;
}

img {
  width: 100%;
}

@media (min-width: 992px) {
  .title {
    font-size: 5rem;
  }
  img {
    width: 50%;
  }
}


</style>
