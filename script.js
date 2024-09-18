'use strict';

//BANKIST APP

// Data
const account1 = {
  owner: 'Chrishtan harper',
  movements: [2000090, 45090900.23, -40990.00, 3008900.43, -658780.21, -1387890.234, 789790.009, 133300.56],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2023-06-06T23:36:17.929Z',
    '2023-06-08T10:51:36.790Z',
  ],
  currency: 'KRW',
  locale: 'ko-KR', 
};

const account2 = {
  owner: 'Rhys Larson',
  movements: [5000.34, 3400.657, -150.43, -790.67, -3210.89, -1000.99, 8500.97, -30.98],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2024-06-25T18:49:59.371Z',
    '2024-06-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Sona Raj singh',
  movements: [20000, 390000,990309909, 99999,68798,67808,7988,798090],
  interestRate: 0.1,
  pin: 2611,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-11-25T14:18:46.235Z',
    '2020-12-05T16:33:06.386Z',
    '2020-10-10T14:43:26.374Z',
    '2020-11-25T18:49:59.371Z',
    '2020-06-26T12:01:20.894Z',
  ],
  currency: 'JPY',
  locale: 'ja-JP',
}
const account4 = {
  owner: 'Aditya singh',
  movements: [2000000, 299000, 3000, 90909, 798080,798080,989808,79880],
  interestRate: 0.1,
  pin: 6969,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-02-25T06:04:23.907Z',
    '2020-11-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-05-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'INR',
  locale: 'hi-IN',
}

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

let currentAccount, timer;

const formatDate = function(date,locale){
  const calcDayPassed = (date1, date2) => Math.round(Math.abs(date2-date1)/ (1000*60*60*24));

  const passedDays = calcDayPassed(new Date(),date)
  console.log(passedDays);
  if(passedDays === 0) return 'Today';
  if(passedDays === 1) return 'Yesterday'
  if(passedDays <= 7) return `${passedDays} days ago`;return new Intl.DateTimeFormat(locale).format(date);
  };
const formatCur = function(value, locale, currency){
  return new Intl.NumberFormat(locale,{
    style: 'currency',
    currency: currency
  }).format(value);
}

// movements array of accounts
const displayMovement = function(acc, sort = false){
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a,b) => a-b) : acc.movements;

  movs.forEach(function(mov,i){
    const type = mov>0?'deposit':'withdrawal';
    const date = new Date(acc.movementsDates[i])
    const displayDate = formatDate(date,acc.locale);

    const formatedMov = formatCur(mov, acc.locale, acc.currency);
    
    new Intl.NumberFormat(acc.locale,{
      style: 'currency',
      currency: acc.currency
    }).format(mov);


    const html = `
          <div class="movements__row">
          <div class ="movements__type movements__type--${type}"> ${i+1} ${type} </div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formatedMov}</div>
        </div>
        `;
        containerMovements.insertAdjacentHTML("afterbegin", html);
      });
  }

  // creat username of the account owner
  const creatUsernames = function(acc){
    acc.forEach(function(acc){
      acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
    })
  };
  creatUsernames(accounts)

  // display the current balance of the loged in account
  const calcDisplayBalance = function(acc){
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
    labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
  };
  
  // display in, out and interset of the accout logged in.
  const calcDisplaySummary = function(acc){
    const incomes = acc.movements
    .filter(mov => mov>0)
    .reduce((acc,mov)=>acc+mov,0)
    labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);
  
    const out = acc.movements
    .filter(mov => mov<0)
    .reduce((acc,mov) => acc+mov, 0);
    labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);
  
    const interest = acc.movements
    .filter(mov => mov>0)
    .map(deposite => deposite *1.2/100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc,int)=> acc+int, 0);
    labelSumInterest.textContent= formatCur(interest, acc.locale, acc.currency);
  };

  const updateUI = function(acc){
    // Display movements
    displayMovement(acc);
    //Display balance
    calcDisplayBalance(acc);
    //Display summary
    calcDisplaySummary(acc);
  }

  const startLogOutTimer = function(){
    const tick = function(){
      const min = String(Math.trunc(t/60)).padStart(2,0);
      const sec = String(t%60).padStart(2,0);
        //In each call, print the remaining time to UI
        labelTimer.textContent = `${min}:${sec}`;
        
      //When 0 second, stop timer and log out the user
        if(t === 0){
          clearInterval(timer);
          labelWelcome.textContent = 'Log in to get started'
          containerApp.style.opacity = 0;
        }

        //Remove 1sec
        t--;
    };
    // Set timer to 5 minutes
    let t = 300;
    // Call the timer every second
    tick();
    const timer = setInterval(tick, 1000);
    return timer;
 };

//  Fake Login
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;


// Login to the account
btnLogin.addEventListener('click',function(e){
  //prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(acc =>acc.username === inputLoginUsername.value);
  if(currentAccount?.pin === Number(inputLoginPin.value)){
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    
    // using internationalization API
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long'
    };
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);

    // Clear input field
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if(timer) clearInterval(timer);
    timer = startLogOutTimer();

    updateUI(currentAccount);
    }
  });

  //transfer money between accounts

  btnTransfer.addEventListener('click', function(e){
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);
    const receiverAcc = accounts.find(acc =>acc.username === inputTransferTo.value);
    inputTransferAmount.value = inputTransferTo.value ='';
    if(amount > 0 && 
      currentAccount.balance >= amount && 
      receiverAcc?.username !== currentAccount.username)
      {
        //Doing the transfer
        currentAccount.movements.push(-amount);
        receiverAcc.movements.push(amount);

        //Add transfer date
        currentAccount.movementsDates.push(new Date().toISOString());
        receiverAcc.movementsDates.push(new Date().toISOString());

        updateUI(currentAccount);

        //Reset the timer
        clearInterval(timer);
        timer = startLogOutTimer();
    }
  });
  btnLoan.addEventListener('click',function(e){
    e.preventDefault();

    const amount = Math.floor(inputLoanAmount.value);
    if(amount > 0 && currentAccount.movements.some(mov => mov>= amount * 0.1)){
      // add the movement
      setTimeout(function(){
        currentAccount.movements.push(amount);
        currentAccount.movementsDates.push(new Date().toISOString());
        //Update UI
        updateUI(currentAccount)

        //Reset the timer
        clearInterval(timer);
        timer = startLogOutTimer();
      },2500)
      inputLoanAmount.value='';
  }
});

  let sorted = false;

  btnSort.addEventListener('click',function(e){
    e.preventDefault();
    displayMovement(currentAccount, !sorted);
    sorted = !sorted
  });


  btnClose.addEventListener('click',function(e){
    e.preventDefault();
    if(inputCloseUsername.value === currentAccount.username &&
      Number(inputClosePin.value) === currentAccount.pin){
        const index = accounts.findIndex(acc => acc.username === currentAccount.username);
        accounts.splice(index, 1);
        labelWelcome.textContent = `Log in to get started`

        containerApp.style.opacity = 0;
      }
      inputCloseUsername.value=inputClosePin.value='';
  })
