# ContactsApp

- Full-stack application written in TypeScript
- NodeJS Backend with Prisma, TypeGraphQL framework and Apollo Server
- PostgreSQL Database
- React 17, Single Page Application with React Router 6 and Material UI 5

## Usage

1. Create database.
2. Launch backend app, run DB migration commands using Prisma CLI.
3. Use `./server/prisma/seed.sql` in order to create AppUserGroup and admin user.
4. Run frontend application.

## Features

1. CRUD for people, organizations and tags
2. Create connections

- person and person
- person and organization
- organization and organization

3. Tags can connect multiple people and organizations
4. Add personal info to people and organizations e.g. various contacts (email, phone number, twitter and various IDs)
5. App users are in groups for better control over information flow:

- App entities are stored with group information instead of single user in order to control user access.
- User group owns its data.
- Set roles to users in order to manage group's data.
- Control visibility of other group's data.
- User may be a member of multiple groups.
