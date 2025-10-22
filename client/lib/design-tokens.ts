/**
 * Beagle Digital Space Design System Tokens
 * Based on design.json - warm, modern design with organic elements
 */

export const designTokens = {
    // Colors
    colors: {
        primary: {
            cream: '#F9F5F0',
            lightBeige: '#F2EAD3',
            forestGreen: '#344F1F',
        },
        accent: {
            orange: '#F4991A',
            warmOrange: '#FA812F',
            red: '#DD0303',
        },
        semantic: {
            success: '#344F1F',
            warning: '#F4991A',
            error: '#DD0303',
            info: '#FA812F',
        },
        neutral: {
            darkText: '#344F1F',
            mediumText: '#5a6c4a',
            lightText: '#F9F5F0',
            white: '#ffffff',
        },
    },

    // Gradients
    gradients: {
        background: 'linear-gradient(135deg, #F9F5F0 0%, #F2EAD3 100%)',
        accent: 'linear-gradient(135deg, #FA812F 0%, #F4991A 100%)',
        dark: 'linear-gradient(135deg, #344F1F 0%, #2a3f19 100%)',
        light: 'linear-gradient(135deg, #F2EAD3 0%, #F9F5F0 100%)',
        textGradient: 'linear-gradient(135deg, #F4991A 0%, #FA812F 100%)',
        leftFade: 'linear-gradient(90deg, #F9F5F0 0%, transparent 50%)',
    },

    // Typography
    typography: {
        fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        fontSize: {
            hero: '4rem',
            h1: '2.8rem',
            h2: '2.5rem',
            h3: '2rem',
            h4: '1.8rem',
            large: '1.2rem',
            medium: '1.1rem',
            body: '1rem',
            small: '0.9rem',
        },
        fontWeight: {
            light: 400,
            regular: 500,
            semibold: 600,
            bold: 700,
            extrabold: 800,
            black: 900,
        },
        lineHeight: {
            tight: 1.1,
            normal: 1.6,
            relaxed: 1.8,
        },
    },

    // Spacing
    spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem',
        '3xl': '6rem',
        section: {
            small: '4rem',
            medium: '6rem',
            large: '8rem',
        },
        container: {
            maxWidth: '1400px',
            padding: '2rem',
        },
    },

    // Border Radius
    borderRadius: {
        small: '15px',
        medium: '20px',
        large: '25px',
        xlarge: '30px',
        pill: '25px',
        circle: '50%',
    },

    // Shadows
    shadows: {
        small: '0 2px 20px rgba(52, 79, 31, 0.05)',
        medium: '0 10px 30px rgba(52, 79, 31, 0.1)',
        large: '0 20px 60px rgba(52, 79, 31, 0.1)',
        xlarge: '0 20px 60px rgba(52, 79, 31, 0.15)',
        orangeSmall: '0 4px 15px rgba(244, 153, 26, 0.3)',
        orangeLarge: '0 15px 40px rgba(250, 129, 47, 0.4)',
    },

    // Transitions
    transitions: {
        default: 'all 0.3s ease',
        slow: 'all 0.5s ease',
        fast: 'all 0.2s ease',
    },

    // Component Styles
    components: {
        button: {
            primary: {
                background: '#344F1F',
                color: '#F9F5F0',
                padding: '0.6rem 1.5rem',
                borderRadius: '25px',
                fontWeight: 600,
                hover: {
                    background: '#FA812F',
                    transform: 'translateY(-2px)',
                    shadow: '0 4px 15px rgba(250, 129, 47, 0.3)',
                },
            },
            accent: {
                background: 'linear-gradient(135deg, #FA812F 0%, #F4991A 100%)',
                color: 'white',
                padding: '1rem 2.5rem',
                borderRadius: '25px',
                fontWeight: 700,
                fontSize: '1.1rem',
                hover: {
                    background: '#F4991A',
                    transform: 'translateY(-3px)',
                    shadow: '0 15px 40px rgba(250, 129, 47, 0.4)',
                },
            },
        },
        badge: {
            default: {
                background: 'linear-gradient(135deg, #FA812F 0%, #F4991A 100%)',
                color: 'white',
                padding: '0.5rem 1.2rem',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: 600,
                shadow: '0 4px 15px rgba(244, 153, 26, 0.3)',
            },
            light: {
                background: '#F2EAD3',
                color: '#344F1F',
                padding: '0.4rem 1rem',
                borderRadius: '15px',
                fontSize: '0.9rem',
                fontWeight: 600,
            },
        },
        card: {
            default: {
                background: 'white',
                borderRadius: '30px',
                padding: '4rem',
                shadow: '0 20px 60px rgba(52, 79, 31, 0.1)',
                hover: {
                    transform: 'translateY(-10px)',
                },
            },
            dark: {
                background: 'linear-gradient(135deg, #344F1F 0%, #2a3f19 100%)',
                borderRadius: '30px',
                padding: '4rem',
                color: '#F9F5F0',
            },
            light: {
                background: 'rgba(249, 245, 240, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '1.5rem',
            },
        },
    },
} as const;

// CSS-in-JS helper functions
export const getCSSGradient = (gradientKey: keyof typeof designTokens.gradients) => {
    return designTokens.gradients[gradientKey];
};

export const getCSSColor = (
    category: keyof typeof designTokens.colors,
    shade: string
) => {
    return (designTokens.colors[category] as any)[shade];
};

export const getCSSBoxShadow = (shadowKey: keyof typeof designTokens.shadows) => {
    return designTokens.shadows[shadowKey];
};
