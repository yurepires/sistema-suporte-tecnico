function excluirAtendimento(id){
    if(confirm('Tem certeza que deseja excluir este atendimento?')){
        window.location.href='/atendimentos/cancelar/'+id;
    }
}

function excluirChamado(id){
    if(confirm('Tem certeza que deseja excluir este chamado?')){
        window.location.href='/chamados/excluir/'+id;
    }
}

function excluirPessoa(){
    if(confirm('Tem certeza que deseja excluir seu cadastro?')){
        window.location.href='/pessoa/excluir';
    }
}

function adminExcluirPessoa(id){
    if(confirm('Tem certeza que deseja excluir este cadastro?')){
        window.location.href='/pessoa/excluir/'+id;
    }
}

function adminExcluirUsuario(id){
    if(confirm('Tem certeza que deseja excluir este usuario?')){
        window.location.href='/usuario/excluir/'+id;
    }
}

function excluirFeedback(id){
    if(confirm('Tem certeza que deseja excluir esse feedback?')){
        window.location.href='/feedback/excluir/'+id;
    }
}