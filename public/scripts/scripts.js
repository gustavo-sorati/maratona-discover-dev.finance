const Modal = {
    toggleModal() {
        document.querySelector('.modal-overlay').classList.toggle('active');
    },
};

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finance:transactions")) || [];
    },
    set(transactions) {
        localStorage.setItem("dev.finance:transactions", JSON.stringify(transactions))
    
    }
}

const Transaction = {
    all: Storage.get(),
    add(transaction) {
        Transaction.all.push(transaction);


        App.reload();
    },
    remove(index){
        Transaction.all.splice(index, 1);
        App.reload();
    },
    incomes() {
        let income = 0;

        Transaction.all.forEach((transaction) => {
            if (transaction.amount > 0) {
                income += transaction.amount;
            }
        })
        return income;
    },
    expenses() {
        let expense = 0;

        Transaction.all.forEach((transaction) => {
            if (transaction.amount < 0) {
                expense += transaction.amount;
            }
        });

        return expense;
    },
    total() {
        let total = 0;

        let income = Transaction.incomes();
        let expense = Transaction.expenses();

        return total = income + expense;
    },
};

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr');

        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
        tr.dataset.index = index;
        this.transactionsContainer.appendChild(tr);
    },
    clearTransaction(){
        DOM.transactionsContainer.innerHTML = '';
    },
    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? 'income' : 'expense';

        const amount = Utils.formatCurrency(transaction.amount);

        const html = `
            <td class="data-table__description">${transaction.description}</td>
            <td class="data-table__price-${CSSclass}">${amount}</td>
            <td class="data-table__date">${transaction.date}</td>
            <td><img onClick="Transaction.remove(${index})" src="public/assets/minus.svg" alt="Remover transação"></td>
        `;
        return html;
    },
    updateBalance() {
        document.querySelector('.card__income').innerHTML = Utils.formatCurrency(Transaction.incomes());
        document.querySelector('.card__expense').innerHTML = Utils.formatCurrency(Transaction.expenses());
        document.querySelector('.card__amount').innerHTML = Utils.formatCurrency(Transaction.total());
    },
    
};

const Utils = {
    formatAmout(value) {
        value = Number(value) * 100;
        return value;
    },
    formatCurrency(value) {
        const signal = +value < 0 ? '-' : '';

        // encontre tudo que não é numero
        value = String(value).replace(/\D/gi, '');

        value = Number(value) / 100;

        value = value.toLocaleString('pt-br', {
            style: 'currency',
            currency: 'BRL',
        });

        return signal + value;
    },
    formatDate(date){
        const splitedDate = date.split('-');

        return `${splitedDate[2]}/${splitedDate[1]}/${splitedDate[0]}`;
    }
};

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
    formatValues() {
        let { description, amount, date } = Form.getValues();

        amount = Utils.formatAmout(amount);

        date = Utils.formatDate(date);

        return {description, amount, date}
    },
    validateFields() {
        let { description, amount, date } = Form.getValues();

        if(description.trim() === '' || amount.trim() === "" || date.trim() === '') {
            throw new Error("Porfavor preencha todos os campos");
        }
    },
    clearFields() {
        Form.description.value = '';
        Form.amount.value = '';
        Form.date.value = '';
    },
    submit(event){
        event.preventDefault();

        try {
            Form.validateFields();
            const transaction = Form.formatValues();

            Transaction.add(transaction)
            Form.clearFields();

            Modal.toggleModal();
        } catch (err){
            alert(err.message)
        }
    }
};


const App = {
    init(){
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index);
        })

        DOM.updateBalance();
        Storage.set(Transactions.all);
    },
    reload(){
        DOM.clearTransaction();
        App.init();
    }
}

App.init();

// {
//     description: 'Luz',
//     amount: -10000,
//     date: '23/10/2021',
// },
// {
//     description: 'Criação website',
//     amount: 500000,
//     date: '23/10/2021',
// },
// {
//     description: 'Internet',
//     amount: -20000,
//     date: '23/10/2021',
// },