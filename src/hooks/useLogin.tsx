// @ts-ignore
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActionType } from "@/components/modal-informativo/Component";
import ApiServices from "@/services/api-service";
import { initializeWebSocket } from "@/services/websocket/InitializeWebSocket";
import { useNotification } from "@/hooks/useNotification";

export const useLogin = (
    loaderRef: React.RefObject<any>,
    isMobile: boolean
) => {
    const navigate = useNavigate();
    const { showNotification, NotificationModal } = useNotification();

    const [state, setState] = useState({
        login: "",
        password: "",
        avatar: "",
        showPassword: false,
    });

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setState((prev) => ({ ...prev, [name]: value }));
    };

    const handleClickShowPassword = () => setState((prev) => ({ ...prev, showPassword: !prev.showPassword }));

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const validateForm = (): boolean => {
        if (!state.login.trim()) {
            showNotification(ActionType.Warning, "Login inválido", "Por favor, preencha o campo de login.", () => {});
            return false;
        }
        if (!state.password.trim()) {
            showNotification(ActionType.Warning, "Senha vazia", "Por favor, informe sua senha.", () => {});
            return false;
        }
        return true;
    };

    const submitLogin = async () => {
        if (!validateForm()) return;

        loaderRef.current?.start();

        try {
            const { success, data, message } = await ApiServices.login({
                login: state.login,
                password: state.password
            });

            if (success && data) {
                const { token, fullName, login, avatar, roles } = data;

                localStorage.setItem("token", token);
                localStorage.setItem("user", fullName || "");
                localStorage.setItem("login", login);
                localStorage.setItem("avatar", avatar || "");
                localStorage.setItem("roles", JSON.stringify(roles));

                initializeWebSocket(roles, token);

                navigate(isMobile ? "/agrion/controle" : "/agrion/principal");
            } else {
                showNotification(ActionType.Warning, "Falha no Login", message || "Credenciais inválidas", () => {});
            }
        } catch (error) {
            console.error(error);
            showNotification(ActionType.Error, "Erro de Conexão", "Não foi possível conectar ao servidor.", () => {});
        } finally {
            loaderRef.current?.done();
        }
    };
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') submitLogin();
    };

    return {
        login: state.login,
        password: state.password,
        avatar: state.avatar,
        showPassword: state.showPassword,
        handleClickShowPassword,
        handleMouseDownPassword,
        handleLoginChange,
        handleKeyDown,
        submitLogin,
        NotificationModal
    };
};