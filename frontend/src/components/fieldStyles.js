export function controlClasses(hasError, extra = '') {
  return [
    'w-full rounded-2xl border-2 bg-white text-[15px] text-ink shadow-[inset_0_1px_2px_rgba(27,20,24,0.03)] outline-none transition-all duration-150 placeholder:text-muted/65 disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-muted',
    hasError
      ? 'border-danger/70 focus:border-danger focus:ring-4 focus:ring-danger/15'
      : 'border-line-strong hover:border-candey/55 focus:border-candey focus:ring-4 focus:ring-candey/15',
    extra,
  ]
    .filter(Boolean)
    .join(' ')
}
