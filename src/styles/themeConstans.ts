export type ThemeMode = 'light' | 'dark' | 'default';

export interface ColorPalette {
    background: {
        main: string;
        paper: string;
        hover: string;
    };
    // Adicionado especificamente para controlar a tabela independentemente do resto
    table: {
        primary: string;   // Cor do Texto Principal da Tabela
        secondary: string; // Cor do Texto Secundário/Header
        main: string;      // Cor de Fundo do Container da Tabela
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
            main: "#09090b",
            paper: "#18181b",
            hover: "#27272a",
        },
        table: {
            primary: "#ffffff",
            secondary: "#9ca3af",
            main: "#09090b",
            paper: "#18181b",
            hover: "#27272a"
        },
        text: {
            primary: "#ffffff",
            secondary: "#9ca3af",
            disabled: "#52525b",
            inverse: "#ffffff",
            highlight: "#ef4444",
        },
        border: {
            main: "#27272a",
            focus: "#3b82f6",
            divider: "#27272a",
        },
        action: {
            activeFilterBg: "rgba(255, 255, 255, 0.1)",
            inactiveFilterBg: "transparent",
        },
        scroll: {
            track: "#09090b",
            thumb: "#27272a",
        }
    },

    light: {
        background: {
            main: "#E0E2E5",    // Fundo da tela (Cinza Cimento)
            paper: "#F0F2F5",   // Fundo de cards normais (Claro)
            hover: "#D1D5DB",
        },
        // CONFIGURAÇÃO DA TABELA ESCURA NO MODO LIGHT
        table: {
            primary: "#FFFFFF",   // Texto agora é BRANCO puro para contraste
            secondary: "#9CA3AF", // Texto secundário cinza claro
            main: "#111827",      // Fundo da tabela (Quase Preto - Gray 900)
            paper: "#1F2937",     // Fundo do Cabeçalho (Um pouco mais claro que o fundo - Gray 800)
            hover: "#374151",     // Hover cinza chumbo
        },
        text: {
            primary: "#111827",
            secondary: "#374151",
            disabled: "#9CA3AF",
            inverse: "#ffffff",
            highlight: "#B91C1C",
        },
        border: {
            main: "#94A3B8",
            focus: "#2563EB",
            divider: "#374151", // Divisórias mais escuras para combinar com a tabela preta
        },
        action: {
            activeFilterBg: "rgba(0, 0, 0, 0.08)",
            inactiveFilterBg: "transparent",
        },
        scroll: {
            track: "#111827",   // Scrollbar combina com a tabela escura
            thumb: "#4B5563",
        }
    },

    default: {
        background: {
            main: "#E0E2E5",
            paper: "#F0F2F5",
            hover: "#D1D5DB",
        },
        table: {
            primary: "#FFFFFF",
            secondary: "#9CA3AF",
            main: "#111827",
            paper: "#1F2937",
            hover: "#374151",
        },
        text: {
            primary: "#111827",
            secondary: "#374151",
            disabled: "#9CA3AF",
            inverse: "#ffffff",
            highlight: "#B91C1C",
        },
        action: {
            activeFilterBg: "rgba(0, 0, 0, 0.08)",
            inactiveFilterBg: "transparent",
        },
        scroll: {
            track: "#111827",
            thumb: "#4B5563",
        },
        border: {
            main: "#94A3B8",
            focus: "#4f4f4f",
            divider: "#374151"
        }
    }
};