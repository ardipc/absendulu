<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  const time = writable<string>("");

  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");
    time.set(`${h}:${m}:${s}`);
  }

  onMount(() => {
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  });

  function onPlusClick() {
    alert("Tombol plus diklik!");
  }
</script>

<nav class="fixed top-0 left-0 z-50 w-full flex items-center bg-white justify-between px-4 py-3 border-b shadow">
  <!-- Left: Clock -->
  <div class="text-sm font-mono">
    {$time}
  </div>

  <!-- Center: Logo -->
  <div class="absolute left-1/2 transform -translate-x-1/2">
    <a href="/dashboard">
      <img src="/logo.png" alt="Logo" class="h-8" />
    </a>
  </div>

  <!-- Right: Plus Button -->
  <button
    class="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
    on:click={onPlusClick}
    aria-label="Add"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
      viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  </button>
</nav>
