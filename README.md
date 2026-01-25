## What I've learned

### Passing Refs Between Components in Svelte

Unlike React's `useRef` and `forwardRef`, Svelte uses a simpler pattern for managing references across components:

1. `bind:this` for component/element references: Use `bind:this={variable}` to get a direct reference to DOM elements or component instances.

```svelte
  import CommentSection from './CommentSection.svelte';
  let commentSection: CommentSection;

	function handleCommentClick() {
		commentSection?.scrollIntoView();
		commentSection?.focus();
	}
```

2. Exposing component methods: Child components can export functions that parents can call, similar to React's `useImperativeHandle`:

```svelte
  // Child component
  export function focus() {
    textarea?.focus();
  }
```

3. Parent coordinates between siblings: The parent component holds references to child components and orchestrates interactions between them, rather than passing refs down as props.

4. shadcn-svelte specific: When using shadcn-svelte components like `InputGroup.Textarea`, use `bind:ref` instead of `bind:this` to access the underlying DOM element.

5. Svelte 5 runes and TypeScript:
   - Initialize ref variables with `$state<HTMLElement | null>(null)` instead of `undefined`
   - Svelte's bind system requires `null` (intentional empty value) rather than `undefined` (uninitialized)
   - Use optional chaining (`?.`) when calling methods on refs to handle null cases safely

This pattern keeps component internals encapsulated while allowing controlled access to specific functionality.
