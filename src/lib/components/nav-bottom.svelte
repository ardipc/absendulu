<script lang="ts">
  import { House, ListChecks, PlusSquare, Users2Icon, Contact2 } from "@lucide/svelte";
</script>

<nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
  <ul class="flex justify-around items-center py-3 text-gray-600">
    <a href="/dashboard">
      <li class="flex flex-col items-center">
        <House class="w-6 h-6" />
        <span class="text-xs">Home</span>
      </li>
    </a>
    <a href="/dashboard/absensi">
      <li class="flex flex-col items-center">
        <ListChecks class="w-6 h-6" />
        <span class="text-xs">Absensi</span>
      </li>
    </a>
    <a href="/dashboard/request">
      <li class="flex flex-col items-center">
        <PlusSquare class="w-6 h-6" />
        <span class="text-xs">Request</span>
      </li>
    </a>
    <a href="/dashboard/karyawan">
      <li class="flex flex-col items-center">
        <Users2Icon class="w-6 h-6" />
        <span class="text-xs">Karyawan</span>
      </li>
    </a>
    <a href="/dashboard/profile">
      <li class="flex flex-col items-center">
        <Contact2 class="w-6 h-6" />
        <span class="text-xs">Profile</span>
      </li>
    </a>
  </ul>
</nav>
