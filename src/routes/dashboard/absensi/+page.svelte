<script lang="ts">
	import { uploadBase64 } from "$lib/upload";
  import { onMount, onDestroy } from "svelte";

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

  onMount(() => {
    startCamera();
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

    // try {
    //   const response = await fetch("/api/absensi", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(payload)
    //   });

    //   if (response.ok) {
    //     alert("Absensi berhasil dikirim!");
    //     retry(); // reset untuk absensi berikutnya
    //   } else {
    //     alert("Gagal mengirim absensi.");
    //   }
    // } catch (err) {
    //   console.error("Error submitting absensi:", err);
    //   alert("Terjadi kesalahan saat mengirim absensi.");
    // }
  } 
</script>

<div class="flex flex-col items-center space-y-4">
  <div class="m-3">
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

      <button onclick={capture} class="px-4 py-2 bg-blue-500 w-full my-3 text-white rounded-lg">
        Clock In
      </button>
    {/if}
  </div>
</div>
