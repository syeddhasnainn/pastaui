# Card surfaces

Use `rounded-md bg-card shadow-card` for cards. Set padding separately; don't add another border or shadow utility.

`shadow-card` combines:

- 0.5px outline at 8.8% opacity: black in light mode, white in dark mode.
- Soft black shadow: `0 3px 6px -2px` at 2% opacity.
- Close black shadow: `0 1px 1px 0` at 4% opacity.

Tokens live in `src/styles.css`: `--card-outline`, `--card-shadow`, and Tailwind's `--shadow-card`. Update them to change all cards using the utility.

## Typography

- Font: Inter, default weight 450, tracking `-0.05px` throughout.
- Body and controls: 14px, `text-muted-foreground`.
- Supporting text (card descriptions and helper text): 12px, weight 450, `text-xs leading-5 font-[450] text-muted-foreground`.
- Compact card headings: 15px, weight 500. Use the shared `card-heading` utility, which also sets Inter and tracking `-0.05px`. Keep body text and controls at weight 450 to create a subtle hierarchy.
- Metadata labels (code-block filenames, language labels, timestamps, and file paths): 12px, weight 450, 20px line height, `text-muted-foreground`. Use the shared `metadata-label` utility. These identify content rather than introduce a section, so do not use `card-heading` for them. Keep code content monospace separately.
- Sidebar section headings: 11px, sentence case.

Body classes: `text-sm font-[450] tracking-[-0.05px] text-muted-foreground`.

Use `card-heading` on the appropriate semantic heading or title element. Do not set global `h1` styles for card titles; page headings have a different hierarchy. Update the utility in `src/styles.css` to change all compact card headings together.

## Input fields

Do not show resize handles on input boxes or textareas. Use `resize-none` (`resize: none`) on textareas to disable manual resizing.

## Charcoal black

Use `bg-charcoal-black text-charcoal-foreground` for the charcoal gradient used by the Email Composer Send and Follow Up Suggestions Submit buttons. The gradient runs from a 30% mix of the near-white foreground into charcoal at the top to `#171717` at the bottom. It keeps the same colors in light and dark mode.

The reusable Tailwind utility controls the background only; set radius, spacing, and shadows separately. For buttons, use `variant="charcoal"`. To match Send and Submit exactly:

```tsx
<Button variant="charcoal" size="sm" className="h-7 rounded-full border-0 px-3 shadow-none">
  Send
</Button>
```

For other elements, use `className="bg-charcoal-black text-charcoal-foreground"`. Tokens live in `src/styles.css`: `--charcoal-top`, `--charcoal-bottom`, and `--charcoal-foreground`.
