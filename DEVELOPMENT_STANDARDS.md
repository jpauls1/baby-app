# Development Standards

Universal guidelines applicable across all projects.

---

## 1. Code Style

### Naming Conventions

| Construct | Convention | Example |
|-----------|-----------|---------|
| Variables | camelCase | `userCount`, `isLoading` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES`, `API_BASE_URL` |
| Functions | camelCase, verb-first | `fetchUser()`, `handleClick()` |
| Classes | PascalCase | `UserService`, `AudioPlayer` |
| Files | kebab-case | `audio-player.js`, `user-service.ts` |
| CSS classes | kebab-case | `.nav-bar`, `.btn-primary` |
| Booleans | is/has/can prefix | `isVisible`, `hasError`, `canEdit` |

### Indentation and Formatting

- **Indentation:** 2 spaces (no tabs)
- **Line length:** 100 characters max
- **Quotes:** Single quotes for JS/TS; double quotes for HTML attributes and JSON
- **Semicolons:** Required in JS/TS
- **Trailing commas:** Required in multi-line arrays and objects
- **Blank lines:** One blank line between logical sections; two between top-level declarations

### Commenting

- Comment *why*, not *what* — the code should explain what
- Use `//` for inline comments; `/* */` for block comments
- Mark incomplete or temporary code: `// TODO:`, `// FIXME:`, `// HACK:`
- Remove dead code instead of commenting it out

```js
// BAD: explains what the code does
// increment counter by 1
count++;

// GOOD: explains why
// Offset by 1 because the API returns 0-indexed pages
const page = rawPage + 1;
```

### File Organization

- One primary export per file
- Group imports: external libraries → internal modules → relative paths, separated by blank lines
- Keep files under 300 lines; split when logic is independently reusable
- Co-locate tests with source files (`feature.js` / `feature.test.js`)

---

## 2. Version Control

### Branching Strategy (Git Flow Lite)

```
main          — production-ready code only
└── develop   — integration branch (optional for larger teams)
    └── feature/<short-description>   — new features
    └── fix/<short-description>       — bug fixes
    └── chore/<short-description>     — tooling, deps, config
    └── hotfix/<short-description>    — urgent production fixes
```

- Branch off `main` (or `develop`) — never commit directly to `main`
- Delete branches after merging
- Keep branches short-lived (days, not weeks)

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>

[optional body]

[optional footer: BREAKING CHANGE, closes #issue]
```

**Types:** `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`, `perf`

```
# Examples
feat(auth): add OAuth2 login flow
fix(audio): prevent double-play on rapid taps
chore(deps): upgrade React to 18.3
docs(readme): update local setup instructions
refactor(player): extract volume logic into hook
```

**Rules:**
- Summary line ≤ 72 characters, imperative mood ("add" not "added")
- Reference issues in footer: `Closes #42`
- One logical change per commit — avoid "fix stuff" or "WIP" commits on shared branches

### Merge Protocol

1. Open a Pull Request (PR) / Merge Request (MR) for every branch
2. PRs require at least one approving review before merge
3. All CI checks must pass before merge
4. Squash merge feature branches to keep history linear; merge commits for releases
5. Delete the source branch after merging

---

## 3. Testing

### Coverage Requirements

| Layer | Minimum Coverage |
|-------|-----------------|
| Business logic / utilities | 80% |
| UI components | 60% |
| Integration paths | Key happy path + primary error path |

Coverage is a floor, not a goal — prioritize meaningful tests over hitting a number.

### Unit Tests

- Test one behavior per test; name tests descriptively: `it('returns null when input is empty')`
- Follow AAA structure: **Arrange → Act → Assert**
- Mock external dependencies (network, filesystem, timers)
- Tests must be deterministic — no random data, no sleep/wait without fake timers

```js
// AAA example
it('formats price with currency symbol', () => {
  // Arrange
  const amount = 1999;

  // Act
  const result = formatPrice(amount, 'USD');

  // Assert
  expect(result).toBe('$19.99');
});
```

### Integration Tests

- Test at the boundary of real subsystems (DB, API, file I/O)
- Use a dedicated test environment — never run against production data
- Reset state between tests (transactions, mocks, seed data)

### What Not to Test

- Third-party library internals
- Trivial getters/setters with no logic
- Implementation details — test behavior, not structure

---

## 4. Documentation

### Code Comments

- Public APIs must have a docblock (JSDoc / TSDoc / docstring)
- Complex algorithms require an explanation of the approach and any known trade-offs
- Regular review: remove stale comments during code review

```ts
/**
 * Converts a raw audio buffer to a normalized Float32Array.
 * Normalizes to [-1, 1] range. Returns an empty array for null input.
 */
function normalizeAudio(buffer: ArrayBuffer | null): Float32Array { ... }
```

### README

Every project root must have a README containing:

1. **Project name and one-sentence description**
2. **Prerequisites** — runtime versions, required tools
3. **Local setup** — clone, install, configure env, run
4. **Available scripts** — `dev`, `test`, `build`, `lint`
5. **Project structure** — brief map of key directories
6. **Deployment** — how to release or where it's hosted
7. **Contributing** — link to this document or branch/PR workflow

### API Documentation

- All public endpoints must be documented before shipping
- Include: method, path, request body/params, response schema, error codes, example
- Keep docs in-repo (OpenAPI YAML, or a `docs/` folder) — not in a separate wiki that drifts
- Breaking changes must be called out explicitly in changelogs

---

## 5. Security

### Input Validation

- Validate and sanitize **all** external input at the system boundary (user input, API responses, file reads)
- Whitelist expected values; reject or escape everything else
- Never trust client-side validation alone — always validate server-side
- Parameterize all database queries — no string concatenation for SQL

### Authentication and Authorization

- Never store plaintext passwords — use bcrypt, scrypt, or Argon2
- Use short-lived tokens (JWTs ≤ 15 min access, longer-lived refresh tokens stored httpOnly)
- Apply least-privilege: grant only the permissions a role actually needs
- Enforce authorization checks server-side, not just in the UI
- Rate-limit authentication endpoints

### Secrets Management

- **Never commit secrets** — no API keys, tokens, passwords, or private keys in source code
- Use `.env` files locally; use a secrets manager (Vault, AWS Secrets Manager, etc.) in production
- Add `.env` and credential files to `.gitignore` before the first commit
- Rotate secrets immediately if accidentally exposed; assume they are compromised

### Dependency Management

- Pin dependency versions in lockfiles (`package-lock.json`, `yarn.lock`, etc.) — commit lockfiles
- Run `npm audit` (or equivalent) in CI; fail the build on high/critical vulnerabilities
- Remove unused dependencies
- Keep dependencies up to date — address security patches within one week of release

### General Hygiene

- Set security-relevant HTTP headers (CSP, HSTS, X-Frame-Options, etc.)
- Avoid `eval()` and dynamic code execution
- Log security-relevant events (failed logins, permission denials) but **never log sensitive data** (passwords, tokens, PII)
- Keep error messages generic to users; log full details server-side only

---

*Last updated: 2026-08-05*
