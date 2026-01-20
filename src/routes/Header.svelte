<script lang="ts">
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import PenLine from '@lucide/svelte/icons/pen-line';
	import Menu from '@lucide/svelte/icons/menu';
	import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
	import Logout from '@lucide/svelte/icons/log-out';
	import LogIn from '@lucide/svelte/icons/log-in';
	import UserPlus from '@lucide/svelte/icons/user-plus';

	import { toggleMode } from 'mode-watcher';
	import Button from '@/components/ui/button/button.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import Avatar from '@/components/Avatar.svelte';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	let isAuthenticated = true;

	function handleWriteClick() {
		console.log('clicked');
	}
</script>

<header
	class="sticky top-0 z-20 w-full border-b border-zinc-100 bg-background/50 backdrop-blur dark:border-zinc-900"
>
	<div class="mx-auto flex h-16 w-full max-w-2xl items-center justify-between px-4">
		<!-- brand -->
		<Button variant="link" class="p-0 hover:no-underline">
			<a href="/" aria-label="The blog homepage">
				<!-- logo -->
				<span role="img" aria-hidden="true" aria-label="The blog logo" class="font-anton text-xl">
					The blog
				</span>

				<span class="sr-only">The Blog - Go to homepage</span>
			</a>
		</Button>

		<div class="flex items-center gap-2">
			<!-- write button -->
			<Button
				variant={'ghost'}
				size="icon"
				onclick={handleWriteClick}
				class="cursor-pointer rounded-full"
			>
				<PenLine class="h-[1.2rem] w-[1.2rem]" />

				<span class="sr-only">Create a post</span>
			</Button>

			<!-- theme toggle -->
			<Button
				onclick={toggleMode}
				variant={'ghost'}
				size="icon"
				class="cursor-pointer rounded-full"
			>
				<SunIcon
					class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90"
				/>

				<MoonIcon
					class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0"
				/>

				<span class="sr-only">Toggle theme</span>
			</Button>

			<!-- dropdown menu -->
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Button variant="ghost" size="icon" class="group cursor-pointer rounded-full px-0!">
						{#if isAuthenticated}
							<Avatar username="James" className="group-hover:border-transparent" />
						{:else}
							<Menu class="h-[1.2rem] w-[1.2rem]" />
						{/if}
					</Button>
				</DropdownMenu.Trigger>

				<DropdownMenu.Content class="w-40 rounded-sm p-2" align="start">
					{#if isAuthenticated}
						<DropdownMenu.Label>My Account</DropdownMenu.Label>
						<DropdownMenu.Separator class="mb-2" />
					{/if}

					<DropdownMenu.Group class="space-y-1">
						{#if isAuthenticated}
							<DropdownMenu.Item
								class="cursor-pointer"
								onclick={() => toast.message('Coming soon...')}
							>
								<LayoutDashboard /> Dashboard
							</DropdownMenu.Item>

							<DropdownMenu.Item class="cursor-pointer">
								<Logout /> Logout
							</DropdownMenu.Item>
						{:else}
							<DropdownMenu.Item class="cursor-pointer" onclick={() => goto(`/auth/login`)}>
								<LogIn /> Login
							</DropdownMenu.Item>

							<DropdownMenu.Item class="cursor-pointer" onclick={() => goto(`/auth/register`)}>
								<UserPlus /> Register
							</DropdownMenu.Item>
						{/if}
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>
</header>
