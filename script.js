'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const account5 = {
//   owner: 'Osman Tangoren',
//   movements: [240, 760, 1100, -500, 20, -60, 750, 7000, -2500, 110],
//   interestRate: 1.8,
//   pin: 5555,
// };

// const accounts = [account1, account2, account3, account4, account5];

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

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

/////////////////////////////////////////////////
// Functions

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  // If sort true, copy of a movements array sorted in a ascending order. If sort is false, simply show original movements array which by default sorted descending.
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">#${
      i + 1
    } &rarr; ${type}</div>
      <div class="movements__value">${mov.toFixed(2)}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// display movements

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};
// calc and display balance

const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${income.toFixed(2)}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(out.toFixed(2))}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // New feature: If interest at least 1 EUR
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};
// calc and display summary

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name.at(0))
      .join('');
  });
};
createUsernames(accounts);
// create usernames

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};
// update ui

// event handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  // console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner
      .split(' ')
      .at(0)}!`;

    containerApp.style.opacity = 1;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';

    inputLoginUsername.blur();
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});
// login feature

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  inputTransferAmount.blur();
  inputTransferTo.blur();

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    recieverAcc &&
    recieverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});
// transfer money feature

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});
// loan money feature

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);

    // Update UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';

  inputCloseUsername.blur();
  inputClosePin.blur();
});
// account delete feature

let sorted = false;
// state variable

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);

  // each click change the state variable
  sorted = !sorted;
});
// movements sort feature

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// 🎗️ NUMBERS, DATES, INTL and TIMERS
// console.log(23 === 23.0);

// console.log(0.1 + 0.2); // expected 0.3
// console.log(0.1 + 0.2 === 0.3); // expected true

// // Conversion
// console.log(Number('23'));
// console.log(+'23'); // another way to convert strings to numbers

// // Parsing
// console.log(Number.parseInt('30px'));
// console.log(Number.parseInt('e99'));

// console.log(Number.parseFloat('2.5rem'));
// console.log(Number.parseInt('2.5rem'));

// // Check if value is NaN
// console.log(Number.isNaN(20));
// console.log(Number.isNaN('20'));
// console.log(Number.isNaN(+'20X'));
// console.log(Number.isNaN(23 / 0));

// // Checking if value is number
// console.log(Number.isFinite(20));
// console.log(Number.isFinite('20'));
// console.log(Number.isFinite(+'20X'));
// console.log(Number.isFinite(23 / 0));

// console.log(Number.isInteger(23));
// console.log(Number.isInteger(23.0));
// console.log(Number.isInteger(23 / 0));

// // Math and Rounding
// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(8 ** (1 / 3));

// console.log(Math.max(5, 18, 23, 11, 2));
// console.log(Math.max(5, 18, '23', 11, 2));
// console.log(Math.max(5, 18, '23px', 11, 2));

// console.log(Math.min(5, 18, 23, 11, 2));

// console.log(Math.PI * Number.parseFloat('10px') ** 2);

// console.log(Math.trunc(Math.random() * 6) + 1);

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min) + 1) + min;
// // 0...1 -> 0...(max - min) -> min...max
// // console.log(randomInt(10, 20));

// // Rounding integers
// console.log(Math.round(23.3));
// console.log(Math.round(23.9));

// console.log(Math.ceil(23.3));
// console.log(Math.ceil(23.9));

// console.log(Math.floor(23.3));
// console.log(Math.floor('23.9'));

// console.log(Math.trunc(23.3));
// console.log(Math.trunc(-23.3));

// console.log(Math.floor(-23.3));

// // Rounding decimals
// console.log((2.7).toFixed(0));
// console.log((2.7).toFixed(3));
// console.log((2.345).toFixed(2));
// console.log(+(2.345).toFixed(2));

// // The Remainder Operator
// console.log(5 % 2);
// console.log(5 / 2); // 5 = 2 * 2 + 1

// console.log(8 % 3);
// console.log(8 / 3); // 8 = 2 * 3 + 2

// console.log(6 % 2);
// console.log(6 / 2);

// console.log(7 % 2);
// console.log(7 / 2);

// const isEven = n => n % 2 === 0;

// console.log(isEven(8));
// console.log(isEven(23));
// console.log(isEven(514));

// // Use for every nth element
// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//     // 0, 2, 4, 6
//     if (i % 2 === 0) {
//       row.style.backgroundColor = 'red';
//     }

//     // 0, 3, 6, 9
//     if (i % 3 === 0) {
//       row.style.backgroundColor = 'blue';
//     }
//   });
// });

// // Numeric Separators

// // 287,460,000,000
// const diameter = 287_460_000_000;
// console.log(diameter);

// const price = 345_99;
// console.log(price);

// const transferFee1 = 15_00;
// const transferFee2 = 1_500;

// const PI = 3.1415;
// console.log(PI);

// console.log(Number('230_000'));

// console.log(parseInt('230_000'));

// // Working with BigInt
// console.log(2 ** 53 - 1);

// console.log(Number.MAX_SAFE_INTEGER);

// console.log(2 ** 53 + 1);
// console.log(2 ** 53 + 2);
// console.log(2 ** 53 + 3);
// console.log(2 ** 53 + 4);

// console.log(4838430248342043823408394839483204n);
// console.log(BigInt(48384302));

// // Operations
// console.log(10000n + 10000n);
// console.log(36286372637263726376237263726372632n * 10000000n);
// // console.log(Math.sqrt(16n));

// const huge = 20289830237283728378237n;
// const num = 23;

// console.log(huge * BigInt(num));

// // Exceptions
// console.log(20n > 15);
// console.log(20n === 20);
// console.log(typeof 20n);
// console.log(20n == '20');
// console.log(huge + ' is REALLY big!!!');

// // Divisions
// console.log(11n / 3n);
// console.log(10 / 3);

///////////////////////////////////////
// // Creating Dates

// // Create a date
// const now = new Date();
// console.log(now);

// console.log(new Date('Aug 02 2020 18:05:41'));
// console.log(new Date('December 24, 2015'));
// console.log(new Date(account1.movementsDates[0]));
// console.log(new Date(2037, 10, 19, 15, 23, 5));
// console.log(new Date(2037, 10, 31));
// console.log(new Date(0));
// console.log(new Date(3 * 24 * 60 * 60 * 1000));

// // Working with dates
// const future = new Date(2037, 10, 19, 15, 23);

// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.toISOString());
// console.log(future.getTime());

// console.log(new Date(2142256980000));
// console.log(Date.now());

// future.setFullYear(2040);
// console.log(future);

// 🎗️ WORKING WITH ARRAYS
// // Simple Array Methods
// let arr = ['a', 'b', 'c', 'd', 'e'];

// // SLICE (Does not mutate the array)
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(-1));
// console.log(arr.slice(1, -2));

// // Shallow copy of array
// console.log(arr.slice());
// console.log([...arr]);

// // SPLICE (Extracted elements are actually gone, splice deleted them)
// // console.log(arr.splice(2));
// arr.splice(-1);
// console.log(arr);
// arr.splice(1, 2);
// console.log(arr);

// // REVERSE (Does mutate the array)
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

// // CONCAT (Does not mutate the array)
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);

// // JOIN
// console.log(letters.join(' - '));

// ///////////////////////////////////////

// // The new at Method
// const arr3 = [23, 11, 64];

// console.log(arr3[0]);
// console.log(arr3.at(0));

// // getting last array element
// console.log(arr3[arr3.length - 1]);
// console.log(arr3.slice(-1)[0]);
// console.log(arr3.at(-1));

// // at method also works on strings
// console.log('jonas'.at(0));
// console.log('jonas'.at(-1));

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// console.log(`--- FOR OF ---`);
// // for (const movement of movements) {
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i}: You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i}: You withdrew ${Math.abs(movement)}`);
//   }
// }

// console.log(`--- FOREACH ---`);
// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) {
//     console.log(`Movement ${i}: You deposited ${mov}`);
//   } else {
//     console.log(`Movement ${i}: You withdrew ${Math.abs(mov)}`);
//   }
// });

// /////////////////////////////////////////////////

// // Map
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// // Set
// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, _, map) {
//   console.log(`${value}: ${value}`);
// });

///////////////////////////////////////
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const checkDogs = function (dogsJulia, dogsKate) {
//   // Create Julia's dogs copy
//   const dogsJuliaCorrected = dogsJulia.slice();

//   // Remove the first element
//   dogsJuliaCorrected.splice(0, 1);

//   // Remove the last two elements
//   dogsJuliaCorrected.splice(-2);

//   const dogs = dogsJuliaCorrected.concat(dogsKate);

//   dogs.forEach(function (dog, i) {
//     if (dog >= 3) {
//       console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`);
//     } else {
//       console.log(`Dog number ${i + 1} is still a puppy 🐶`);
//     }
//   });
// };

// console.log('--- DATA 1 ---');
// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);

// console.log('--- DATA 2 ---');
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

///////////////////////////////////////
// Array map method

// const movements = [...account1.movements];

// const eurToUsd = 1.1;

// // const movementUSD = movements.map(function (mov) {
// //   return mov * eurToUsd;
// // });

// const movementUSD = movements.map(mov => mov * eurToUsd);

// console.log(movements);
// console.log(movementUSD);

// //
// const movementsUSDfor = [];
// for (const mov of movements) movementsUSDfor.push(mov * eurToUsd);
// console.log(movementsUSDfor);

// //
// const movementsDescription = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//       mov
//     )}`
// );
// console.log(movementsDescription);

///////////////////////////////////////
// Array filter method

// const movements = [...account1.movements];
// console.log(movements);

// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(deposits);
// //

// const depositsFor = [];
// for (const mov of movements) if (mov > 0) depositsFor.push(mov);
// // console.log(depositsFor);
// //

// const withdrawals = movements.filter(mov => mov < 0);
// console.log(withdrawals);

///////////////////////////////////////
// Array reduce method

// const movements = [...account1.movements];
// console.log(movements);

// // reduce
// // const balance = movements.reduce(function (acc, cur, i, arr) {
// //   console.log(`Iteration ${i}: ${acc}`);
// //   return acc + cur;
// // }, 0);

// // reduce with arrow function
// const balance = movements.reduce((acc, cur) => acc + cur, 0);
// console.log(balance);

// // for
// let balance2 = 0;
// for (const mov of movements) balance2 += mov;
// console.log(balance2);

// // maximum value
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) {
//     console.log(`🟢 New max: ${acc} <<< ${mov}`);
//     return acc;
//   } else {
//     console.log(`🔴 Same max: ${acc} >>> ${mov}`);
//     return mov;
//   }
// }, movements.at(0));
// console.log(max);

///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
//   console.log('Data: ', ages);
//   console.log('Calculated age: ', humanAges);

//   const adultDogs = humanAges.filter(age => age >= 18);
//   console.log('Adult dogs: ', adultDogs);

//   const adultDogsSum = adultDogs.reduce((acc, age) => acc + age, 0);
//   const adultDogsAverage = adultDogsSum / adultDogs.length;
//   console.log('Adult dogs average: ', adultDogsAverage);

//   // alternate calc average
//   // 2 3. (2+3)/2 = 2.5 === 2/2+3/2 = 2.5
//   // const average = adults.reduce(
//   //   (acc, age, i, arr) => acc + age / arr.length,
//   //   0
//   // );

//   return adultDogsAverage;
// };
// console.log(`--- DATA: 1 ---`);
// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// console.log('# AVG 1: ', avg1);
// console.log(`--- DATA: 2 ---`);
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log('# AVG 2: ', avg2);

///////////////////////////////////////
// Chaining methods

// const eurToUsd = 1.1;

// const movements = [...account1.movements];
// console.log(movements);

// const totalDepositsUSD = movements
//   .filter(mov => mov > 0) // returns new array
//   .map(mov => mov * eurToUsd) // returns new array
//   // .map((mov, i, arr) => {
//   //   console.log(arr);
//   //   return mov * eurToUsd;
//   // })
//   .reduce((acc, cur) => acc + cur, 0); // returns value

// console.log(totalDepositsUSD);

///////////////////////////////////////
// Coding Challenge #3

/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const calcAverageHumanAge = ages =>
//   ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, cur, _, arr) => acc + cur / arr.length, 0);

// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

///////////////////////////////////////
// Find method

// const movements = [...account1.movements];

// // Find method does not mutate an array => Based on a condition returns only ONE element

// const firstWithdrawal = movements.find(mov => mov < 0);

// console.log(movements);
// console.log(firstWithdrawal);

// console.log(accounts);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// const accountFor = [];
// for (const acc of accounts) {
//   if (acc.owner === 'Jessica Davis') accountFor.push(acc);
// }
// console.log(accountFor);

///////////////////////////////////////
// some method

// const movements = [...account1.movements];

// console.log(movements);

// // EQUALITY
// console.log('Includes:', movements.includes(-130));

// // CONDITION
// console.log(
//   'Some:',
//   movements.some(mov => mov === -130)
// );

// const anyDeposit = movements.some(mov => mov > 0);
// console.log('Any deposit:', anyDeposit);

// ///////////////////////////////////////
// // every method

// console.log(
//   'Every:',
//   movements.every(mov => mov > 0)
// );

// // Account 4 only has deposits, thats why this returns true
// console.log(
//   'Every:',
//   account4.movements.every(mov => mov > 0)
// );

// // seperate callback
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

///////////////////////////////////////
// flat and flatMap method

// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// // flat method depth
// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));

// // flat
// const overBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);

// console.log('flat:', overBalance);

// // flatMap
// const overBalance2 = accounts
//   .flatMap(acc => acc.movements) // map and flat method together
//   .reduce((acc, mov) => acc + mov, 0);

// console.log('flatmap:', overBalance2);

// ///////////////////////////////////////
// sorting arrays (mutate the array)

// // strings
// const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners);
// console.log(owners.sort());

// // numbers
// const movements = [...account1.movements];

// // return < 0, A, B (keep order)
// // return > 0, B, A (switch order)

// // ascending
// // movements.sort((a, b) => {
// //   if (a > b) return 1;

// //   if (b > a) return -1;
// // });

// movements.sort((a, b) => a - b);
// console.log('A > B:', movements);

// // descending
// // movements.sort((a, b) => {
// //   if (a > b) return -1;

// //   if (a < b) return 1;
// // });

// movements.sort((a, b) => b - a);
// console.log('B > A:', movements);

// ///////////////////////////////////////
// More Ways of Creating and Filling Arrays
// const arr = [1, 2, 3, 4, 5, 6, 7];
// console.log('new Array constructor:', new Array(1, 2, 3, 4, 5, 6, 7));

// // Empty arrays + fill method
// const x = new Array(7);
// console.log(x);
// // console.log(x.map(() => 5));

// x.fill(1, 3, 5);
// console.log(x);
// x.fill(1);
// console.log(x);

// arr.fill(23, 2, 6);
// console.log(arr);

// // Array.from
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

// // 100 random dice rolls
// const diceRolls = Array.from(
//   { length: 100 },
//   () => Math.trunc(Math.random() * 6) + 1
// );
// console.log(diceRolls);

// //
// labelBalance.addEventListener('click', function () {
//   // Better solution
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('€', ''))
//   );
//   console.log(movementsUI);

//   const movementsUI2 = [...document.querySelectorAll('.movements__value')];
//   console.log(movementsUI2);
// });

/////////////////////////////////////////////////
// Array Methods Practice

// // 1. Calc total deposit
// const bankDepositSum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 0)
//   .reduce((sum, cur) => sum + cur, 0);

// console.log(bankDepositSum);

// // 2. Deposit count >= 1000

// // Solution #1
// // const numDeposits1000 = accounts
// // .flatMap(acc => acc.movements)
// // .filter(mov => mov >= 1000).length;

// // Solution #2
// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);

// console.log(numDeposits1000);

// // Prefixed ++ operator
// let a = 10;
// console.log(++a);
// console.log(a);

// // 3. All deposits and withdrawals
// const { deposits, withdrawals } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sum, cur) => {
//       // cur >= 0 ? (sum.deposits += cur) : (sum.withdrawals += cur);
//       sum[cur > 0 ? 'deposits' : 'withdrawals'] += cur;

//       return sum;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );

// console.log('Deposits:', deposits, 'Withdrawals:', withdrawals);

// // 4. this is a nice title -> This Is a Nice Title

// const convertTitleCase = function (title) {
//   // Exception word or not uppercase the words first letter
//   const capitalize = str => str.at(0).toUpperCase() + str.slice(1);

//   const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

//   const titleCase = title
//     .toLowerCase()
//     .split(' ')
//     .map(word =>
//       // If exceptions word true keep it. Otherwise make capitalize words first letter
//       exceptions.includes(word)
//         ? word
//         : word.at(0).toUpperCase() + word.slice(1)
//     )
//     .join(' ');

//   return capitalize(titleCase);
// };

// console.log(convertTitleCase('this is a nice title'));
// console.log(convertTitleCase('this is a LONG title but not too long'));
// console.log(convertTitleCase('and here is another title with an EXAMPLE'));

///////////////////////////////////////
// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.

Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.

Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉

HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀

*/

// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];

// // 1.
// dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));

// // 2.
// const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
// console.log(
//   `Sarah's dog eating too ${
//     dogSarah.curFood > dogSarah.recFood ? 'much' : 'little'
//   }.`
// );

// // 3.
// const ownersEatTooMuch = dogs
//   .filter(dog => dog.curFood > dog.recFood)
//   .flatMap(dog => dog.owners);
// console.log('Eating too much:', ownersEatTooMuch);

// const ownersEatTooLittle = dogs
//   .filter(dog => dog.curFood < dog.recFood)
//   .flatMap(dog => dog.owners);
// console.log('Eating too little:', ownersEatTooLittle);

// // 4.
// console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
// console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);

// // 5.
// console.log(dogs.some(dog => dog.curFood === dog.recFood));

// // 6. ===> current > (recommended * 0.90) && current < (recommended * 1.10)
// const checkEatingOkay = dog =>
//   dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;

// console.log(dogs.some(checkEatingOkay));

// // 7.
// console.log(dogs.filter(checkEatingOkay));

// // 8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

// // const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

// const recFoodAscending = dogs.slice().sort((a, b) => a.recFood - b.recFood);
// console.table(dogs);
// console.table(recFoodAscending);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// ⭐️ WHICH ARRAY METHOD TO USE

/* ### TO MUTATE THE ORIGINAL ARRAY ###

👉 Add to original:

.push - (end)
.unshift - (start)

👉 Remove from original:

.pop - end
.shift - start
.splice - any

👉 Others:

.reverse
.sort
.fill

/////////////////////////////////////////////////
/* ### A NEW ARRAY ###

👉 Computed from original:

.map - loop

👉 Filtered using condition:

.filter

👉 Position to original:

.slice

👉 Adding original to other:

.concat

👉 Flattening the original:

.flat
.flatMap

/////////////////////////////////////////////////
/* ### AN ARRAY INDEX ###

👉 Based on value:

.indexOf

👉 Based on test condition:

.findIndex

/////////////////////////////////////////////////
/* ### AN ARRAY ELEMENT ###

👉 Based on test condition:

.find

/////////////////////////////////////////////////
/* ### KNOW IF ARRAY INCLUDES ###

👉 Based on value:

.includes

👉 Based on test condition:

.some
.every

/////////////////////////////////////////////////
/* ### A NEW STRING ###

👉 Based on separator string:

.join

/////////////////////////////////////////////////
/* ### TO TRANSFORM TO VALUE ###

👉 Based on accumulator:

.reduce (Boil down array to single value of any type: number, string, boolean, or even new array or object)

/////////////////////////////////////////////////
/* ### TO JUST LOOP ARRAY ###

👉 Based on callback:

.forEach (Does not create a new array, just loops over it)

*/
