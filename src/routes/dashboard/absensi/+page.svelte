<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  let videoElement: HTMLVideoElement | null = null;
  let canvasElement: HTMLCanvasElement | null = null;

  let stream: MediaStream | null = null;

  let payload = $state<any | null>(null);

  onMount(async () => {
    try {
      // Aktifkan kamera
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" } // ganti ke "environment" untuk kamera belakang
      });
      if (videoElement) {
        videoElement.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
    }
  });

  onDestroy(() => {
    // Matikan kamera saat pindah halaman
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
    }
    console.log("Camera stopped.");
  });

  function clockIn() {
    console.log("click")
    const context = canvasElement?.getContext("2d");

    if (canvasElement && videoElement) {
      console.log("canvasElement && videoElement")

      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
    }

    if (context && videoElement && canvasElement) {
      console.log("context && canvasElement && videoElement")

      // ambil snapshot dari kamera
      context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
      const imageData = canvasElement.toDataURL("image/png");

      console.log("image", imageData)

      // ambil lokasi sekali (tanpa watch)
      if ("geolocation" in navigator) {
        console.log("geolocation in navigator")
        payload = {
          image: imageData
        }

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const latitude = pos.coords.latitude;
            const longitude = pos.coords.longitude;

            console.log("Captured Image:", imageData);
            console.log("Latitude:", latitude, "Longitude:", longitude);

            payload = {
              image: imageData,
              latitude,
              longitude
            }

          },
          (err) => {
            console.error("Error getting location:", err);
            alert("Clock In berhasil, tapi lokasi gagal diambil.");
          }
        );
      } else {
        alert("Clock In berhasil, tapi geolocation tidak didukung.");
      }
    } else {
      alert("Gagal mengambil gambar. Pastikan kamera aktif.");
    }
  }
</script>

<div class="pt-4 pb-4 bg-gray-50 flex flex-col items-center">
  <!-- Kamera -->
  <div class="w-full max-w-md p-4 mb-4">
    <video
      bind:this={videoElement}
      autoplay
      playsinline
      class="rounded-xl shadow-md w-full"
    >
      <track kind="captions" />
    </video>
    <!-- Canvas tersembunyi -->
    <canvas bind:this={canvasElement} class="hidden"></canvas>
  </div>

  <!-- Tombol Clock In -->
  <div class="flex-1 flex flex-col items-center justify-center space-y-4">
    <button
      onclick={clockIn}
      class="w-40 h-40 bg-blue-500 rounded-full text-white text-xl font-bold shadow-lg hover:bg-blue-600 transition"
    >
      Clock In
    </button>
    <p class="text-gray-500 text-sm">Silakan tekan tombol untuk Clock In.</p>
  </div>

  {#if payload}
    <div class="w-full p-4">
      <img src={payload.image} alt="Caputer" class="rounded-xl shadow-md w-full" />
      <p>Latitude : {payload.latitude}</p>
      <p>Longitude : {payload.longitude}</p>
    </div>
  {/if}
</div>
