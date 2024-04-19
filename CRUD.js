console.log('Trabalho 2 - Desenvolvimento Web');

// "MODELO"
const minhaLista = {
    posts: [],

    readComponents(){
        minhaLista.posts.forEach(({id, content}) => {
            minhaLista.criaComponente({id, content: content}, true);
        })
    },

    criaComponente(dados, htmlOnly = false) {
        const idInternoAqui = Date.now();
        if(!htmlOnly){
            minhaLista.posts.push({
                id: dados.id || idInternoAqui,
                content: dados.content
            });
        }
        const $listaDeComponentes = document.querySelector('.listasDeComponentes');
        $listaDeComponentes.insertAdjacentHTML('afterbegin', `
            <li data-id="${idInternoAqui}">
            <input type="checkbox" class="checkbox" data-id="${idInternoAqui}">

                <span contenteditable="false">
                    ${dados.content}
                </span>
                <button class="btn-edit"><img class="edit-img"src= "Site_Lista/editar.png" alt="Editar"></img></button>
                <button class="btn-delete"><img class="delete-img"src= "Site_Lista/deletar.png" alt="Editar"></img></button>
            </li>
        `);
    },

    apagaComponente(id) {
        const listaDeComponentesAtualizada = minhaLista.posts.filter((compAtual) => {
            return compAtual.id !== Number(id);
        })
        console.log(listaDeComponentesAtualizada);
        minhaLista.posts = listaDeComponentesAtualizada;
    },

    atualizaContentDoComponente(id, novoConteudo) {
        const postQueVaiSerAtualizado = minhaLista.posts.find((post) => {
            return post.id === Number(id);
        });
        postQueVaiSerAtualizado.content = novoConteudo;
    }
};


// Código de Front End: Web
document.addEventListener('DOMContentLoaded', function() {
    const $meuForm = document.querySelector('form');

    // CRUD: READ
    minhaLista.readComponents();

    // CRUD: CREATE
    $meuForm.addEventListener('submit', function criaComponenteController(infosDoEvento){
        infosDoEvento.preventDefault(); // Mantém a página estática

        const $campoCriaComponente = document.querySelector('input[name="campoCriaComponente"]');
        minhaLista.criaComponente({content: $campoCriaComponente.value});
        $campoCriaComponente.value = '';
    });

    // CRUD: DELETE
    document.querySelector('.listasDeComponentes').addEventListener('click', function(infosDoEvento){
        console.log('houve um click');
        const elementoAtual = infosDoEvento.target;
        const isBtnDeleteClick = elementoAtual.classList.contains('delete-img');

        if(isBtnDeleteClick){
            console.log('clicou no botao de deletar');
            const id = elementoAtual.parentNode.parentNode.getAttribute('data-id');
            minhaLista.apagaComponente(id);
            elementoAtual.parentNode.parentNode.remove();
            console.log(minhaLista.posts);
        }

        // Habilitar a edição da palavra quando o botao edit for clicado
        const isBtnEditClick = infosDoEvento.target.classList.contains('edit-img');
        if (isBtnEditClick) {
            console.log('clicou no botao de editar');
            const listItem = elementoAtual.closest('li');
            const spanContent = listItem.querySelector('span');
            const id = listItem.getAttribute('data-id');
            const isEditing = spanContent.contentEditable === 'true';

            if (isEditing) {
                // Conclui a edição
                spanContent.contentEditable = false;
                const novoConteudo = spanContent.innerText.trim();
                if (novoConteudo !== '') {
                    minhaLista.atualizaContentDoComponente(id, novoConteudo);
                    elementoAtual.src = 'Site_Lista/editar.png'; // Voltar para a imagem original
                } else {
                    alert('O conteúdo não pode estar vazio!');
                }
            } else {
                // Inicia a edição
                spanContent.contentEditable = true;
                spanContent.focus();
                elementoAtual.src = 'Site_Lista/ok.png'; // Trocar para a nova imagem
            }
        }

        // CRUD: [UPDATE]
        document.addEventListener('click', function (infosDoEvento) {
            const elementoAtual = infosDoEvento.target;
            const id = elementoAtual.closest('li')?.getAttribute('data-id'); // Usando operador de coalescência nula para evitar erros quando não há li

            // Verifica se o botão de editar foi clicado
            if (elementoAtual.classList.contains('edit-img')) {
                const listItem = elementoAtual.closest('li');
                const spanContent = listItem.querySelector('span');

                if (spanContent) {
                    const isEditing = spanContent.contentEditable === 'true';

                    if (isEditing) {
                        // Se a tecla "Enter" for pressionada
                        if (infosDoEvento.key === 'Enter') {
                            infosDoEvento.preventDefault();
                            spanContent.innerHTML += '<br>'; // Insere uma quebra de linha (parágrafo)
                        }
                    }
                }
            }
        });
    });

    document.querySelector('.listasDeComponentes').addEventListener('click', function(infosDoEvento){
        const elementoAtual = infosDoEvento.target;
    
        // Verifica se o clique foi na caixa de seleção (checkbox)
        if (elementoAtual.classList.contains('checkbox')) {
            const id = elementoAtual.getAttribute('data-id');
            const listItem = document.querySelector(`li[data-id="${id}"]`);
            const spanContent = listItem.querySelector('span');
    
            // Riscar o conteúdo se a caixa estiver marcada, caso contrário, remover o risco
            if (elementoAtual.checked) {
                spanContent.style.textDecoration = 'line-through';
            } else {
                spanContent.style.textDecoration = 'none';
            }
        }
    });
});
