'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

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

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';

  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
displayMovements(account1.movements);
// display movements

const calcDisplayBalance = function (movements) {
  const balance = movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${balance}€`;
};
calcDisplayBalance(account1.movements);
// calc and display balance

const calcDisplaySummary = function (movements) {
  const income = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${income}€`;

  const out = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * 1.2) / 100)
    .filter((int, i, arr) => {
      // New feature: If interest at least 1 EUR
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest}€`;
};
calcDisplaySummary(account1.movements);
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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

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
