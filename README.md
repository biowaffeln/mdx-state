# MDX-State

A simple state managment solution for MDX Documents.

## Installation

You can install the library using npm:

```bash
npm install mdx-state
```

## Why?

Managing state in MDX documents is complicated; the usual state mananagement solutions, such as React's Hooks are not available inside  

## Getting Started

Here is an example of implementing a counter mdx-state: 

```jsx
import { createState, Observe } from "mdx-state";

// create the state using the `createState` function:
export const counter = createState({ count: 0 });

# Counter Example

// to read the state, wrap it with `Observe`
<Observe state={counter}>
  {({ count }) => {
    return <div> The counter currently has a value of {count}.</div>;
  }}
</Observe>


// simply mutate the state from anywhere in your document!
<button onClick={() => counter.count++}>increase count!</button>

```
⚠️ createState uses the [Proxy API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) internally and cannot be used in obsolete Browsers like IE11 without polyfills.  

If you want to mutate state in more complex ways, mdx-state provides an `Input` component can help you with that. For example, let's manipulate our counter with a range slider:

```jsx
import { createState, Observe, Input } from "mdx-state"; 

# Counter Example

<Observe state={counter}>
  {({ count }) => {
    return <div> The counter currently has a value of {count}.</div>;
  }}
</Observe>

<Input type="range" min="0" max="10" state={counter} name="count" />

```

Whenever the input value changes, the text will update correctly!

## API 

### `createState`

### `Observe`

### `Input`

## Acknowledgements

This library is heavily inspired by Alex Krolick's [MDX-Observable](https://github.com/alexkrolick/mdx-observable). mdx-state is a similar take on the problem of state management in MDX that tries to reduce the number of render props and simplify the syntax as much as possible.
