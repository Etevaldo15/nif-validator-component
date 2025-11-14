(function () {
  if (window.NifValidatorDefined) return;
  window.NifValidatorDefined = true;

  class NifValidator extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.render();
    }

    render() {
      this.shadowRoot.innerHTML = `
          <style>
            :host {
              display: block;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              max-width: 600px;
              margin: 2rem auto;
              padding: 1.5rem;
              background: #f9f9f9;
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            h2 {
              margin-top: 0;
              color: #1a365d;
              text-align: center;
            }
            input {
              width: 100%;
              padding: 0.75rem;
              font-size: 1rem;
              border: 1px solid #ccc;
              border-radius: 6px;
              box-sizing: border-box;
            }
            button {
              width: 100%;
              padding: 0.75rem;
              margin-top: 0.5rem;
              background: #2b6cb0;
              color: white;
              border: none;
              border-radius: 6px;
              font-size: 1rem;
              cursor: pointer;
              transition: background 0.2s;
            }
            button:hover {
              background: #2c5282;
            }
            button:disabled {
              background: #cbd5e0;
              cursor: not-allowed;
            }
            .result {
              margin-top: 1.25rem;
              padding: 1rem;
              border-radius: 6px;
              font-family: monospace;
              white-space: pre-wrap;
              word-break: break-word;
              display: none;
            }
            .valid {
              background: #d4edda;
              color: #155724;
              border: 1px solid #c3e6cb;
            }
            .invalid {
              background: #f8d7da;
              color: #721c24;
              border: 1px solid #f1b0b7;
            }
            .error {
              background: #fff3cd;
              color: #856404;
              border: 1px solid #ffeaa7;
            }
          </style>
          <h2>Validador de NIF Angolano</h2>
          <input type="text" id="nif" placeholder="Ex: 123456789LA001 ou 5000000000" autocomplete="off" />
          <button id="validate">Validar NIF</button>
          <div id="result"></div>
        `;

      this.nifInput = this.shadowRoot.getElementById("nif");
      this.validateBtn = this.shadowRoot.getElementById("validate");
      this.resultDiv = this.shadowRoot.getElementById("result");

      this.validateBtn.addEventListener("click", () => this.validate());
      this.nifInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") this.validate();
      });
    }

    async validate() {
      const nif = this.nifInput.value.trim();
      const resultEl = this.resultDiv;

      // Reset result
      resultEl.style.display = "none";

      if (!nif) {
        resultEl.textContent = "Por favor, insira um NIF.";
        resultEl.className = "result error";
        resultEl.style.display = "block";
        return;
      }

      this.validateBtn.disabled = true;

      try {
        // ⚠️ Em produção, substitua por sua URL pública (ex: https://api.seusistema.ao)
        const res = await fetch(
          `http://localhost:8086/api/v1/validate-nif/${encodeURIComponent(nif)}`
        );
        const data = await res.json();

        const resultText = `NIF: ${data.nif}
  Válido: ${data.is_valid ? "Sim" : "Não"}
  Tipo: ${data.type}
  Mensagem: ${data.message}`;

        resultEl.textContent = resultText;
        resultEl.className = `result ${data.is_valid ? "valid" : "invalid"}`;
        resultEl.style.display = "block";
      } catch (err) {
        console.error("Erro na validação:", err);
        resultEl.textContent =
          "Erro ao conectar com a API. Verifique se o servidor está rodando.";
        resultEl.className = "result error";
        resultEl.style.display = "block";
      } finally {
        this.validateBtn.disabled = false;
      }
    }
  }

  customElements.define("nif-validator", NifValidator);
})();
