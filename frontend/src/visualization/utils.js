export function formatPrice(price)
{
    if (price < 1000000)
        return `$${Math.round(price / 1000)}K`;
    return `${(price/1000000).toFixed(2)}M`;
}