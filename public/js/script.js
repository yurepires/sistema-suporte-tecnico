function excluirProduto(id){
    if(confirm('Tem certeza que deseja excluir o atendimento"'+id+'"?')){
        window.location.href='/atendimentos/excluir/'+id;
    }
}