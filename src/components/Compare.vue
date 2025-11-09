<template>
    <div class="container mt-5">
        <h1 class="mb-4">Compare your movies</h1>

        <div v-if="loading" class="text-center my-5">
            <Spinner />
        </div>

        <div v-else-if="error" class="alert alert-danger text-center">
            <span>{{ error }}</span> -
            <router-link to="/" class="text-dark fw-bold text-decoration-none">Go home</router-link>
        </div>

        <div v-else-if="selectedMovies.length" class="d-flex flex-wrap gap-3 justify-content-center">
            <div v-for="(movie, index) in selectedMovies" :key="index" class="card shadow-sm" style="width: 300px">
                <img :src="getPosterUrl(movie.poster_path)" class="card-img-top" :alt="movie.title"
                    style="height: 450px; object-fit: cover" />
                <div class="card-body">
                    <h5 class="card-title">{{ movie.title }} ({{ getYear(movie.release_date) }})</h5>
                    <p class="card-text text-muted">{{ movie.tagline || 'No tagline available.' }}</p>
                    <p class="mb-2">
                        <strong>Score:</strong>
                        <span class="badge bg-warning text-dark">{{ movie.vote_average?.toFixed(1) }}</span>
                        / 10
                    </p>
                    <p><strong>Runtime:</strong> {{ movie.runtime }} min</p>
                    <p><strong>Genres:</strong>
                        <span v-for="genre in movie.genres" :key="genre.id" class="badge bg-secondary me-1">
                            {{ genre.name }}
                        </span>
                    </p>
                    <p class="mt-3"><strong>Synopsis:</strong> {{ movie.overview }}</p>
                </div>
            </div>
        </div>

        <div v-else class="alert alert-info text-center">
            No movies selected for comparison.
        </div>
    </div>
</template>

<script>
import { useAuthStore } from "../stores/authStore";
import movieService from "../services/movies";
import Spinner from "./Spinner.vue";

const BASE_IMAGE_URL = import.meta.env.VITE_IMG_BASE_URL;

export default {
    name: "Compare",
    components: {
        Spinner,
    },
    data() {
        return {
            authStore: useAuthStore(),
            selectedMovies: [],
            loading: true,
            error: null,
        };
    },
    methods: {
        async fetchDetails() {
            this.loading = true;
            this.error = null;

            try {
                const selected = this.authStore.getSelectedMovies;
                const promises = selected.map((m) => movieService.getMovieDetails(m.id));
                this.selectedMovies = await Promise.all(promises);
            } catch (err) {
                console.error("Error fetching movie details:", err);
                this.error = "Could not load comparison data.";
            } finally {
                this.loading = false;
            }
        },
        getPosterUrl(path) {
            return path
                ? `${BASE_IMAGE_URL}${path}`
                : "https://via.placeholder.com/500x750/333/FFFFFF?text=Sin+Poster";
        },
        getYear(date) {
            return date ? new Date(date).getFullYear() : "N/A";
        },
    },
    mounted() {
        this.fetchDetails();
    },
};
</script>
