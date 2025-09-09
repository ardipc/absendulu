<script lang="ts">
  import * as NavigationMenu from "$lib/components/ui/navigation-menu";
</script>

<header class="bg-white">
  <nav aria-label="Global" class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
    <div class="flex lg:flex-1">
      <a href="/" class="-m-1.5 p-1.5">
        <span class="sr-only">Absendulu</span>
        <img src="/rectangle.png" alt="" class="h-10 w-auto" />
      </a>
    </div>
    <div class="flex lg:hidden">
      <NavigationMenu.Root>
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>Menu</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <ul class="grid w-[100px] p-2">
                <li><NavigationMenu.Link href="/">Beranda</NavigationMenu.Link></li>
                <li><NavigationMenu.Link href="#fitur">Fitur</NavigationMenu.Link></li>
                <li><NavigationMenu.Link href="#harga">Harga</NavigationMenu.Link></li>
                <li><NavigationMenu.Link href="#tim">Tim</NavigationMenu.Link></li>
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </div>

    <el-popover-group class="hidden lg:flex lg:gap-x-12">
      <a href="/" class="text-sm/6 font-semibold text-gray-900 cursor-pointer">Beranda</a>
      <a href="#fitur" class="text-sm/6 font-semibold text-gray-900 cursor-pointer">Fitur</a>
      <a href="#harga" class="text-sm/6 font-semibold text-gray-900 cursor-pointer">Harga</a>
      <a href="#tim" class="text-sm/6 font-semibold text-gray-900 cursor-pointer">Tim</a>
    </el-popover-group>
    <div class="hidden lg:flex lg:flex-1 lg:justify-end">
      <a href="/masuk" class="text-sm/6 font-semibold text-gray-900">Masuk <span aria-hidden="true">&rarr;</span></a>
    </div>
  </nav>
</header>