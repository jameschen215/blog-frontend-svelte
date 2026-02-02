<script lang="ts">
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

	interface Props {
		name: string;
		label: string;
		type?: 'text' | 'password' | 'email';
		value?: string | File;
		errors?: string[];
		autofocus?: boolean;
		onClearError: () => void;
	}

	let {
		name,
		label,
		type = 'text',
		value = '',
		errors,
		autofocus = false,
		onClearError
	}: Props = $props();

	const stringValue = $derived(typeof value === 'string' ? value : '');
</script>

<Field.Field class="gap-2">
	<Field.Label for={name} class="capitalize">{label}</Field.Label>
	<Input
		{type}
		id={name}
		{name}
		value={stringValue}
		oninput={onClearError}
		{autofocus}
		class="rounded-sm"
	/>

	{#if errors && errors.length > 0}
		<Field.FieldError id="{name}-error">{errors[0]}</Field.FieldError>
	{/if}
</Field.Field>
