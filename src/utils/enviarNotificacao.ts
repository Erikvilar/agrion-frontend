export function enviarNotificacao(mensagem: string, numero: string) {
    if (!numero || !mensagem) return alert("Preencha número e mensagem!");

    // Remove tudo que não for número
    let numeroLimpo = numero.replace(/\D/g, "");

    // Adiciona o código do Brasil (+55) caso não esteja presente
    if (!numeroLimpo.startsWith("55")) {
        numeroLimpo = "55" + numeroLimpo;
    }

    // Validação do número brasileiro (DDD + celular)
    const regexCelularBR = /^55([1-9]{2})(9?[0-9]{8})$/;
    if (!regexCelularBR.test(numeroLimpo)) {
        return alert("Número inválido. Use DDD + número do celular.");
    }

    const mensagemEncode = encodeURIComponent(mensagem);
    const link = `https://wa.me/${numeroLimpo}?text=${mensagemEncode}`;
    window.open(link, "_blank");
};
