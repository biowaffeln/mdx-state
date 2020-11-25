# MDX-State

A simple state managment solution for MDX Documents.

## Installation

You can install the library using npm:

```bash
npm install mdx-state
```

## Why?

Managing state in MDX documents is complicated; the usual state mananagement solutions such as React's Hooks are unfortunately not available inside MDX. mdx-state tries to solve this problem by providing the simplest API to managing state within MDX documents.

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

Takes an object and returns a proxy object that can notify `Observe` and `Input` about when it is changed.

### `Observe`

Takes a `state` prop that has to be produced by the `createState` function, and re-renders every time the state is changed. Expects a function as a child that gets called with the new state.

### `Input`

Takes two props, a `state` that comes from the `createState` function, and a `name` that corresponds to the name of the key that the input should mutate.

## Acknowledgements

This library is heavily inspired by Alex Krolick's [MDX-Observable](https://github.com/alexkrolick/mdx-observable). mdx-state is a similar take on the problem of state management in MDX that tries to reduce the number of render props and simplify the syntax as much as possible.
