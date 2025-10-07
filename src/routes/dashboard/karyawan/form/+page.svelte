<script lang="ts">
  let { data } = $props();
  import CompanyKaryawan from '$lib/components/company/karyawan.svelte'
</script>

<main class="p-2 md:p-6 bg-gray-50 min-h-screen">
  <CompanyKaryawan data={data} />
</main>