/**
 * Chart Color Palette - Harmonious and Professional
 *
 * This palette is designed to complement DaisyUI's base theme with:
 * - Muted, sophisticated tones that work well with DaisyUI's neutral base colors
 * - Good accessibility and contrast ratios (WCAG AA compliant)
 * - Distinguishable colors for up to 10 repositories
 * - Inspired by modern design systems (GitHub, Linear, Figma, Tailwind)
 *
 * Color Philosophy:
 * - Lavender: Soft purple, sophisticated and calming
 * - Sage: Muted green, natural and harmonious
 * - Coral: Warm pink, friendly and approachable
 * - Sky: Light blue, fresh and trustworthy
 * - Peach: Gentle orange, warm and inviting
 * - Mint: Fresh light green, cool and modern
 * - Rose: Dusty pink, elegant and refined
 * - Periwinkle: Soft blue-purple, professional and calm
 * - Apricot: Muted orange, energetic but gentle
 * - Seafoam: Light cyan, tranquil and contemporary
 *
 * Usage:
 * - Import { generateRepositoryColors } for automatic color assignment
 * - Import { CHART_COLORS } for specific color access
 * - Import { getChartColor } for index-based color selection
 */

export const CHART_COLORS = {
    // Harmonious palette - consistent saturation and brightness
    lavender: '#a78bfa', // Soft lavender-purple, gentle and sophisticated
    sage: '#6ee7b7', // Muted sage green, calm and natural
    coral: '#fca5a5', // Warm coral-pink, friendly and approachable
    sky: '#7dd3fc', // Light sky blue, fresh and clean
    peach: '#fed7aa', // Soft peach, warm and inviting
    mint: '#86efac', // Fresh mint green, cool and soothing
    rose: '#f9a8d4', // Dusty rose, elegant and refined
    periwinkle: '#a5b4fc', // Soft periwinkle blue, trustworthy and calm
    apricot: '#fdba74', // Muted apricot, energetic but not harsh
    seafoam: '#67e8f9' // Light seafoam, modern and tranquil
} as const;

// Array for easy iteration (ordered by visual harmony)
export const CHART_COLOR_PALETTE = [
    CHART_COLORS.lavender,
    CHART_COLORS.sage,
    CHART_COLORS.coral,
    CHART_COLORS.sky,
    CHART_COLORS.peach,
    CHART_COLORS.mint,
    CHART_COLORS.rose,
    CHART_COLORS.periwinkle,
    CHART_COLORS.apricot,
    CHART_COLORS.seafoam
] as const;

// Type for color keys
export type ChartColorKey = keyof typeof CHART_COLORS;

/**
 * Get color by index with automatic wrapping
 */
export const getChartColor = (index: number): string => {
    return CHART_COLOR_PALETTE[index % CHART_COLOR_PALETTE.length];
};

/**
 * Generate color mapping for repositories
 */
export const generateRepositoryColors = (repositories: Array<{ url: string }>): Record<string, string> => {
    return repositories.reduce(
        (acc, repo, index) => {
            const repoName = repo.url.split('/').pop() || 'unknown';
            acc[repoName] = getChartColor(index);
            return acc;
        },
        {} as Record<string, string>
    );
};
