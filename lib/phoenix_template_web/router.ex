defmodule PhoenixTemplateWeb.Router do
  use PhoenixTemplateWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, {PhoenixTemplateWeb.LayoutView, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :admin_only do
    plug :admin_basic_auth
  end

  scope "/", PhoenixTemplateWeb do
    pipe_through :browser

    get "/", PageController, :index
  end

  # Other scopes may use custom stacks.
  # scope "/api", PhoenixTemplateWeb do
  #   pipe_through :api
  # end

  scope "/" do
    import Phoenix.LiveDashboard.Router

    if Mix.env() in [:dev, :test] do
      pipe_through :browser
    else
      pipe_through [:browser, :admin_only]
    end

    live_dashboard "/dashboard",
      metrics: PhoenixTemplateWeb.Telemetry,
      ecto_repos: [PhoenixTemplate.Repo]
  end

  # Enables the Swoosh mailbox preview in development.
  #
  # Note that preview only shows emails that were sent by the same
  # node running the Phoenix server.
  if Mix.env() == :dev do
    scope "/dev" do
      pipe_through :browser

      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end

  defp admin_basic_auth(conn, _opts) do
    username = System.fetch_env!("ADMIN_USERNAME")
    password = System.fetch_env!("ADMIN_PASSWORD")
    Plug.BasicAuth.basic_auth(conn, username: username, password: password)
  end
end
