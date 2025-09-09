<script lang="ts">
  import { supabase } from '$lib/supabase';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let user: any = $state(null);

  onMount(async () => {
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      user = data.user;
      console.log(user)
    } else {
      goto('/'); // kalau belum login diarahkan ke halaman awal
    }
  });

  async function logout() {
    await supabase.auth.signOut();
    goto('/');
  }

</script>

<div class="py-3 bg-gray-50">
  <div class="max-w-md mx-auto">
    {#if user}
      <div class="bg-white rounded-xl shadow-md flex flex-col p-4 gap-4">
        <div>
          <img src={user.identities[0].identity_data.avatar_url} class="rounded-full" alt="Profile" />
        </div>

        <div>
          <p class="text-sm text-gray-500">Name</p>
          <p class="text-lg font-medium">{user.user_metadata?.full_name || "Not set"}</p>
        </div>

        <div>
          <p class="text-sm text-gray-500">Email</p>
          <p class="text-lg font-medium">{user.email}</p>
        </div>

        <div>
          <p class="text-sm text-gray-500">Role</p>
          <p class="text-lg font-medium">{user.user_metadata?.role || "User"}</p>
        </div>
      </div>

      <div class="mt-6 space-y-3">
        <button
          class="w-full bg-blue-500 text-white py-3 rounded-xl shadow-md hover:bg-blue-600 transition"
          onclick={() => goto('/profile/edit')}
        >
          Edit Profile
        </button>

        <button
          class="w-full py-3 rounded-xl cursor-pointer text-red-500"
          onclick={logout}
        >
          Logout
        </button>
      </div>
    {:else}
      <p class="text-center text-gray-500">Loading...</p>
    {/if}
  </div>
</div>
