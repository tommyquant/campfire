# Guitargeki Config Cloud Functions

If deploying for the first time, set the password using:

```
firebase functions:config:set configs.password="my_password"
```

Test functions locally (needs service account credentials file):

```
firebase serve --only functions
```

Deploy functions:

```
firebase deploy --only functions
```