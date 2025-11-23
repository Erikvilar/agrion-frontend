import React, { useState } from "react";

import styles from "./suportePage.module.css"
import Adaptive from "../../components/adaptive-component/Component";

type StatusEnum = "critico" | "normal" | "outro";

interface SACDto {
  title: string;
  msg: string;
  status: StatusEnum;
}

const SuportePage = () => {
  const [form, setForm] = useState<SACDto>({
    title: "",
    msg: "",
    status: "normal",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Chamado enviado:", form);

    alert("Chamado enviado com sucesso!");
  };

  return (
    <Adaptive>
      <div className={styles.container}>
        <h2 className={styles.title}>Contato com Suporte</h2>

        <p className={styles.infoText}>
          Você pode abrir um chamado ou entrar em contato pelos meios abaixo:
        </p>

        {/* Opções alternativas */}
        <div className={styles.contactOptions}>
          <a
            className={styles.contactButton}
            href="mailto:suporte@empresa.com"
          >
            📧 Enviar Email
          </a>

          <a
            className={styles.contactButton}
            href="https://wa.me/5599999999999"
            target="_blank"
          >
            💬 WhatsApp
          </a>
        </div>

        {/* Formulário */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>Título do Chamado</label>
          <input
            type="text"
            name="title"
            value={form.title}
            className={styles.input}
            onChange={handleChange}
            placeholder="Ex: Problema ao acessar conta"
          />

          <label className={styles.label}>Descrição / Reclamação</label>
          <textarea
            name="msg"
            value={form.msg}
            className={styles.textarea}
            onChange={handleChange}
            placeholder="Descreva o problema..."
          />

          <label className={styles.label}>Status</label>
          <select
            name="status"
            value={form.status}
            className={styles.select}
            onChange={handleChange}
          >
            <option value="critico">Crítico</option>
            <option value="normal">Normal</option>
            <option value="outro">Outro</option>
          </select>

          <button className={styles.submitBtn} type="submit">
            Abrir Chamado
          </button>
        </form>
      </div>
    </Adaptive>
  );
};

export default SuportePage;
