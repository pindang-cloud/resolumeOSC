const express = require("express");
const { Server } = require("ws");
const osc = require("osc");

const app = express();
const port = 3000; // Port untuk Express.js API
const wsPort = 8081; // WebSocket (ganti dari 8080 agar tidak bentrok dengan Resolume)
const oscPortOut = 7000; // Port OSC Resolume
const oscPortIn = 57121; // Port OSC lokal

// Jalankan server Express.js
app.use(express.json());
app.listen(port, "0.0.0.0", () => {
    console.log(`Server berjalan di http://0.0.0.0:${port}`);
});

// Jalankan WebSocket server di port 8081
const wss = new Server({ port: wsPort }, () => {
    console.log(`WebSocket berjalan di ws://0.0.0.0:${wsPort}`);
});

// Konfigurasi OSC untuk Resolume Arena
const oscPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: oscPortIn, 
    remoteAddress: "127.0.0.1", // Resolume berjalan di localhost
    remotePort: oscPortOut
});

oscPort.open();

// Event saat WebSocket client terhubung
wss.on("connection", (ws) => {
    console.log("Client WebSocket terhubung");

    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message);
            console.log("Pesan diterima:", data);

            if (data.type === "playClip") {
                oscPort.send({
                    address: `/composition/layers/${data.layer}/clips/${data.clip}/connect`,
                    args: []
                });
            } else if (data.type === "setOpacity") {
                oscPort.send({
                    address: `/composition/layers/${data.layer}/opacity`,
                    args: [{ type: "f", value: data.opacity }]
                });
            }

        } catch (error) {
            console.error("Error parsing JSON:", error);
        }
    });

    ws.on("close", () => {
        console.log("Client WebSocket terputus");
    });
});
