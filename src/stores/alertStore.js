import { ref } from "vue";

// Variables reactivas globales para el mensaje y el tipo de alerta

export const alertMessage = ref(null);
export const alertType = ref("info");

function showAlert(message, type = "info") {
  alertMessage.value = message;
  alertType.value = type;

  // Ocultar automáticamente después de 4s
  clearTimeout(showAlert._timeout);
  showAlert._timeout = setTimeout(() => (alertMessage.value = null), 4000);
}

// 🔹 Funciones específicas
export function showInfo(message) {
  showAlert(message, "info");
}

export function showSuccess(message) {
  showAlert(message, "success");
}

export function showWarning(message) {
  showAlert(message, "warning");
}

export function showError(message) {
  showAlert(message, "danger");
}
