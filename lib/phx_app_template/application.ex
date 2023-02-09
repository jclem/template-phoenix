defmodule PhxAppTemplate.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    topologies = Application.get_env(:libcluster, :topologies) || []

    children = [
      # Start the Telemetry supervisor
      PhxAppTemplateWeb.Telemetry,
      # Start the Ecto repository
      PhxAppTemplate.Repo,
      # Start the PubSub system
      {Phoenix.PubSub, name: PhxAppTemplate.PubSub},
      # Start Finch
      {Finch, name: PhxAppTemplate.Finch},
      # Start the Endpoint (http/https)
      PhxAppTemplateWeb.Endpoint,
      # Start clustering
      {Cluster.Supervisor, [topologies, [name: App.ClusterSupervisor]]}
      # Start a worker by calling: PhxAppTemplate.Worker.start_link(arg)
      # {PhxAppTemplate.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: PhxAppTemplate.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    PhxAppTemplateWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
