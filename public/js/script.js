function excluirAtendimento(id){
    if(confirm('Tem certeza que deseja excluir este atendimento?')){
        window.location.href='/atendimentos/cancelar/'+id;
    }
}

function excluirChamado(id){
    window.location.href='/chamados/excluir/'+id;
}

function excluirPessoa(){
    if(confirm('Tem certeza que deseja excluir seu cadastro?')){
        window.location.href='/pessoa/excluir';
    }
}

function adminExcluirPessoa(id){
    window.location.href='/pessoa/excluir/'+id;
}

function adminExcluirUsuario(id){
    window.location.href='/usuario/excluir/'+id;
}

function excluirFeedback(id){
    window.location.href='/feedback/excluir/'+id;
}

function adminExcluirTecnico(id){
    if(confirm('Tem certeza que deseja excluir esse técnico?')){
        window.location.href='/tecnico/excluir/'+id;
    }
}