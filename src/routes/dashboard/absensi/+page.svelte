<script lang="ts">
	import { supabase } from "$lib/supabase.js";
	import { uploadBase64 } from "$lib/upload";
  import { onMount, onDestroy } from "svelte";

  let { data } = $props();

  let loading = $state(false);
  let work = $state(null);

  let videoElement: HTMLVideoElement | null = null;
  let canvasElement: HTMLCanvasElement | null = null;

  let stream: MediaStream | null = null;
  let capturedImage: string | null = null;

  let latitude: number | null = null;
  let longitude: number | null = null;

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
    loading
    let get = await supabase.from("employees").select("*, companies(*, sites(*))").eq("email", data.user.email).single();
    if (get.error) {
      console.error("Error fetching employee data:", get.error);
      return null;
    }
    work = get.data;
    loading = false;
  }

  onMount(() => {
    startCamera();
    getWorkIn();
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

    const payload = {
      image: capturedImage,
      latitude,
      longitude,
      // tanggal dalam format yyyy-mm-dd
      tanggal: new Date().toISOString().split("T")[0],
      timestamp: new Date().toISOString()
    };

    console.log("Payload absensi:", payload);

    // Upload gambar ke Supabase
    try {
      const filePath = `absensi/${payload.tanggal}_${Date.now()}.png`;
      const upload = await uploadBase64(capturedImage, filePath);
      console.log("Upload result:", upload);
    } catch (err) {
      console.error("Error submitting absensi:", err);
      alert("Terjadi kesalahan saat mengirim absensi.");
    }
  } 
</script>

<main class="p-6 bg-gray-50 min-h-screen">
  {#if capturedImage}
    <!-- Preview hasil foto -->
    <img src={capturedImage} alt="Captured" class="rounded-xl shadow-md w-full max-w-md" />
    <div>
      {#if latitude !== null && longitude !== null}
        <p class="mt-2 text-green-600">Lokasi berhasil didapatkan:</p>
        <p>Latitude: {latitude}</p>
        <p>Longitude: {longitude}</p>
      {:else}
        <p class="mt-2 text-center text-red-600">Gagal mendapatkan lokasi.</p>
      {/if}
    </div>
    <button onclick={submitAbsensi} class="px-4 py-2 my-3 bg-green-500 w-full text-white rounded-lg">
      Kirim Absensi
    </button>
    <button onclick={retry} class="px-4 py-2 w-full rounded-lg">
      Ulangi
    </button>
  {:else}
    <!-- Kamera aktif -->
    <video bind:this={videoElement} autoplay playsinline class="rounded-xl shadow-md w-full"></video>
    <canvas bind:this={canvasElement} class="hidden"></canvas>

    <div class="info-work bg-white my-6 border rounded-lg p-3">
      {#if loading}
        <p>Loading...</p>
      {:else if work}
        <h2 class="text-lg font-semibold mb-2">Halo, {work.name}</h2>
        <p class="text-sm text-gray-600 mb-1">Perusahaan: {work.companies.name}</p>
        {#if work.companies.sites.length > 0}
          <p class="text-sm text-gray-600">Lokasi Kerja: {work.companies.sites[0].name} - {work.companies.sites[0].address}</p>
        {:else}
          <p class="text-sm text-gray-600">Belum ada lokasi kerja. Silakan hubungi admin.</p>
        {/if}
      {:else}
        <p class="text-sm text-gray-600">Gagal memuat data karyawan.</p>
      {/if}
    </div>

    <button 
      onclick={capture} 
      class="w-full py-4 bg-blue-500 text-white rounded-full text-lg font-semibold shadow-md hover:bg-blue-600 active:scale-95 transition"
    >
      Absen Hari Ini
    </button>

  {/if}
</main>