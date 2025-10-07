<script lang="ts">
	import { goto } from '$app/navigation';

  let { data } = $props();

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const records = $state<any[]>(data.attendances ?? []);
</script>

{#if data}
  <div class="m-2 md:m-6">
    <!-- Heading -->
    <h1 class="text-xl font-bold mb-2">Halo {data?.user?.email}</h1>
    <p class="text-sm text-gray-500 mb-6">Hari ini: {today}</p>

    <!-- Summary Cards -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <button class="bg-white shadow rounded-xl p-4 text-center" onclick={() => goto(`/dashboard/absensi`)}>
        <p class="text-gray-500 text-sm">Clock In</p>
        <p class="text-xl font-bold text-green-600">08:00</p>
      </button>
      <button class="bg-white shadow rounded-xl p-4 text-center" onclick={() => goto(`/dashboard/absensi`)}>
        <p class="text-gray-500 text-sm">Clock Out</p>
        <p class="text-xl font-bold text-red-600">17:00</p>
      </button>
    </div>

    <!-- Attendance History -->
    <h2 class="text-lg font-semibold mb-3">Riwayat Absensi</h2>
    <div class="space-y-2">
      {#each records as rec}
        {@const clockIn = rec.clock_in_ts?.split('T')}
        {@const clockOut = rec.clock_out_ts?.split('T')}
        {@const valClockIn = rec.clock_in_ts ? clockIn[1].split(".")[0] : "-"}
        {@const valClockOut = rec.clock_out_ts ? clockOut[1]?.split(".")[0] : "-"}
        <button
          type="button"
          class="bg-white p-4 shadow rounded-xl flex justify-between items-center w-full text-left"
          aria-label="Lihat detail absensi"
          onclick={() => goto(`/dashboard/absensi/${new Date().toISOString().split('T')[0]}`)}
        >
          <div>
            <p class="font-medium">{rec.sites.name}</p>
            <p class="text-xs">{rec.status}</p>
            <p class="text-xs">{rec.date}</p>
          </div>
          <div class="flex gap-2 not-last-of-type:justify-between text-center">
            <div class="border p-2 rounded-xl">
              <p class="text-xs font-bold">Clock In</p>
              <p class="text-sm text-gray-700">{rec.clock_in_ts ? valClockIn : "-"}</p>
            </div>
            <div class="border p-2 rounded-xl">
              <p class="text-xs font-bold">Clock Out</p>
              <p class="text-sm text-gray-700">{rec.clock_out_ts ? valClockOut : "-"}</p>
            </div>
          </div>
        </button>
      {/each}
    </div>
  </div>
{/if}