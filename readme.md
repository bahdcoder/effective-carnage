# Betting dashboard

## Running the application locally

1. Clone the repository to your local machine:

```bash
git clone git@github.com:bahdcoder/effective-carnage.git
```

2. Create a file for environment variables

```bash
cp .env.example .env
```

3. Run docker containers for postgres and redis

```bash
docker-compose up --wait
```

4. Install project dependencies

```bash
npm run install
```

5. Run database seed script to get some test events into the database

```bash
npm run cli seed_events
```

6. Run the application in development mode

```bash
npm run dev
```

Visit the browser on `http://localhost:5173` to view the running application

7. Run lint checks (and automatically fix any lint issues)

```bash
npm run lint
```

8. Run types checks

```bash
npm run checks:types
```

9. Run formatting checks (and automatically fix any formatting issues)

```bash
npm run format
```

10. Run automated tests

```bash
npm run test
```

Please use the following command if you want to generate a coverage report:

```bash
npm run test:coverage
```

11. Build the application for production

```bash
npm run build
```

This command lints, formats, checks for types, and runs tests before actually building the client and server.

12. Run production application on your local computer

- Change the `NODE_ENV=development` variable in your `.env` file to `NODE_ENV=production`
- Run the following command to start the application in production mode:

```bash
npm run start
```

## The postman collection

I created a publicly accessible postman collection to help you test the API

(https://www.postman.com/bahdcoder/frantz-s-public-space/collection/vsza0wk/gamdom-betting-platform?action=share&creator=3074141)[Visit the postman collection here]

## About automated tests

I wrote two tests to demonstrate how unit tests and integration tests would work in such a project. Please take a look if you have some time.

Integration tests: `core/tests/integration/modules/events/events.spec.ts`
Unit tests: `core/tests/unit/modules/users/users.service.spec.ts`

## Rendering strategy

I've come to discover over the years that the most secure and most performant rendering strategy is a combination of server-side rendering and client side applications.

That's why the rendering in this codebase makes use of Vite's support for server-side rendering, while using a full client-side single page application on the frontend.

That way, we can inject sensitive and important data into the frontend (using SSR) without having the user wait for the client-side application to load by showing a spinner.

## Authentication

I have implemented cookie based sessions with express `cookie-sessions` package. It's a little insecure now as we have no CSRF protection, but it scales really well and prevents a lot of the common mistakes from JWTs.

To scale this, we may use the redis store to store sessions, so we can handle use cases like remote invalidation.

Please visit the `AuthModule()` to see it's implementation.

## Application structure

I went with a modular approach for the backend code structure for the following reasons:

1. Extremely easy to contribute to, as developers can compartmentalise their focus areas
2. Easy to manage as application grows, since it becomes very obvious where a functionality is likely to exist.

I also went with using a global container called `awilix`:

1. It makes it easy to access any dependency from anywhere in the application
2. It makes it easy to mock dependencies for testing (not demonstrated in this codebase, but if we had file uploads or communications with external APIs, mocking will be very easy to do.)

## Running tests

For writing tests, I chose the following technologies:

1. Vitest as the test runner, as it has amazing support for both nodejs and browser environment tests
2. Supertest as it makes it easy to test apis built with express

To run the tests in the application, you may run the following command:

```bash
npm run test
```

To run tests and display the coverage report, you may run the following command:

```bash
npm run test:coverage
```

## Running CLI commands

I use `@drizzle-team/brocli` for creating CLI commands. I picked this for the following reasons:

1. 100% fully typed cli commands
2. Inbuilt argument and parameter validation
3. Flexible function style command definition

To run any command, you may use the `npm run cli <command-name>` command.

For example, to seed sample events, you may run the command:

```bash
npm run cli seed_events
```

## Areas for improvement

### Security and code improvements

Given enough time, I would highly improve the server with the following packages:

1. `Csurf` (or a non-deprecated CSRF protection package) for implement CSRF protection
2. Client side and end to end tests to further improve maintainability of the code
3. `Hpp` against http parameter pollution attacks
4. Monitoring and error tracking with tools like `Sentry` and `Open Telemetry`
5. Health checks endpoint for load balancers and status pages
6. Setup content security protocols for how assets are loaded and executed on the frontend.

There are a lot other security and monitoring focused middleware I will consider installing.

### Functionality level improvements

I would set up a mechanism for passing page specific data from the server to the client. At the moment the only data passed is the current user session, which makes session data really easy and nice to manage.

With time, I would pass initial events from the server into the client as initial props.

I would also set up client-side routing, but as this task only needed one page, I thought that would waste my time in completing the challenge on time.

I would also set up global state management with Zustand, but in this case context and Tanstack Query works really well as we have very minimal state to manage.

## AI usage

I used AI primarily for two things:

1. Documenting all classes and functions with helpful, thoughtful comments
2. Generating boring scripts like the fix typescript imports command.

I limited AI usage to just these two tasks for this challenge, to ensure you are testing my actual skills.

Everything else, from architecture, logic, database, package choices, etc were all created by me.
