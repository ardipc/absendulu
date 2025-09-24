<script lang="ts">
  let { data } = $props();

  console.log('dashboard', data);

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const records = [
    { time: "08:05", status: "Clock In", location: "Kantor Pusat" },
    { time: "12:00", status: "Break Out", location: "Kantor Pusat" },
    { time: "13:00", status: "Break In", location: "Kantor Pusat" },
    { time: "17:05", status: "Clock Out", location: "Kantor Pusat" },
    { time: "08:05", status: "Clock In", location: "Kantor Pusat" },
    { time: "12:00", status: "Break Out", location: "Kantor Pusat" },
    { time: "13:00", status: "Break In", location: "Kantor Pusat" },
    { time: "17:05", status: "Clock Out", location: "Kantor Pusat" }
  ];
</script>

{#if data}
  <div class="m-2 md:m-6">
    <!-- Heading -->
    <h1 class="text-xl font-bold mb-2">Halo {data?.user?.email}</h1>
    <p class="text-sm text-gray-500 mb-6">Hari ini: {today}</p>

    <!-- Summary Cards -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="bg-white shadow rounded-xl p-4 text-center">
        <p class="text-gray-500 text-sm">Clock In</p>
        <p class="text-xl font-bold text-green-600">08:05</p>
      </div>
      <div class="bg-white shadow rounded-xl p-4 text-center">
        <p class="text-gray-500 text-sm">Clock Out</p>
        <p class="text-xl font-bold text-red-600">17:05</p>
      </div>
    </div>

    <!-- Attendance History -->
    <h2 class="text-lg font-semibold mb-3">Riwayat Absensi</h2>
    <div class="space-y-2">
      {#each records as rec}
        <div class="bg-white p-4 shadow rounded-xl flex justify-between items-center">
          <div>
            <p class="font-medium">{rec.status}</p>
            <p class="text-xs text-gray-500">{rec.location}</p>
          </div>
          <p class="text-sm text-gray-700">{rec.time}</p>
        </div>
      {/each}
    </div>
  </div>
{/if}