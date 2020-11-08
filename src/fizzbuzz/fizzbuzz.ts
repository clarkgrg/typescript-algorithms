/*
 * Print all numbers between 0 and 100
 * if divisible by 3 then 'Fizz'
 * if divisible by 5 then 'Buzz'
 * if divisible by 3 and 5 then 'FizzBuzz'
 */

for (let i: number = 0; i <= 100; i++) {
  const isFizz = i % 3 === 0;
  const isBuzz = i % 5 === 0;

  let result: string = i.toString();
  if (isFizz) result = 'Fizz';
  if (isBuzz) result = 'Buzz';
  if (isFizz && isBuzz) result = 'FizzBuzz';

  console.log(result);
}
