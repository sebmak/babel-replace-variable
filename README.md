# Usage

Create a `.env` or `.env.ENVIRONMENT` file where `ENVIRONMENT` is your `NODE_ENV` (defaults to development)

the contents of the file should look like:

```
__SOME_KEY__=SOMEVALUE
OTHERKEY=OTHERVALUE
```

within your code use `__SOME_KEY__` and babel will replace it with `SOMEVALUE`
