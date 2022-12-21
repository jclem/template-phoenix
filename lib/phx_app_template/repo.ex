defmodule PhxAppTemplate.Repo do
  use Ecto.Repo,
    otp_app: :phx_app_template,
    adapter: Ecto.Adapters.Postgres
end
