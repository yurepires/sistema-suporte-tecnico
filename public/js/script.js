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