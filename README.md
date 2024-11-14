# 1 App, 5 Stacks

I built the same app in 5 stacks\*. Those stacks are:

- Ruby on Rails: https://roundest-rails.fly.dev/
- Elixir + Phoenix: https://roundest-phoenix.fly.dev/
- Go + GraphQL + React SPA: https://roundest-go.vercel.app/
- OG T3 Stack (Next.js/Pages + Prisma): https://roundest-t3.vercel.app/
- Next.js RSCs + App Router: https://roundest-rsc.vercel.app/

\* [Ben](https://www.youtube.com/@bmdavis419) wrote all of the Go code and most of the Elixir version

## Line of Code comparison

Don't read too much into this, I just found it interesting.

Note: Both the Elixir and RSC versions have a "turbo" route with a lot of duplicated code, so I included a 2nd count for those with the turbo routes removed.

| Stack                              | Primary Language LOC                    | Total LOC   |
| ---------------------------------- | --------------------------------------- | ----------- |
| Ruby on Rails                      | 509 lines (Ruby)                        | 1,014 lines |
| Elixir + Phoenix\*                 | 991 lines (Elixir)                      | 1,395 lines |
| Elixir + Phoenix\* (without turbo) | 832 lines (Elixir)                      | 1,236 lines |
| Go + gql + React                   | 440 lines (TypeScript) + 423 lines (Go) | 940 lines   |
| OG T3 Stack                        | 443 lines (TypeScript)                  | 585 lines   |
| RSC version                        | 425 lines (TypeScript)                  | 451 lines   |
| RSC version (without turbo)        | 332 lines (TypeScript)                  | 358 lines   |

\* I deleted ~1,000 lines from the Phoenix template (and still had this much code left)
