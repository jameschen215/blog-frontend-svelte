<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import type { PaginationMeta } from '$lib/types/data';

	type PostsPaginationProps = {
		pagination: PaginationMeta;
	};

	let { pagination }: PostsPaginationProps = $props();

	const handlePageChange = (nextPage: number) => {
		const url = new URL(page.url);
		url.searchParams.set('page', String(nextPage));
		goto(url);
	};
</script>

<Pagination.Root
	count={pagination.total}
	perPage={pagination.limit}
	page={pagination.page}
	onPageChange={handlePageChange}
>
	{#snippet children({ pages, currentPage })}
		<Pagination.Content>
			<Pagination.Item>
				<Pagination.Previous />
			</Pagination.Item>

			{#each pages as page (page.key)}
				{#if page.type === 'ellipsis'}
					<Pagination.Item>
						<Pagination.Ellipsis />
					</Pagination.Item>
				{:else}
					<Pagination.Item>
						<Pagination.Link {page} isActive={currentPage === page.value}>
							{page.value}
						</Pagination.Link>
					</Pagination.Item>
				{/if}
			{/each}

			<Pagination.Item>
				<Pagination.Next />
			</Pagination.Item>
		</Pagination.Content>
	{/snippet}
</Pagination.Root>
