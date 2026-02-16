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
            main: "#F8FAFC",      // Slate 50 - Fundo principal (muito comum em dashboards)
            paper: "#FFFFFF",     // Branco puro (cards)
            hover: "#F1F5F9",     // Slate 100 (hover sutil)
        },

        table: {
            primary: "#0F172A",   // Slate 900 (texto forte)
            secondary: "#475569", // Slate 600
            main: "#FFFFFF",      // Fundo da tabela
            paper: "#F8FAFC",     // Cabeçalho / linhas alternadas
            hover: "#E2E8F0",     // Slate 200
        },

        text: {
            primary: "#0F172A",   // Slate 900
            secondary: "#64748B", // Slate 500
            disabled: "#94A3B8",  // Slate 400
            inverse: "#FFFFFF",
            highlight: "#2563EB", // Azul padrão moderno
        },

        border: {
            main: "#E2E8F0",      // Slate 200
            focus: "#3B82F6",     // Azul 500
            divider: "#E2E8F0",
        },

        action: {
            activeFilterBg: "#DBEAFE",  // Azul 100
            inactiveFilterBg: "transparent",
        },

        scroll: {
            track: "#F1F5F9",
            thumb: "#CBD5E1", // Slate 300
        }
    }
    ,

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