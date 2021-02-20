const Modal = {/* Objeto */
    open() {/* function abrir(método) */
        //Abrir modal
        //Adicionar a class active ao modal
        document.querySelector('.modal-overlay')/* DOM - Todo acesso HTML no objeto | query sselector: pesquisa pelo seletor*/
            .classList.add('active')/* pequisa class acima no doc e adiciona + uma class */
    },
    close() {/* function fechar(método)*/
        //fechar modal
        //remover a class active do modal
        document.querySelector('.modal-overlay')/* DOM - Todo acesso HTML no objeto | query sselector: pesquisa pelo seletor*/
            .classList.remove('active')

    }
}

//Guardar informações no navegador: Local Storage
const Storage = {
    //pegar info
    get(){
        //transformando string em Array | ou retorna Array vazio
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) ||
        []


    },
    set(transactions){
        localStorage.setItem("dev.finances:transactions",//passando chave | identificação
        JSON.stringify(transactions))//JSON: transforma Array em string

    }

}

const Transaction = {/* objeto das transações calculos*/
    // Array&Dados
    all: Storage.get(),//chama get
    
    /*[{
        description: 'Luz',
        amount: -50001,
        date: '23/01/2021'
    }], */

    //Adicionar transações
    add(transaction) {
        Transaction.all.push(transaction)//push insere no Array

        App.reload()
    },

    //Remover transações
    remove(index) {
        Transaction.all.splice(index, 1)//splice: espera posição do Array | remove index 

        App.reload()//remove da tela item excluido

    },

    //entradas
    incomes() {
        let income = 0;
        //para cada transação
        Transaction.all.forEach((transaction) => {//Transaction.all : 
            //se maior q 0
            if (transaction.amount > 0) {
                //somar
                income += transaction.amount;// 0 = 0 + amount0
                // 3 = 3 + amount1
            }

        })
        return income;

    },
    //saídas
    expenses() {
        //somar as saídas
        let expense = 0;
        //para cada transação
        Transaction.all.forEach((transaction) => {
            //se menor q 0
            if (transaction.amount < 0) {
                //somar
                expense += transaction.amount;// 0 = 0 + amount0
                // 3 = 3 + amount1
            }

        })
        return expense;


    },

    total() {
        //entradas - saídas
        return Transaction.incomes() + Transaction.expenses();

    }

}

//Exibição principal do doc
const DOM = {

    transactionsContainer: document.querySelector('#data-table tbody'),/* propriedade: busca no html */
    addTransaction(transaction, index) {//recebe transação e local do doc
        const tr = document.createElement('tr')//criando element tr por js | child
        tr.innerHTML = DOM.innerHtmltransaction(transaction, index)//tr recebe function dentro de DOM e chama transaction
        tr.dataset.index = index//tr recebe index: posção do Array

        DOM.transactionsContainer.appendChild(tr)/* DOM.varivel chama child: tr */
    },

    //cor verde valores | formatação | Adicionar
    innerHtmltransaction(transaction, index) {/* funcionalidade transação interna HTML principal */
        const CSSclass = transaction.amount > 0 ? "income" : "expense" //condição | retorna css nos valores

        const amount = Utils.formatCurrency(transaction.amount)

        /* interpolação vinculando variaveis e exibição */
        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover 
            transação">
        </td>
        `
        return html
    },

    /* Atualização das caixas mostra na tela */
    updateBalance() {
        document.
            getElementById('incomeDisplay')./* pegar elemento pelo ID */
            innerHTML = Utils.formatCurrency(Transaction.incomes())/* Utils.formatCurrency : formatação  */

        document.
            getElementById('expenseDisplay')/* pegar elemento pelo ID */
            .innerHTML = Utils.formatCurrency(Transaction.expenses())

        document.
            getElementById('totalDisplay')/* pegar elemento pelo ID */
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },
    clearTransactions() {/* para não repetir dados ao iniciar */
        DOM.transactionsContainer.innerHTML = ""
    }

}

/* Utilidade & Sinais de - + */
const Utils = {

    //data
    formatDate(date) {
        const splittedDate = date.split("-")//split: separações na string pelo que for passado | tira -

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`//Ordenado Array: dia/mês/ano
    },


    //Conversão valor digitado
    formatAmount(value) {
        value = Number(value.replace(/\,\./g, "")) * 100

        return value
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : "" //transformando em numerico e verificando condição

        /* variação do valor */
        value = String(value).replace(/\D/g, "")//acha tudo q for caractere diferente e deixa vazio, apenas com numeros
        value = Number(value) / 100

        /* Formatação da moeda */
        value = value.toLocaleString("pt-BR", {
            style: "currency",/*moeda */
            currency: "BRL"/* real brasileiro */
        })
        return signal + value /* concatenando e retornando */
    }
}

//Formulario adicionar valores
const Form = {

    //referênciando HTML ao JS
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    //Guardar valores
    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },


    //campos preenchidos?
    validateFields() {
        const { description, amount, date } = Form.getValues()//Pega valores digitados

        //verifica se está vazio
        if (description.trim() === "" || //trim: limpeza de espaço vazio
            amount.trim() === "" ||
            date.trim() === "") {
            throw new Error("Por favor, preencha todos os campos")//throw: empurra | Error: funcionalidade que retorna objeto
        }
    },

    //formatação dados
    formatValues() {
        let { description, amount, date } = Form.getValues()//Pega valores digitados

        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },

    //limpar
    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },



    //ao clicar chama html
    submit(event) {
        event.preventDefault()//não faz padrão | informações 

        //tratamento de Error
        try {//tenta

            Form.validateFields()
            const transaction = Form.formatValues()
            Transaction.add(transaction)//save
            Form.clearFields()
            Modal.close()
          

        } catch (error) {//captura
            alert(error.message)

        }

    }
}

//Execução do App
const App = {
    //inicia App e popula
    init() {
        //forEach objeto para Array | passando informação do array | para cada elemento uma funcionalidade |  DOM.addTransaction(transactions[0]) 
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
        })
        /* chamando atualizando*/
        DOM.updateBalance()

        //atualizando LocalStorage
        Storage.set(Transaction.all)


    },
    //reeleitura 
    reload() {
        DOM.clearTransactions()//limpa App antes de iniciar
        App.init()//popula

    },
}


/* OUT */
App.init()








