const Storage = {
  get() {
    return JSON.parse(localStorage.getItem('dev.finance:transactions')) || [];
  },
  set(transactions) {
    localStorage.setItem(
      'dev.finance:transactions',
      JSON.stringify(transactions),
    );
  },
};

const Transaction = {
  all: Storage.get(),
  add(transaction) {
    if(transaction.edit === "true"){
      Transaction.all[transaction.transactionEditNumber] = transaction;
    } else {
      Transaction.all.push(transaction);
    }

    App.reload();
  },
  edit(index) {
    Modal.setValues(Transaction.all[index], index);
    Modal.open();
  },
  remove(index) {
    Transaction.all.splice(index, 1);
    App.reload();
  },
  incomes() {
    let income = 0;

    Transaction.all.forEach((transaction) => {
      if (transaction.amount > 0) {
        income += transaction.amount;
      }
    });
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

    return (total = income + expense);
  },
};

const Modal = {
  modalOverlay: document.querySelector('.modal-overlay'),
  open() {
    Modal.modalOverlay.classList.add('active');
  },
  close() {
    Modal.modalOverlay.classList.remove('active');
    Form.clearFields();
  },
  setValues(transaction, index) {
    document.querySelector('.modal-overlay #description').value = transaction.description;
    document.querySelector('.modal-overlay #amount').value = Utils.formatAmountToModal(transaction.amount);
    document.querySelector('.modal-overlay #date').value = Utils.formatDateToModal(transaction.date);
    document.querySelector('.modal-overlay #edit').value = "true";
    document.querySelector('.modal-overlay #edit').dataset.index = index;
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
  clearTransaction() {
    DOM.transactionsContainer.innerHTML = '';
  },
  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? 'income' : 'expense';

    const amount = Utils.formatCurrency(transaction.amount);

    const html = `
            <td class="data-table__description">${transaction.description}</td>
            <td class="data-table__price-${CSSclass}">${amount}</td>
            <td class="data-table__date">${transaction.date}</td>
            <td>
              <img class="data-table-edit" onClick="Transaction.edit(${index})" src="public/assets/edit.svg" alt="Editar transação">
              <img onClick="Transaction.remove(${index})" src="public/assets/minus.svg" alt="Remover transação">
            </td>
        `;
    return html;
  },
  updateBalance() {
    document.querySelector('.card__income').innerHTML = Utils.formatCurrency(
      Transaction.incomes(),
    );
    document.querySelector('.card__expense').innerHTML = Utils.formatCurrency(
      Transaction.expenses(),
    );
    document.querySelector('.card__amount').innerHTML = Utils.formatCurrency(
      Transaction.total(),
    );
  },
};

const Utils = {
  formatAmout(value) {
    value = Number(value) * 100;
    return Math.round(value);
  },
  formatAmountToModal(value){
    value = value / 100 

    return value.toFixed(2)
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
  formatDate(date) {
    const splitedDate = date.split('-');

    return `${splitedDate[2]}/${splitedDate[1]}/${splitedDate[0]}`;
  },
  formatDateToModal(date) {
    const splitedDate = date.split('/');

    return `${splitedDate[2]}-${splitedDate[1]}-${splitedDate[0]}`;
  }
};

const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),
  edit: document.querySelector('input#edit'),

  getValues() {    
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
      edit: Form.edit.value,
      transactionEditNumber: Form.edit.dataset.index
    };
  },
  formatValues() {
    let { description, amount, date, edit, transactionEditNumber } = Form.getValues();

    amount = Utils.formatAmout(amount);

    date = Utils.formatDate(date);

    return { description, amount, date, edit, transactionEditNumber };
  },
  validateFields() {
    let { description, amount, date } = Form.getValues();
    
    if (
      description.trim() === '' ||
      amount.trim() === '' ||
      date.trim() === ''
    ) {
      throw new Error('Porfavor preencha todos os campos');
    }
  },
  clearFields() {
    Form.description.value = '';
    Form.amount.value = '';
    Form.date.value = '';
    Form.edit.dataset.index = '';
    Form.edit.value = 'false';
    
  },
  submit(event) {
    event.preventDefault();

    try {
      Form.validateFields();
      const transaction = Form.formatValues();
      Transaction.add(transaction);
      Form.clearFields();

      Modal.close();
    } catch (err) {
      alert(err.message);
    }
  },
};

const App = {
  init() {
    Transaction.all.forEach((transaction, index) => {
      DOM.addTransaction(transaction, index);
    });

    DOM.updateBalance();
    Storage.set(Transaction.all);
  },
  reload() {
    DOM.clearTransaction();
    App.init();
  },
};

App.init();
