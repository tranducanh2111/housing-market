export function formatPrice(price)
{
    if (price < 1000000)
        return `$${Math.round(price / 1000)}K`;
    return `${(price/1000000).toFixed(2)}M`;
}

export function observeContainerSize(containerRef, setDimensions) {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            const { width, height } = entry.contentRect;
            setDimensions({ width, height });
        }
    });

    resizeObserver.observe(containerRef.current);

    return () => { resizeObserver.disconnect(); };
}
