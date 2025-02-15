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

function excluirFeedback(id){
    if(confirm('Tem certeza que deseja excluir esse feedback?')){
        window.location.href='/feedback/excluir/'+id;
    }
}