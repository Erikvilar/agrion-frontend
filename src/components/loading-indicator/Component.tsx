import { Box } from "@mui/material";
import {
    useState,
    useImperativeHandle,
    forwardRef,
    type Ref,
    type CSSProperties
} from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
export interface LoadingIndicatorRef {
    start: () => void;
    done: () => void;
}

interface LoadingIndicatorProps {
    image?: string;
}

const LoadingIndicator = forwardRef(
    (props: LoadingIndicatorProps, ref: Ref<LoadingIndicatorRef>) => {
        const [visible, setVisible] = useState(false);
        const isMobile = useIsMobile();
        useImperativeHandle(ref, () => ({
            start() {
                setVisible(true);
            },
            done() {
                setVisible(false);
            }
        }));

        return (
            <Box>
                {visible && <Box sx={styles.background} />}
                <div
                    style={{
                        ...styles.overlay,
                        transform: visible ? "translateY(0)" : "translateY(-120px)",
                        opacity: visible ? 1 : 0,
                        position: "fixed",
                        top: "35%",
                        left: isMobile ? "28%" : "45%",


                    }}
                >
                    <div style={styles.loaderWrapper}>
                        <div style={styles.spinner}></div>
                        <img
                            src="https://www.datagroconferences.com/wp-content/uploads/2021/06/Agrionfertilizantes_site-1.png"
                            alt="logo"
                            style={styles.image}
                        />

                    </div>
                    <span style={{
                        color: "white", fontSize: 28, fontWeight:200, position: "absolute", top:  190, left: 28, fontFamily:"Roboto"
                    }}>Aguarde ...</span>
                </div>

            </Box>
        );
    }
);


const styles: Record<string, CSSProperties> = {
    background: {
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9997,
        backgroundColor: "black",
        opacity: 0.9,
        width: "100vw",
        height: "100vh",
    },
    overlay: {

        zIndex: 9998,
        padding: "10px",
        transition: "transform 0.4s ease, opacity 0.4s ease",
    },
    loaderWrapper: {
        position: "relative",
        transform: 'translate(-10%, -10%)',
        width: "160px",
        height: "160px",
    },
    spinner: {
        border: "1px solid #f3f3f3",
        borderTop: "2px solid #34db58ff",
        borderRadius: "50%",
        width: "180px",
        zIndex: 9999,
        height: "180px",
        animation: "spin 1s linear infinite",
        position: "absolute",
        top: 0,
        left: 0,
    },
    image: {
        width: "160px",
        height: "120px",
        borderRadius: "50%",
        position: "absolute",
        top: "50%",
        left: "55%",
        transform: "translate(-50%, -50%)",
    },
};
if (typeof document !== "undefined") {
    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(
        `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `,
        styleSheet.cssRules.length
    );
}

export default LoadingIndicator;