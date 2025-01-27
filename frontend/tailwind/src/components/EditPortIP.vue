<template>
    <div class="p-4 bg-gray-100 rounded-lg">
      <h2 class="text-xl mb-4">Edit IP and Port</h2>
      <div class="space-y-4">
        <div>
          <label class="block mb-2">IP Address:</label>
          <input 
            v-model="ipAddress" 
            type="text" 
            placeholder="Enter IP Address" 
            class="w-full p-2 border rounded"
          >
        </div>
        <div>
          <label class="block mb-2">Port:</label>
          <input 
            v-model="port" 
            type="number" 
            placeholder="Enter Port" 
            class="w-full p-2 border rounded"
          >
        </div>
        <button 
          @click="saveConfiguration" 
          class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Save Configuration
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  
  const ipAddress = ref("");
  const port = ref("");
  
  const fetchConfig = async () => {
    try {
      const response = await fetch("/api/config");
      const data = await response.json();
      ipAddress.value = data.ipAddress;
      port.value = data.port;
    } catch (error) {
      console.error("Error fetching config:", error);
    }
  };
  
  const saveConfiguration = async () => {
    try {
      const response = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ipAddress: ipAddress.value, port: port.value }),
      });
  
      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error("Error saving config:", error);
      alert("Failed to save configuration");
    }
  };
  
  onMounted(fetchConfig);
  </script>
  