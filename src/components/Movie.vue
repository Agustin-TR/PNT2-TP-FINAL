<template>
    <div class="container mt-5">
        <div v-if="loading" class="text-center my-5">
            <Spinner />
        </div>

        <div v-else-if="error"
            class="d-flex flex-column flex-lg-row align-items-center justify-content-center gap-4 mt-5">
            <div class="text-center text-lg-start">
                <h1 class="title">
                    Houston, we have a
                    <span class="text-danger text-decoration-underline">problem</span>
                </h1>

                <p class="fs-4 fw-semibold">
                    There was an error loading the movie details.
                </p>

                <p class="fs-5 text-muted mb-4">{{ error }}</p>

                <button class="btn btn-outline-danger btn-lg rounded-pill px-4" @click="fetchMovieDetails">
                    Retry
                </button>
            </div>

            <img src="../assets/movie-not-found.svg" class="img-fluid" alt="Movie not found" />
        </div>

        <div v-else-if="movie" class="row border-100 shadow-lg rounded p-4 h-100"
            style="background: linear-gradient(135deg, #f8f9fa, #e9ecef);">
            <div class="col-md-4 mb-4">
                <img :src="posterUrl" class="img-fluid rounded shadow-lg" :alt="movie.title" />
            </div>

            <div class="col-md-8">
                <h1 class="display-4">{{ movie.title }} ({{ releaseYear }})</h1>
                <p class="lead text-muted">{{ movie.tagline }}</p>

                <hr />
                <div class="movie-info text-start">
                    <h4 class="fw-semibold mb-2">
                        ⭐ Score:
                        <span :class="scoreBadgeClass">
                            {{ movie.vote_average.toFixed(1) }}
                        </span>
                    </h4>

                    <h5 class="fw-semibold mb-3">
                        🎭 Genres:
                        <span v-for="genre in movie.genres" :key="genre.id" class="badge bg-secondary me-2">
                            {{ genre.name }}
                        </span>
                    </h5>

                    <h5 class="fw-semibold mb-3">
                        ⏱️ Runtime:
                        <span class="text-muted">{{ movie.runtime }} min</span>
                    </h5>

                    <h4 class="mt-4 mb-2">🎬 Synopsis</h4>
                    <p class="lead" style="line-height: 1.6;">
                        {{ movie.overview }}
                    </p>
                </div>

                <section class="container">
                    <div class="row align-items-center">
                        <div class="col-4">
                            <button v-show="isAuthenticated" class="btn btn-sm w-100"
                                :class="isInWatchlist ? 'btn-success' : 'btn-primary'"
                                @click.stop="toggleWatchlist(movie.id)">{{ isInWatchlist ? "✅ In Watchlist" :
                                "+ Watchlist" }}
                            </button>
                        </div>
                        <div class="col-4">
                            <button v-show="isAuthenticated" class="btn btn-sm w-100"
                                :class="isFavoriteMovie(movie.id) ? 'btn-success' : 'btn-primary'"
                                @click.stop="toggleFavs(movie.id)">
                                {{ isFavoriteMovie(movie.id) ? "❤️" : "+ ♡" }}
                            </button>
                        </div>
                    </div>
                </section>
                <hr v-show="isAuthenticated" />
                <section v-show="isAuthenticated" class="container">
                    <h4 class="mb-3">Rate this movie</h4>

                    <p v-if="userRating > 0" class="text-success small mb-2">
                        ✓ You rated this movie {{ userRating }}/10
                    </p>

                    <div class="rating-stars-emoji">
                        <input type="radio" id="star10" name="rating" value="10" v-model="userRating"
                            @change="handleRatingSubmit" />
                        <label for="star10" title="10 stars">⭐</label>
                        <input type="radio" id="star9" name="rating" value="9" v-model="userRating"
                            @change="handleRatingSubmit" />
                        <label for="star9" title="9 stars">⭐</label>
                        <input type="radio" id="star8" name="rating" value="8" v-model="userRating"
                            @change="handleRatingSubmit" />
                        <label for="star8" title="8 stars">⭐</label>
                        <input type="radio" id="star7" name="rating" value="7" v-model="userRating"
                            @change="handleRatingSubmit" />
                        <label for="star7" title="7 stars">⭐</label>
                        <input type="radio" id="star6" name="rating" value="6" v-model="userRating"
                            @change="handleRatingSubmit" />
                        <label for="star6" title="6 stars">⭐</label>
                        <input type="radio" id="star5" name="rating" value="5" v-model="userRating"
                            @change="handleRatingSubmit" />
                        <label for="star5" title="5 stars">⭐</label>
                        <input type="radio" id="star4" name="rating" value="4" v-model="userRating"
                            @change="handleRatingSubmit" />
                        <label for="star4" title="4 stars">⭐</label>
                        <input type="radio" id="star3" name="rating" value="3" v-model="userRating"
                            @change="handleRatingSubmit" />
                        <label for="star3" title="3 stars">⭐</label>
                        <input type="radio" id="star2" name="rating" value="2" v-model="userRating"
                            @change="handleRatingSubmit" />
                        <label for="star2" title="2 stars">⭐</label>
                        <input type="radio" id="star1" name="rating" value="1" v-model="userRating"
                            @change="handleRatingSubmit" />
                        <label for="star1" title="1 star">⭐</label>
                    </div>
                </section>
                <hr v-show="isAuthenticated" />
                <section v-show="isAuthenticated" class="container">
                    <h4 class="mb-3">Leave a comment 💬</h4>

                    <!-- mostrar comentario existente -->
                    <div v-if="existingComment" class="alert alert-info mb-3">
                        <strong>Your current comment:</strong>
                        <p class="mb-2 mt-2">{{ existingComment }}</p>
                        <button class="btn btn-sm btn-outline-danger" @click="handleDeleteComment">
                            Delete my comment
                        </button>
                    </div>

                    <form @submit.prevent="handleCommentSubmit">
                        <div class="mb-3">
                            <textarea v-model="newComment" class="form-control" rows="4"
                                :placeholder="existingComment ? 'Update your review...' : 'Write your review of this movie...'"
                                required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Send comment</button>
                    </form>
                </section>
                <hr />
                <button class="btn btn-lg btn-outline-primary mt-3" @click="$router.go(-1)">
                    ← Back
                </button>
            </div>

            <div v-if="allReviews?.length" class="mt-5">
                <h2 class="mb-4">Reviews ({{ allReviews.length }}) 📢</h2>

                <div class="row g-3">
                    <div v-for="review in allReviews" :key="review.id" class="col-12 col-md-6 col-lg-4">
                        <div class="card h-100 shadow-sm border-0">
                            <div class="card-body d-flex align-items-start">
                                <img v-if="review.author_details?.avatar_path"
                                    :src="getAvatarUrl(review.author_details.avatar_path)" alt="Avatar"
                                    class="rounded-circle me-3 flex-shrink-0"
                                    style="width: 50px; height: 50px; object-fit: cover" />
                                <img v-else :src="userAvatar" alt="Default Avatar"
                                    class="rounded-circle me-3 flex-shrink-0"
                                    style="width: 50px; height: 50px; object-fit: cover" />

                                <div>
                                    <h6 class="fw-bold mb-1">{{ review.author }}</h6>
                                    <small class="text-muted d-block mb-2">
                                        {{ new Date(review.created_at).toLocaleDateString() }}
                                    </small>
                                    <p class="small text-secondary mb-0 text-truncate-3">
                                        {{ review.content }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="alert alert-info text-center">
            No movie found with ID {{ $route.params.id }}.
        </div>
    </div>
</template>

<script>
import { useAuthStore } from "../stores/authStore";
import { mapState } from "pinia";
import { useFavoritesStore } from "../stores/favoritesStore"
import Spinner from "./Spinner.vue";
import movieService from "../services/movies";
import userAvatar from "../assets/user.svg";
import WatchlistService from "../services/watchlist";

const BASE_IMAGE_URL = import.meta.env.VITE_IMG_BASE_URL;

export default {
    name: "Movie",
    setup() {
        const authStore = useAuthStore();
        return { userAvatar, BASE_IMAGE_URL, authStore };
    },
    components: {
        Spinner,
    },
    props: ["id"],
    data() {
        return {
            movie: { reviews: [] },
            localReviews: [],
            loading: true,
            error: null,
            watchlist: [],
            isInWatchlist: false, // <-- FIXED: local state for async check
            userRating: 0,
            newComment: '',
            existingComment: '',
        };
    },
    computed: {
        userId() {
            return this.authStore.user ? this.authStore.user.id : null;
        },
        ...mapState(useAuthStore, ["isAuthenticated", "user"]),
        releaseYear() {
            return this.movie?.release_date
                ? new Date(this.movie.release_date).getFullYear()
                : "N/A";
        },
        posterUrl() {
            return this.movie?.poster_path
                ? `${BASE_IMAGE_URL}${this.movie.poster_path}`
                : "https://via.placeholder.com/500x750/333/FFFFFF?text=Sin+Poster";
        },
        scoreBadgeClass() {
            const score = this.movie?.vote_average || 0;
            if (score < 4)
                return "badge bg-danger text-light"; // 🔴 Red for poor
            if (score < 7)
                return "badge bg-warning text-dark"; // 🟡 Yellow for average
            if (score < 9)
                return "badge bg-success text-light"; // 🟢 Green for good
            return "badge bg-gradient text-light";  // 💎 Gradient for amazing
        },
        favoritesStore() {
            return useFavoritesStore();
        },
        allReviews() {
            return [...this.localReviews, ...(this.movie.reviews || [])];
        },
        isFavoriteMovie() {
            return (movieId) => this.favoritesStore.isFavorite(movieId);
        },
    },
    methods: {
        async fetchMovieDetails() {
            this.loading = true;
            this.error = null;
            const movieId = this.id || this.$route.params.id;
            console.log("🧉 ~ movieId ➡️ ", movieId)

            if (!movieId) {
                this.error = "Movie ID not provided.";
                this.loading = false;
                return;
            }

            try {
                this.movie = await movieService.getMovieDetails(movieId);
            } catch (err) {
                console.error("Could not fetch movie details:", err);
                this.error = "Could not load movie details.";
            } finally {
                this.loading = false;
            }
        },

        async fetchMovieReviews() {
            const movieId = this.id || this.$route.params.id;
            if (!movieId) return;

            try {
                const reviews = await movieService.getMovieReviews(movieId);
                this.movie.reviews = reviews.results;
            } catch (err) {
                console.error("Could not fetch movie reviews:", err);
                this.movie.reviews = [];
            }
        },

        getAvatarUrl(path) {
            if (!path) return null;
            if (path.startsWith("/https")) return path.substring(1);
            return `${BASE_IMAGE_URL}${path}`;
        },
        async toggleWatchlist(movieId) {
            const movieIdStr = String(movieId);

            try {
                if (this.isInWatchlist) {
                    await WatchlistService.removeFromWatchlist(movieIdStr);
                    this.isInWatchlist = false; // Actualiza el estado reactivo

                } else {
                    await WatchlistService.addToWatchlist(movieIdStr);
                    this.isInWatchlist = true; // Actualiza el estado reactivo
                }
            } catch (error) {
                console.error(`Error toggling watchlist for movie ${movieId}:`, error);
                alert(`Could not update watchlist: ${error.message}`);
            }
        },
        async toggleFavs(movieId) {
            if (!this.userId) {
                alert("Please log in to add items to your favorites.");
                return;
            }
            try {
                await this.favoritesStore.toggleFavorite(this.userId, movieId);
            } catch (err) {
                console.error('Error toggling favorites:', err);
                alert(`Could not update favorites: ${err.message}`);
            }
        },

        async handleCommentSubmit() {
            if (!this.userId) {
                alert("Please log in to leave a comment.");
                return;
            }
            if (!this.newComment.trim()) {
                alert('The comment cannot be empty..');
                return;
            }

            try {
                await this.favoritesStore.setComment(this.movie.id, this.newComment);

                const newReview = {
                    id: `local_${Date.now()}`,
                    author: this.authStore.user?.firstName + " " + this.authStore.user?.lastName || this.authStore.user?.email || 'Anonymous',
                    content: this.newComment.trim(),
                    created_at: new Date().toISOString(),
                    author_details: {
                        avatar_path: null,
                        rating: this.userRating || null
                    }
                };

                // si ya existe un comentario del usuario, reemplazarlo
                const existingIndex = this.localReviews.findIndex(r => r.id.startsWith('local_'));
                if (existingIndex !== -1) {
                    this.localReviews[existingIndex] = newReview;
                } else {
                    this.localReviews.unshift(newReview);
                }

                // actualizar el comentario existente
                this.existingComment = this.newComment.trim();
                this.newComment = '';

                alert(existingIndex !== -1 ? 'Comment updated successfully!' : 'Comment added successfully!');

            } catch (err) {
                console.error('Error adding comment:', err);
                alert('Could not add comment. Please try again.');
            }
        },

        async handleDeleteComment() {
            if (!this.userId) {
                alert("Please log in to delete a comment.");
                return;
            }

            if (!confirm('Are you sure you want to delete your comment?')) {
                return;
            }

            try {
                await this.favoritesStore.deleteComment(this.movie.id);

                // eliminar review 
                this.localReviews = this.localReviews.filter(r => !r.id.startsWith('local_'));

                this.existingComment = '';
                this.newComment = '';

                alert('Comment deleted successfully!');
            } catch (err) {
                console.error('Error deleting comment:', err);
                alert('Could not delete comment. Please try again.');
            }
        },

        async handleRatingSubmit() {
            console.log('El usuario puntuó con:', this.userRating, 'estrellas');
            if (!this.userId) {
                alert("Please log in to rate this movie.");
                return;
            };

            try {
                await this.favoritesStore.setRating(this.userId, this.movie.id, parseInt(this.userRating));
                alert('Thank you for your rating!');
            } catch (err) {
                console.error('Error submitting rating:', err);
                alert(`Could not update your rating: ${err.message}`);
            }
        },

        async loadUserRatingAndComment() {
            if (!this.userId || !this.movie?.id) return;

            try {
                // Cargar rating existente
                const rating = this.favoritesStore.getRating(this.movie.id);
                if (rating !== null) {
                    this.userRating = rating;
                }

                // Cargar comentario existente
                const comment = this.favoritesStore.getComment(this.movie.id);
                if (comment) {
                    this.existingComment = comment;

                    // Crear review local para mostrar en la lista
                    const localReview = {
                        id: `local_${this.userId}`,
                        author: this.authStore.user?.firstName + " " + this.authStore.user?.lastName || 'You',
                        content: comment,
                        created_at: new Date().toISOString(),
                        author_details: {
                            avatar_path: null,
                            rating: this.userRating || null
                        }
                    };

                    this.localReviews = [localReview];
                }
            } catch (err) {
                console.error('Error loading user rating and comment:', err);
            }
        },

    },
    watch: {
        '$route.params.id': {
            immediate: false,
            async handler(newId) {
                console.log("🔄 Route changed, loading new movie:", newId);

                this.loading = true;
                this.error = null;

                await this.fetchMovieDetails();
                await this.fetchMovieReviews();

                if (this.userId) {
                    this.isInWatchlist = await WatchlistService.isInWatchlist(
                        //this.userId,
                        String(this.movie.id)
                    );

                    await this.favoritesStore.loadFavorites(this.userId);
                    await this.loadUserRatingAndComment();
                }

                this.loading = false;
            }
        }

    },
    async mounted() {
        await this.fetchMovieDetails();
        await this.fetchMovieReviews();

        if (this.userId && this.movie?.id) {

            this.isInWatchlist = await WatchlistService.isInWatchlist(
                //this.userId,
                String(this.movie.id)
            );
        }

        if (this.userId) {
            await this.favoritesStore.loadFavorites(this.userId);
            await this.loadUserRatingAndComment();
        }
    },
};
</script>


<style scoped>
.rounded {
    border-radius: 0.5rem;
}

.title {
    font-size: 3rem;
    font-weight: bold;
}

img {
    width: 100%;
}

@media (min-width: 992px) {
    .title {
        font-size: 4.5rem;
    }

    img {
        width: 50%;
    }
}

.card {
    border-radius: 1px;
    border-color: black;
}

.text-truncate-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.rating-stars-emoji {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
    cursor: pointer;
}

.rating-stars-emoji input[type="radio"] {
    display: none;
}

.rating-stars-emoji label {
    font-size: 2rem;
    margin: 0 0.1em;
    opacity: 0.3;
    transition: opacity 0.2s;
}

/* Efecto hover y "checked" (seleccionado):
    Cuando pasas el mouse (hover) O cuando está seleccionada (checked),
    la estrella y todas las anteriores se vuelven sólidas.
    */
.rating-stars-emoji:not(:hover) input[type="radio"]:checked~label,
.rating-stars-emoji:hover input[type="radio"]:hover~label,
.rating-stars-emoji label:hover~label {
    opacity: 1;
    /* <-- 3. ESTADO "LLENO" (sólido) */
}

/* Estilo individual para la estrella sobre la que estás
    o la que ya está seleccionada.*/
.rating-stars-emoji input[type="radio"]:checked+label,
.rating-stars-emoji label:hover {
    opacity: 1;
}
</style>