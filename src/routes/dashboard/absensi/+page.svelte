<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from './../../../lib/supabase.ts';
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

  async function startCamera() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
      });
      if (videoElement) {
        videoElement.srcObject = stream;
        await videoElement.play(); // pastikan jalan
      }
    } catch (err) {
      console.error("Camera access denied:", err);
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
    }
  }

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
        .eq("date", new Date().toISOString().split("T")[0])
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

  $effect(() => {
    if (work) {
      startCamera();
    }
  });

  onDestroy(() => {
    stopCamera();
  });

  function capture() {
    if (canvasElement && videoElement) {
      const context = canvasElement.getContext("2d");
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
      if (context) {
        context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        capturedImage = canvasElement.toDataURL("image/png");
      }
    }

    // Ambil lokasi sekali
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          latitude = pos.coords.latitude;
          longitude = pos.coords.longitude;
          console.log("Latitude:", latitude, "Longitude:", longitude);
        },
        (err) => {
          console.error("Error getting location:", err);
          latitude = -7.250445; // Contoh fallback
          longitude = 112.768845;
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }
  }

  function retry() {
    capturedImage = null;
    latitude = null;
    longitude = null;
    startCamera(); // hidupkan kamera lagi
  }

  async function submitAbsensi() {
    if (!capturedImage) return;

    let payload = {
      site: work.id,
      email: data.user.email,
      date: new Date().toISOString().split("T")[0],
      status: 'SUBMIT'
    };

    if (attendance) {
      payload = { 
        ...payload, 
        clock_out_ts: new Date().toISOString(),
        clock_out_lat: latitude,
        clock_out_lng: longitude,
      }
    } else {
      payload = {
        ...payload,
        clock_in_ts: new Date().toISOString(),
        clock_in_lat: latitude,
        clock_in_lng: longitude,
      }
    }

    // Upload gambar ke Supabase
    try {
      const filePath = `absensi/${payload.date}_${Date.now()}.png`;
      const upload = await uploadBase64(data.supabase, capturedImage, filePath);

      if (upload) {
        if (attendance) {
          payload = { ...payload, clock_out_photo: upload.fullPath };
          const update = await data.supabase.from("attendances").update(payload).eq('id', attendance.id);
          if (update) {
            goto(`/dashboard/absensi/${payload.date}`)
          }
        } else {
          payload = { ...payload, clock_in_photo: upload.fullPath };
          const insert = await data.supabase.from("attendances").insert([payload]);
          if (insert) {
            goto(`/dashboard/absensi/${payload.date}`)
          }
        }
      }
      
    } catch (err) {
      console.error("Error submitting absensi:", err);
      alert("Terjadi kesalahan saat mengirim absensi.");
    }
  } 
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

  {#if capturedImage}
    <div class="">
      <img src={capturedImage} alt="Captured" class="rounded-xl shadow-md w-full" />
      <div class="border rounded-xl p-4 my-3">
        {#if latitude !== null && longitude !== null}
          <p class="text-green-600">Lokasi berhasil didapatkan:</p>
          <p>Latitude: {latitude}</p>
          <p>Longitude: {longitude}</p>
        {:else}
          <p class="mt-2 text-center text-red-600">Gagal mendapatkan lokasi.</p>
        {/if}
      </div>
      <button onclick={submitAbsensi} class="px-4 py-3 my-3 bg-green-500 w-full cursor-pointer text-white rounded-xl">
        Submit
      </button>
      <button onclick={retry} class="px-4 py-2 w-full rounded-lg cursor-pointer">
        Ulangi
      </button>
    </div>
  {/if}

  {#if !capturedImage}

    {#if work && !loading}
      <div class="info-work bg-white my-2 border rounded-lg p-3">
        <h2 class="text-lg font-semibold mb-2">Halo, {work.name}</h2>
        <p class="text-sm text-gray-600 mb-1">Kamu bekerja di {work.companies.name}</p>
        {#if work.companies.sites.length > 0}

          <div class="my-3">
            <!-- Kamera aktif -->
            <video bind:this={videoElement} autoplay playsinline class="rounded-xl shadow-md w-full">
              <track kind="captions" />
            </video>
            <canvas bind:this={canvasElement} class="hidden"></canvas>
          </div>

          <div class="my-3">
            <p class="text-sm text-gray-600">Lokasi Kerja: {work.companies.sites[0].name} - {work.companies.sites[0].address}</p>
          </div>

          <button onclick={capture} class={`w-full py-4 bg-blue-500 text-white rounded-full text-lg font-semibold shadow-md hover:bg-blue-600 active:scale-95 transition`}>
            Clock {attendance ? 'Out' : 'In'}
          </button>
        {:else}
          <p class="text-sm text-gray-600">Belum ada lokasi kerja. Silakan hubungi admin.</p>
        {/if}
      </div>
    {/if}

    {#if isWorkIn === false}
      <div class="p-6 card shadow rounded-xl bg-white my-2">
        <p class="text-sm text-gray-600">Kamu tidak bekerja di perusahaan manapun.</p>
      </div>
    {/if}

  {/if}
</main>