---
title: 'Function Variance in TypeScript'
pubDate: 2024-12-18 07:30:00 -8
description: 'An explanation of how generic type variance relates to functions, and how that is reflected in TypeScript.'
---
# Function Variance in TypeScript

I recommend this [Wikipedia article on covariance and contravariance](https://en.wikipedia.org/wiki/Covariance_and_contravariance_(computer_science)) to gain a preliminary understanding of the concepts at play.

As I was learning TypeScript, one question immediately popped into my mind: If you have a function type  `FunctionA`, what types of functions are substitutable for it? More generally, how does function compatibility work?

## The concept of a function is generic

The first step is to understand that the function in TypeScript, when viewed as an internal data type, is inherently flexible. You can declare functions to have however many parameters you want, and you can make each of those parameters whatever type you want. Additionally, you can choose the return type.

```js
function someFunction(arg: number) { /* ... */ }
function someOtherFunction(argOne: number, argTwo: string) { /* ... */ }
```

Now, consider how generics are described in something like the [TypeScript documentation](https://www.typescriptlang.org/docs/handbook/2/generics.html): "being able to create a component that can work over a variety of types rather than a single one". The function, at a theoretical level, easily satisfies this criterion, as it can have any number of parameters of any type rather than a single one and it can have any return type, thus making it generic.

Do not confuse this description of functions with [generic functions](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-types), which are specific instances of functions that work over a range of types by accepting type parameters.

## Return type variance

Now that we've established that the flexibility of functions is congruent to generic types, it begs the question of subtyping:
```js
interface A { 
  (name: string): string;
}
interface B { 
  (name: string): number;
}
```

Clearly the two types are incompatible as their return types differ, and thus instances of each can't be substituted for one another. 

But what about:
```js
interface A { 
  (nameA: string): string;
}
interface B { 
  (nameB: string): "something";
}
```

In this case, I can assign a variable of type `B` to a variable of type `A`.
```js
// The following will compile
const b: B = nameB => "wow";
const a: A = b;
```

This, to me, can be logically reasoned about. If I ask you for a function that returns some `string`, and you give me a function that returns `"wow"`, technically that satisfies my ask, since `"wow"` is substitutable for a string in TypeScript.

You can't go the other way around. If I ask you for a function that returns the exact string `"wow"` and you give me a function that returns some `string`, I can't be sure that the string that is returned will be `"wow"`, and so this is not allowed in TypeScript:
```js
// The following will NOT compile
const a: A = nameA => "someString";
const b: B = a;
```

We can thus say that functions are **covariant** on their return type.

## Function parameter variance

In TypeScript, functions are [bivariant on their parameters by default](https://www.typescriptlang.org/docs/handbook/type-compatibility.html#function-parameter-bivariance). Consider the simple case where two functions each have one parameter. If one parameter is assignable to the other, then the two functions are assignable to each other (in any direction).

```js
interface A {
    (name: string): string;
}
interface B {
    (name: "x"): string;
}

// The following will compile, since "x" is assignable to type string
const b: B = name => "wow";
const a: A = name => "wow";
const aTwo: A = b;
const bTwo: B = a;
```

This can create an unsafe scenario in the case that the caller expects a function that takes a looser type (e.g `string`), but is given a function that takes a more constrained type (e.g `"x"`). If that function is then called with some string other than `"x"`, the function may throw a runtime error.

To guard against this behaviour at compile-time, you can set the `strictFunctionTypes` TypeScript compiler flag. If the flag is set, that will enforce **contravariance** on function parameter types. If I ask you for a function that takes in a `string`, and you give me a function that only takes in the specific string `"x"`, that would be invalid:
```js
interface A {
    (name: string): string;
}
interface B {
    (name: "x"): string;
}

// The following will NOT compile
const b: B = name => "wow";
const a: A = b;
```

## A TypeScript land mine

Let's test our newfound knowledge!

```js
interface C {
    check: (name: string) => string;
}

let c: C = {
    check: (name: "something") => name,
}
```

With the `strictFunctionTypes` flag enabled, this fails compilation, just as we expected. But, what if we change the syntax of `interface C` slightly. More specifically, let's change the arrow syntax to the more traditional method syntax.
```js
interface C {
    check(name: string): string;
}

let c: C = {
    check: (name: "something") => name,
}
```

All of a sudden, this passes compilation... but why?

Interestingly (and frustratingly), the aforementioned `strictFunctionTypes` flag does not apply to functions declared in [method syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions). The documentation suggests that this restriction was implemented purely to [avoid breaking existing code](https://www.typescriptlang.org/tsconfig/#strictFunctionTypes).