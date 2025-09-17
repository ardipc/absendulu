<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
  import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";

	import { supabase } from "$lib/supabase.js";
	import { Edit, Edit2, Edit3 } from "@lucide/svelte";
	import { onMount } from "svelte";

  let { data } = $props();

  // Simulasi user plan
  let isFreePlan = true;

  // Simulasi company
  let company: { owner: string | undefined; name: string; description: string } | any[] | null = $state(null);

  // Simulasi daftar karyawan
  let employees: { name: string; position: string }[] = $state([]);

  // Form input
  let companyName = $state("");
  let companyAddress = $state("");
  let empName = $state("");
  let empPosition = $state("");

  async function createCompany() {
    if (!companyName || !companyAddress) {
      alert("Nama & alamat perusahaan harus diisi");
      return;
    }
    company = { owner: data.session?.user.email, name: companyName, description: companyAddress };
    const create = await supabase.from("companies").insert([company]).select()
    console.log(create)
    alert(`Company ${company.name} berhasil dibuat!`);
  }

  function addEmployee() {
    if (!empName || !empPosition) {
      alert("Isi nama & jabatan karyawan");
      return;
    }
    employees.push({ name: empName, position: empPosition });
    empName = "";
    empPosition = "";
  }

  let loading = $state(true)

  onMount(() => {
    checkingCompany()
  });

  async function checkingCompany() {
    loading = true

    const { data: response } = await supabase.from("companies").select("*").eq("owner", data.session?.user.email);
    if (response?.length === 0) company = null;
    else if (response) company = response[0];
    else company = null;

    loading = false
  }
</script>

<main class="py-3 bg-gray-50 min-h-screen">
  {#if loading}
    <div class="grid grid-cols-1 gap-2">
      <Skeleton class="h-[24px] w-full rounded" />
      <Skeleton class="h-[60px] w-full rounded" />
      <Skeleton class="h-[20px] w-full rounded" />
      <Skeleton class="h-[40px] w-full rounded" />
    </div>
  {/if}

  {#if !company && !loading}
    <!-- FORM CREATE COMPANY -->
    <h1 class="text-xl font-bold mb-4">Buat Perusahaan Anda</h1>
    <p class="text-sm text-gray-500 mb-6">
      Anda menggunakan paket <span class="font-semibold">{isFreePlan ? "Gratis" : "Pro"}</span>.
      Pada paket gratis, Anda hanya bisa membuat 1 perusahaan dan 1 lokasi.
    </p>

    <label class="block mb-2 text-sm font-medium">Nama Perusahaan</label>
    <input type="text" value={companyName} onchange={e => companyName = e.target.value}
      class="w-full p-4 border rounded-lg mb-4 focus:ring focus:ring-blue-200" />

    <label class="block mb-2 text-sm font-medium">Deskripsi</label>
    <textarea value={companyAddress} rows="3" onchange={e => companyAddress = e.target.value}
      class="w-full p-4 border rounded-lg mb-6 focus:ring focus:ring-blue-200"></textarea>

    <button onclick={createCompany}
      class="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600">
      Buat Perusahaan
    </button>

  {/if}

  {#if company && !loading}
    <!-- COMPANY DASHBOARD -->
    <div class="flex justify-between mb-3">
      <div>
        <h1 class="text-xl font-bold">{company.name}</h1>
        <p class="text-gray-600">{company.description}</p>
      </div>
      <button class="rounded-full">
        <Edit class="w-4 h-4 cursor-pointer" />
      </button>
    </div>

    <div class="my-3">
      <Button onclick={addEmployee}
        class="w-full py-2 rounded-lg">
        Tambah Lokasi
      </Button>
    </div>

    <!-- FORM TAMBAH KARYAWAN -->
    <div class="bg-white p-4 shadow rounded-lg mb-6">
      <h2 class="text-lg font-semibold mb-3">Tambah Karyawan</h2>
      {#if isFreePlan && employees.length >= 5}
        <p class="text-red-500 text-sm mb-3">
          Batas maksimal karyawan untuk paket gratis adalah 5. Upgrade ke Pro untuk menambah karyawan.
        </p>
      {:else}
        <input type="text" value={empName} placeholder="Nama" onchange={e => empName = e.target.value}
          class="w-full p-2 border rounded-lg mb-3" />
        <input type="text" value={empPosition} placeholder="Jabatan" onchange={e => empPosition = e.target.value}
          class="w-full p-2 border rounded-lg mb-3" />
        <Button onclick={addEmployee}
          class="w-full py-2 rounded-lg">
          Tambah Karyawan
        </Button>
      {/if}
    </div>

    <!-- LIST KARYAWAN -->
    <h2 class="text-lg font-semibold mb-3">Daftar Karyawan</h2>
    {#if employees.length === 0}
      <p class="text-gray-500">Belum ada karyawan.</p>
    {:else}
      <ul class="space-y-2">
        {#each employees as emp}
          <li class="bg-white p-4 shadow rounded-lg flex justify-between">
            <div>
              <p class="font-medium">{emp.name}</p>
              <p class="text-sm text-gray-500">{emp.position}</p>
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  {/if}
</main>