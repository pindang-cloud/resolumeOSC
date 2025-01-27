import { ref } from "vue";

export function useWebSocket() {
    const ws = ref(null);
    const isConnected = ref(false);

    const connectWebSocket = () => {
        if (ws.value) {
            ws.value.close();
        }

        ws.value = new WebSocket(`ws://${window.location.hostname}:8081`);

        ws.value.onopen = () => {
            console.log("WebSocket terhubung");
            isConnected.value = true;
        };

        ws.value.onclose = () => {
            console.log("WebSocket terputus");
            isConnected.value = false;
        };

        ws.value.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    };

    const sendMessage = (data) => {
        if (ws.value && isConnected.value) {
            ws.value.send(JSON.stringify(data));
        } else {
            console.warn("WebSocket belum terhubung!");
        }
    };

    // Menambahkan fungsi untuk mengirimkan OSC message
    const sendOSCMessage = (address, value) => {
        if (ws.value && isConnected.value) {
            const message = {
                type: "osc",
                address: address,
            };
            sendMessage(message);
        } else {
            console.warn("WebSocket belum terhubung!");
        }
    };

    return { ws, isConnected, connectWebSocket, sendMessage, sendOSCMessage };
}
