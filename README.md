# \<palta-note>

<palta-note> is a web component that displays compositions Bhatkhande notation system.

## Installation

```bash
npm i palta-note
```

## Usage

```html
<script type="module">
  import 'palta-note/palta-note.js';
</script>

<palta-note vibhags="X 2 0 3">
  Dha Dhin Dhin Dha
  Dha Dhin Dhin Dha
  Dha Tin Tin Ta
  Ta Dhin Dhin Dha
</palta-note>
```

## Linting and formatting

To scan the project for linting and formatting errors, run

```bash
npm run lint
```

To automatically fix linting and formatting errors, run

```bash
npm run format
```

## Testing with Web Test Runner

To execute a single test run:

```bash
npm run test
```

To run the tests in interactive watch mode run:

```bash
npm run test:watch
```

## Local Demo

```bash
npm start
```

To run a local development server that serves the basic demo located in `index.html`
