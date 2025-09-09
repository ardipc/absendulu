<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';

  onMount(async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (session) {
      console.log('Login success:', session.user);
      goto('/dashboard'); // redirect setelah login
    } else {
      console.error(error);
      goto('/masuk');
    }
  });
</script>

<p class="p-4">Mengautentikasi, tunggu sebentar...</p>
