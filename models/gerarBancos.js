import Atendimento from "./Atendimento.js";
import Chamado from "./Chamado.js";
import Feedback from "./Feedback.js";
import Pessoa from "./Pessoa.js";
import Tecnico from "./Tecnico.js";
import Usuario from "./Usuario.js";

// sequencia correta para criar cada tabela
Pessoa.sync()
    .then(() => Usuario.sync())
    .then(() => Tecnico.sync())
    .then(() => Chamado.sync())
    .then(() => Atendimento.sync())
    .then(() => Feedback.sync());