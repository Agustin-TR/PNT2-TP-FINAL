<template>
    <div v-if="visible" class="alert alert-dismissible fade show" :class="alertClass" role="alert">
        {{ message }}
        <button type="button" class="btn-close" @click="hide"></button>
    </div>
</template>

<script>
    export default {
    name: "AlertMessage",
    props: {
        type: { type: String, default: "info" }, // info | success | warning | danger
        message: { type: String, default: "" },
    },
    data() {
        return { visible: true };
    },
    computed: {
        alertClass() {
        return {
            "alert-info": this.type === "info",
            "alert-success": this.type === "success",
            "alert-warning": this.type === "warning",
            "alert-danger": this.type === "danger",
        };
        },
    },
    methods: {
        hide() {
        this.visible = false;
        },
    },
    };
</script>
