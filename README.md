# Campfire Secrets

Campfire Secrets is a cloud-based secrets manager than runs on Firebase Cloud Functions (which runs Node.js). It was created as a free, basic alternative to paid or self-hosted secrets managers such as AWS Secrets Manager, Google's Cloud KMS, Hashicorp's Vault, Pinterest's Knox etc.

Campfire features the following:
 - Web API, enabling any application that can make HTTP requests to retrieve secrets.
 - Secrets overriding, allowing you to have different secrets across environments such as development, staging and production.

## Installation

To use Campfire Secrets, clone this repository and follow Firebase's [Getting Started](https://firebase.google.com/docs/functions/get-started) tutorial for Cloud Functions to deploy.

Before deploying for the first time, set the password using:

```
firebase functions:config:set configs.password="my_password"
```

You will need to provide this password whenever making a request to the web API.

## Adding Secrets

Campfire Secrets uses Realtime Database to store secrets. To create a new Realtime Database, open your project in the Firebase console and open the **Database** page. Scroll down to Realtime Database and click **Create database**.

![Create Realtime Database screenshot](docs/images/01.png)

Firebase will give you a choice between locked mode and test mode. Since you will not read or write using the database API, select **locked mode**. Your database will be created and you will see the following:

![Initial database screenshot](docs/images/02.png)

To start, create a new child and name it `configs`. All of your secrets will go under this object.

### Application Secrets

From here, you can create a new object for each application. For example, you could create a `database` object which stores all secrets for your database such as usernames, passwords, ports etc. Let's try that now by creating the following structure:

![Database secrets example](docs/images/03.png)

Notice how the secrets are stored under a `common` object. Any secrets stored under a `common` object are shared between all environments *unless* they are overriden by an environment.

### Environment Secrets

Often, you'll want to have different secrets between your development and production environments. For example, if you wanted Bob to use a different password while developing locally, you could create a new `development` environment. To do this, add a `development` object under `database` and specify a new value for his password.

![Environment secrets example](docs/images/04.png)

Now, when you request the database secrets and specify your environment as development, you will retrieve all the common secrets *except* for Bob's password which was overridden.

### Global Secrets

Global secrets are shared between all applications and can be overridden per application. Global secrets are useful when multiple applications need to share a common secret such as an API key for an external API.

To create global secrets, simply create a `global` object under `configs` and add a `common` object under it.

![Global secrets example](docs/images/05.png)

Now, if you were to request the database secrets, you would also receive the API key as well.

Global secrets also support environments just like applications.

### Summary

 - Global secrets are shared between all applications
 - Global secrets can be overridden per application
 - Application secrets can be overriden per environment

## Requesting Secrets

Get your Cloud Functions URL and construct a URL like so:

```
https://{server}-{projectid}.cloudfunctions.net/configs/{application}/{environment}
```

Afterwards, simply pass in your password (the one you set in the installation phase) in the **Authorzation** header and then send a request. The API will send a JSON object as a response which you can then parse in your application.