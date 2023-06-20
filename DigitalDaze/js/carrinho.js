// carrinho

// variável modalKey sera global
let modalKey = 0

// variavel para controlar a quantidade inicial de notes na modal
let quantnotes = 1

let cart = []

// funcoes auxiliares ou uteis
const seleciona = (elemento) => document.querySelector(elemento)
const selecionaTodos = (elemento) => document.querySelectorAll(elemento)

const formatoReal = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false })
}

const formatoMonetario = (valor) => {
    if(valor) {
        return valor.toFixed(2)
    }
}

const abrirModal = () => {
    seleciona('.noteWindowArea').style.opacity = 0 // transparente
    seleciona('.noteWindowArea').style.display = 'flex'
    setTimeout(() => seleciona('.noteWindowArea').style.opacity = 1, 150)
}

const fecharModal = () => {
    seleciona('.noteWindowArea').style.opacity = 0 // transparente
    setTimeout(() => seleciona('.noteWindowArea').style.display = 'none', 500)
}

const botoesFechar = () => {
    // BOTOES FECHAR MODAL
    selecionaTodos('.noteInfo--cancelButton, .noteInfo--cancelMobileButton').forEach( (item) => item.addEventListener('click', fecharModal) )
}

const preencheDadosDasnotes = (noteItem, item, index) => {

    // setar um atributo para identificar qual elemento foi clicado
	noteItem.setAttribute('data-key', index)
    noteItem.querySelector('.note-item--img img').src = item.img
    noteItem.querySelector('.note-item--price').innerHTML = formatoReal(item.price[2])
    noteItem.querySelector('.note-item--name').innerHTML = item.name
    noteItem.querySelector('.note-item--desc').innerHTML = item.description
}

const preencheDadosModal = (item) => {
    seleciona('.noteBig img').src = item.img
    seleciona('.noteInfo h1').innerHTML = item.name
    seleciona('.noteInfo--desc').innerHTML = item.description
    seleciona('.noteInfo--actualPrice').innerHTML = formatoReal(item.price[2])
}

const pegarKey = (e) => {
    // .closest retorna o elemento mais proximo
    // .note-item vai pegar o valor do atributo data-key
    let key = e.target.closest('.note-item').getAttribute('data-key')
    console.log('note clicada ' + key)
    console.log(noteJson[key])

    // garantir que a quantidade inicial de notes é 1
    quantnotes = 1

    // Para manter a informação de qual note foi clicada
    modalKey = key

    return key
}

const preenchercapacidades = (key) => {
    // tirar a selecao da capacidade atual e selecionar a capacidade maior
    seleciona('.noteInfo--size.selected').classList.remove('selected')

    // selecionar todas as capacidades
    selecionaTodos('.noteInfo--size').forEach((size, sizeIndex) => {
        // selecionar a capacidade maior
        (sizeIndex == 2) ? size.classList.add('selected') : ''
        size.querySelector('span').innerHTML = noteJson[key].sizes[sizeIndex]
    })
}

const escolhercapacidadePreco = (key) => {
    // Ações nos botões de capacidade
    // selecionar todos as capacidades
    selecionaTodos('.noteInfo--size').forEach((size, sizeIndex) => {
        size.addEventListener('click', (e) => {
            // clicou em um item, tirar a selecao dos outros e marca o q clicou
            // tirar a selecao da capacidade atual e selecionar a capacidade maior
            seleciona('.noteInfo--size.selected').classList.remove('selected')
            // marcar o que clicou
            size.classList.add('selected')

            // mudar o preço de acordo com a capacidade
            seleciona('.noteInfo--actualPrice').innerHTML = formatoReal(noteJson[key].price[sizeIndex])
        })
    })
}

const mudarQuantidade = () => {
    // Ações nos botões + e - da janela modal
    seleciona('.noteInfo--qtmais').addEventListener('click', () => {
        quantnotes++
        seleciona('.noteInfo--qt').innerHTML = quantnotes
    })

    seleciona('.noteInfo--qtmenos').addEventListener('click', () => {
        if(quantnotes > 1) {
            quantnotes--
            seleciona('.noteInfo--qt').innerHTML = quantnotes	
        }
    })
}

const adicionarNoCarrinho = () => {
    seleciona('.noteInfo--addButton').addEventListener('click', () => {
        console.log('Adicionar no carrinho')

        // pegar dados da janela modal atual
    	// modalKey para usar noteJson[modalKey]
    	console.log("note " + modalKey)
    	// capacidade
	    let size = seleciona('.noteInfo--size.selected').getAttribute('data-key')
	    console.log("capacidade " + size)
	    // quantidade
    	console.log("Quant. " + quantnotes)
        // preco
        let price = seleciona('.noteInfo--actualPrice').innerHTML.replace('R$&nbsp;', '')
    
        // identificador que junta id e capacidade e concatene as duas informacoes separadas por um símbolo
	    let identificador = noteJson[modalKey].id+'t'+size

        // verifica se ja tem aquele codigo e capacidade
        let key = cart.findIndex( (item) => item.identificador == identificador )
        console.log(key)

        if(key > -1) {
            // se encontrar aumenta a quantidade
            cart[key].qt += quantnotes
        } else {
            // adicionar objeto note no carrinho
            let note = {
                identificador,
                id: noteJson[modalKey].id,
                size, // size: size
                qt: quantnotes,
                price: parseFloat(price) // price: price
            }
            cart.push(note)
            console.log(note)
            console.log('Sub total R$ ' + (note.qt * note.price).toFixed(2))
        }

        fecharModal()
        abrirCarrinho()
        atualizarCarrinho()
    })
}

const abrirCarrinho = () => {
    console.log('Qtd de itens no carrinho ' + cart.length)
    if(cart.length > 0) {
        // mostrar o carrinho
	    seleciona('aside').classList.add('show')
        seleciona('header').style.display = 'flex' // mostrar barra superior
    }

    // exibir aside do carrinho no modo mobile
    seleciona('.menu-openner').addEventListener('click', () => {
        if(cart.length > 0) {
            seleciona('aside').classList.add('show')
            seleciona('aside').style.left = '0'
        }
    })
}

const fecharCarrinho = () => {
    // fechar o carrinho com o botão X no modo mobile
    seleciona('.menu-closer').addEventListener('click', () => {
        seleciona('aside').style.left = '100vw'
        seleciona('header').style.display = 'flex'
    })
}

const atualizarCarrinho = () => {
    // exibir número de itens no carrinho
	seleciona('.menu-openner span').innerHTML = cart.length
	
	// mostrar ou nao o carrinho
	if(cart.length > 0) {

		// mostrar o carrinho
		seleciona('aside').classList.add('show')

		// zerar para nao fazer insercoes duplicadas
		seleciona('.cart').innerHTML = ''

        // crie as variaveis antes do for
		let subtotal = 0
		let desconto = 0
		let total    = 0

        // para preencher os itens do carrinho, calcular subtotal
		for(let i in cart) {
			// use o find para pegar o item por id
			let noteItem = noteJson.find( (item) => item.id == cart[i].id )
			console.log(noteItem)

            // em cada item pegar o subtotal
        	subtotal += cart[i].price * cart[i].qt

			// fazer o clone, exibir na telas e depois preencher as informacoes
			let cartItem = seleciona('.models .cart--item').cloneNode(true)
			seleciona('.cart').append(cartItem)

			let notesizeName = cart[i].size

			let noteName = `${noteItem.name}`

			// preencher as informacoes
			cartItem.querySelector('img').src = noteItem.img
			cartItem.querySelector('.cart--item-nome').innerHTML = noteName
			cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

			// selecionar botoes + e -
			cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
				console.log('Clicou no botão mais')
				// adicionar apenas a quantidade que esta neste contexto
				cart[i].qt++
				// atualizar a quantidade
				atualizarCarrinho()
			})

			cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
				console.log('Clicou no botão menos')
				if(cart[i].qt > 1) {
					// subtrair apenas a quantidade que esta neste contexto
					cart[i].qt--
				} else {
					// remover se for zero
					cart.splice(i, 1)
				}

                (cart.length < 1) ? seleciona('header').style.display = 'flex' : ''

				// atualizar a quantidade
				atualizarCarrinho()
			})

			seleciona('.cart').append(cartItem)

		} 

		desconto = subtotal * 0
		total = subtotal - desconto

		// exibir na tela os resultados
		seleciona('.subtotal span:last-child').innerHTML = formatoReal(subtotal)
		seleciona('.desconto span:last-child').innerHTML = formatoReal(desconto)
		seleciona('.total span:last-child').innerHTML    = formatoReal(total)

	} else {
		// ocultar o carrinho
		seleciona('aside').classList.remove('show')
		seleciona('aside').style.left = '100vw'
	}
}

const finalizarCompra = () => {
    seleciona('.cart--finalizar').addEventListener('click', () => {
        console.log('Finalizar compra')
        seleciona('aside').classList.remove('show')
        seleciona('aside').style.left = '100vw'
        seleciona('header').style.display = 'flex'
    })
}

// MAPEAR noteJson para gerar lista de notes
noteJson.map((item, index ) => {
    //console.log(item)
    let noteItem = document.querySelector('.models .note-item').cloneNode(true)
    //console.log(noteItem)
    //document.querySelector('.note-area').append(noteItem)
    seleciona('.note-area').append(noteItem)

    // preencher os dados de cada note
    preencheDadosDasnotes(noteItem, item, index)
    
    // note clicado
    noteItem.querySelector('.note-item a').addEventListener('click', (e) => {
        e.preventDefault()
        console.log('Clicou na note')

        let chave = pegarKey(e)

        // abrir janela modal
        abrirModal()

        // preenchimento dos dados
        preencheDadosModal(item)

        // pegar capacidade selecionada
        preenchercapacidades(chave)

		// definir quantidade inicial como 1
		seleciona('.noteInfo--qt').innerHTML = quantnotes

        // selecionar a capacidade e preco com o clique no botao
        escolhercapacidadePreco(chave)

    })

    botoesFechar()

})

mudarQuantidade()
adicionarNoCarrinho()
atualizarCarrinho()
fecharCarrinho()
finalizarCompra()
