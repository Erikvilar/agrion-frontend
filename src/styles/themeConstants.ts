export type ThemeMode = 'light' | 'dark' | 'default';

export interface ColorPalette {
    background: {
        main: string;
        paper: string;
        hover: string;
    };
    // Adicionado especificamente para controlar a tabela independentemente do resto
    table: {
        primary: string;   // Cor do Texto Principal da Listagem
        secondary: string; // Cor do Texto Secundário/Header
        main: string;      // Cor de Fundo do Container da Listagem
        paper: string;     // Cor de Fundo do Cabeçalho (Header)
        hover: string;     // Cor do Hover da linha
    };
    text: {
        primary: string;
        secondary: string;
        disabled: string;
        inverse: string;
        highlight: string;
    };
    border: {
        main: string;
        focus: string;
        divider: string;
    };
    action: {
        activeFilterBg: string;
        inactiveFilterBg: string;
    };
    scroll: {
        track: string;
        thumb: string;
    };
}
export const APP_THEME: Record<ThemeMode, ColorPalette> = {
    dark: {
        background: {
            main: "#09090b",    // Zinc 950 (Fundo profundo)
            paper: "#18181b",   // Zinc 900 (Cards e containers)
            hover: "#27272a",   // Zinc 800
        },
        table: {
            primary: "#fafafa",   // Zinc 50
            secondary: "#a1a1aa", // Zinc 400
            main: "#09090b",
            paper: "#18181b",     // Header sutilmente diferente
            hover: "#1e1e21"      // Hover discreto para não poluir
        },
        text: {
            primary: "#fafafa",
            secondary: "#a1a1aa",
            disabled: "#52525b",
            inverse: "#09090b",
            highlight: "#3b82f6", // Azul de foco profissional em vez de vermelho
        },
        border: {
            main: "#27272a",    // Zinc 800
            focus: "#3b82f6",   // Blue 500
            divider: "#1e1e21", // Divisor sutil
        },
        action: {
            activeFilterBg: "rgba(59, 130, 246, 0.15)", // Azul suave para filtros ativos
            inactiveFilterBg: "transparent",
        },
        scroll: {
            track: "transparent",
            thumb: "#3f3f46",   // Zinc 700
        }
    },

    light: {
        background: {
            main: "#dddddd",    // Zinc 100 (Cinza sutil, evita o branco ofuscante)
            paper: "#ffffff",   // Branco puro para os cards saltarem do fundo
            hover: "#f1f5f9",
        },
        // MANTENDO A TABELA ESCURA NO MODO LIGHT (Padrão Dashboard Industrial)
        table: {
            primary: "#f8fafc",   // Slate 50
            secondary: "#94a3b8", // Slate 400
            main: "#0f172a",      // Slate 900 (Profissionalismo e profundidade)
            paper: "#1e293b",     // Slate 800
            hover: "#334155",     // Slate 700
        },
        text: {
            primary: "#0f172a",   // Slate 900
            secondary: "#475569", // Slate 600
            disabled: "#94a3b8",
            inverse: "#ffffff",
            highlight: "#2563eb",
        },
        border: {
            main: "#e2e8f0",    // Slate 200
            focus: "#3b82f6",
            divider: "#334155", // Divisor para a tabela escura
        },
        action: {
            activeFilterBg: "#e2e8f0",
            inactiveFilterBg: "transparent",
        },
        scroll: {
            track: "#0f172a",
            thumb: "#475569",
        }
    },

    // Default como uma variação 'Steel' (Mais focado em tons frios)
    default: {
        background: {
            main: "#f8fafc",
            paper: "#ffffff",
            hover: "#f1f5f9",
        },
        table: {
            primary: "#0f172a",   // Tabela Clara para o modo default
            secondary: "#64748b",
            main: "#ffffff",
            paper: "#f1f5f9",
            hover: "#f8fafc"
        },
        text: {
            primary: "#0f172a",
            secondary: "#475569",
            disabled: "#94a3b8",
            inverse: "#ffffff",
            highlight: "#0ea5e9",
        },
        border: {
            main: "#e2e8f0",
            focus: "#0ea5e9",
            divider: "#cbd5e1"
        },
        action: {
            activeFilterBg: "rgba(14, 165, 233, 0.1)",
            inactiveFilterBg: "transparent",
        },
        scroll: {
            track: "#f1f5f9",
            thumb: "#cbd5e1",
        }
    }
};