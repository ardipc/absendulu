<script lang="ts">
	import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
	import { uploadBase64 } from "$lib/upload";
  import { onMount, onDestroy } from "svelte";

  let { data } = $props();

  let loading     = $state(false);
  let isWorkIn    = $state(true);
  let work        = $state<any | null>(null);
  let attendance  = $state<any>(null);

  let videoElement: HTMLVideoElement | null = $state(null);
  let canvasElement: HTMLCanvasElement | null = $state(null);

  let stream: MediaStream | null = $state(null);
  let capturedImage: string | null = $state(null);

  let latitude: number | null = $state(null);
  let longitude: number | null = $state(null);

  async function getWorkIn() {
    loading = true;
    let get = await data.supabase.from("employees")
                .select("*, companies(*, sites(*))")
                .eq("email", data.user.email)
                .single();
    if (get.data) { 
      work = get.data;

      let one = await data.supabase.from("attendances")
        .select("*, site(name, address, companies(name))")
        .eq("email", data.user.email)
        .eq("date", data.slug)
        .single();
      
      if (one) {
        attendance = one.data;
      }
    }

    if (get.status === 406) {
      isWorkIn = false
    }

    loading = false;
  }

  onMount(() => {
    getWorkIn();
  }); 
</script>

<main class="p-2 md:p-6 bg-gray-50">
  {#if loading}
    <div class="grid grid-cols-1 gap-2">
      <Skeleton class="h-[24px] w-full rounded" />
      <Skeleton class="h-[60px] w-full rounded" />
      <Skeleton class="h-[20px] w-full rounded" />
      <Skeleton class="h-[40px] w-full rounded" />
    </div>
  {/if}

  {#if attendance}
    <div class="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Attendance Detail</h2>

      <div class="space-y-2 text-gray-700">
        <p><strong>Email:</strong> {attendance.email}</p>
        <p><strong>Company:</strong> {attendance.site.companies.name}</p>
        <p><strong>Site:</strong> {attendance.site.name}</p>
        <p><strong>Address:</strong> {attendance.site.address}</p>
        <p><strong>Date:</strong> {attendance.date}</p>
        <p><strong>Status:</strong> 
          <span class={attendance.status === 'SUBMIT' ? 'text-yellow-600' : 'text-green-600'}>
            {attendance.status}
          </span>
        </p>
      </div>

      <div class="mt-6 border-t pt-4">
        <h3 class="font-semibold text-gray-800">Clock In</h3>
        <p>Time: {new Date(attendance.clock_in_ts).toLocaleString()}</p>
        <p>Location: {attendance.clock_in_lat}, {attendance.clock_in_lng}</p>
        {#if attendance.clock_in_photo}
          <img
            src={`https://lvwzvhzsfphyhswahgot.supabase.co/storage/v1/object/public/${attendance.clock_in_photo}`}
            alt="Clock In Photo"
            class="mt-2 rounded-lg border"
          />
        {/if}
      </div>

      {#if attendance.clock_out_ts}
        <div class="mt-6 border-t pt-4">
          <h3 class="font-semibold text-gray-800">Clock Out</h3>
          <p>Time: {new Date(attendance.clock_out_ts).toLocaleString()}</p>
          <p>Location: {attendance.clock_out_lat}, {attendance.clock_out_lng}</p>
          {#if attendance.clock_out_photo}
            <img
              src={`https://lvwzvhzsfphyhswahgot.supabase.co/storage/v1/object/public/${attendance.clock_out_photo}`}
              alt="Clock Out Photo"
              class="mt-2 rounded-lg border"
            />
          {/if}
        </div>
      {/if}
    </div>
  {/if}

</main>