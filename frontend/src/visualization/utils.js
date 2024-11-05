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

export function tooltipHover(tooltip, event)
{
    const tooltipNode = tooltip.node();
    const tooltipWidth = tooltipNode.offsetWidth;
    const windowWidth = window.innerWidth;
    const mouseX = event.pageX;

    const wouldOverflowRight = mouseX + tooltipWidth + 60 > windowWidth;

    tooltip
        .style('top', (event.pageY - 20) + 'px')
        .style('left', wouldOverflowRight
            ? (mouseX - tooltipWidth - 30) + 'px'
            : (mouseX + 40) + 'px');
}
