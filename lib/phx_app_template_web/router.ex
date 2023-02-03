defmodule PhxAppTemplateWeb.Router do
  use PhxAppTemplateWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, {PhxAppTemplateWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :admin_only do
    plug :admin_basic_auth
  end

  scope "/", PhxAppTemplateWeb do
    pipe_through :browser

    get "/", PageController, :home
  end

  # Other scopes may use custom stacks.
  # scope "/api", PhxAppTemplateWeb do
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
      metrics: PhxAppTemplateWeb.Telemetry,
      ecto_repos: [PhxAppTemplate.Repo]
  end

  # Enable Swoosh mailbox preview in development
  if Application.compile_env(:phx_app_template, :dev_routes) do
    scope "/dev" do
      pipe_through :browser

      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end

  defp admin_basic_auth(conn, _opts) do
    username = PhxAppTemplateWeb.Endpoint.admin_username()
    password = PhxAppTemplateWeb.Endpoint.admin_password()

    conn
    |> Plug.BasicAuth.basic_auth(username: username, password: password)
    |> case do
      %Plug.Conn{halted: true} = conn ->
        conn

      conn ->
        assign(conn, :is_admin, true)
    end
  end
end
