# Phoenix App Template

This is a template repository for Phoenix apps deployed to Fly.io

To start your Phoenix server:

- Install dependencies with `mix deps.get`
- Create and migrate your database with `mix ecto.setup`
- Start Phoenix endpoint with `mix phx.server` or inside IEx with `iex -S mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](https://hexdocs.pm/phoenix/deployment.html).

## Additions

- TailwindCSS
- Node name generated from Fly app and IP
- LiveDashboard enabled via basic auth in production
- script/observer for opening observer on the running app
- Other small ergonomic changes (e.g. `use App, :schema`, see `app.ex`)

## Learn more

- Official website: https://www.phoenixframework.org/
- Guides: https://hexdocs.pm/phoenix/overview.html
- Docs: https://hexdocs.pm/phoenix
- Forum: https://elixirforum.com/c/phoenix-forum
- Source: https://github.com/phoenixframework/phoenix
