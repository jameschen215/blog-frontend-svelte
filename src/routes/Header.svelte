<script lang="ts">
	import { page } from '$app/state';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { toggleMode } from 'mode-watcher';

	import Menu from '@lucide/svelte/icons/menu';
	import SunIcon from '@lucide/svelte/icons/sun';
	import LogIn from '@lucide/svelte/icons/log-in';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import Logout from '@lucide/svelte/icons/log-out';
	import PenLine from '@lucide/svelte/icons/pen-line';
	import UserPlus from '@lucide/svelte/icons/user-plus';
	import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';

	import type { AuthResultUser } from '$lib/types/data';
	import Avatar from '$lib/components/Avatar.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	interface Props {
		user: AuthResultUser | null;
	}

	let { user }: Props = $props();
	let isAuthenticated = $derived(!!user);

	let redirect = $derived(page.url.pathname + page.url.hash);

	function handleWriteClick() {
		toast.info('Functionality coming soon...');
	}
</script>

<header
	class="sticky top-0 z-20 h-16 w-full border-b border-zinc-100 bg-background/50 backdrop-blur dark:border-zinc-900"
>
	<div class="mx-auto flex h-full w-full max-w-2xl items-center justify-between px-4">
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
					{#snippet child({ props })}
						<Button
							{...props}
							variant="ghost"
							size="icon"
							class="group cursor-pointer rounded-full px-0!"
						>
							{#if isAuthenticated}
								<Avatar username="James" className="group-hover:border-transparent" />
							{:else}
								<Menu class="h-[1.2rem] w-[1.2rem]" />
							{/if}
						</Button>
					{/snippet}
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

							<form action="/auth/logout" method="post" use:enhance>
								<DropdownMenu.Item class="w-full cursor-pointer">
									{#snippet child({ props })}
										<button {...props} type="submit">
											<Logout /> Logout
										</button>
									{/snippet}
								</DropdownMenu.Item>
							</form>
						{:else}
							<DropdownMenu.Item
								class="cursor-pointer"
								onclick={() => goto(`/auth/login?redirect=${encodeURIComponent(redirect)}`)}
							>
								<LogIn /> Login
							</DropdownMenu.Item>

							<DropdownMenu.Item
								class="cursor-pointer"
								onclick={() => goto(`/auth/register?redirect=${encodeURIComponent(redirect)}`)}
							>
								<UserPlus /> Register
							</DropdownMenu.Item>
						{/if}
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>
</header>
