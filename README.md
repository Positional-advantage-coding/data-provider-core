# Data Provider Core (`@positional-advantage-coder/data-provider-core`)

[![npm version](https://badge.fury.io/js/%40positional_advantage_coder%2Fdata-provider-core.svg)](https://badge.fury.io/js/%40positional_advantage_coder%2Fdata-provider-core)

`data-provider-core` is a framework-agnostic TypeScript library that provides a set of contracts for creating a backend-agnostic data access layer. It allows you to completely decouple your application's business logic from the specific implementation of your backend (e.g., Firebase, Supabase, a REST API).

## Philosophy

The primary goal of this library is to enforce the **Dependency Inversion Principle**. Your components and business logic should not depend on concrete implementations (like Firestore), but on abstractions (`DataProvider`).

This architecture provides several key benefits:
-   **Enhanced Testability:** You can easily mock the `DataProvider` in your unit tests without needing a connection to a live database.
-   **Future-Proof Flexibility:** If you ever decide to migrate away from your current backend, you only need to create a new implementation of `DataProvider`. The rest of your application code remains untouched.
-   **Strong Type Safety:** Enforces the conversion of raw data from the backend into strictly-typed class instances (domain models), preventing runtime errors and improving code quality.

## Installation

```bash
npm install @positional_advantage_coder/data-provider-core rxjs