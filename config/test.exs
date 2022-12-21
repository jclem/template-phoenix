import Config

# Configure your database
#
# The MIX_TEST_PARTITION environment variable can be used
# to provide built-in test partitioning in CI environment.
# Run `mix help test` for more information.
config :phx_app_template, PhxAppTemplate.Repo,
  username: "postgres",
  password: "postgres",
  hostname: "localhost",
  database: "phx_app_template_test#{System.get_env("MIX_TEST_PARTITION")}",
  pool: Ecto.Adapters.SQL.Sandbox,
  pool_size: 10

# Configure os_mon
config :os_mon,
  start_cpu_sup: false,
  start_disksup: false,
  start_memsup: false

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :phx_app_template, PhxAppTemplateWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "zkwSTomsKdtKfgLxFY6zO8RsQ3FTOKQdKzDNg/+HxDJeh5PaWTN+uF2j1i9mLss9",
  server: false

# In test we don't send emails.
config :phx_app_template, PhxAppTemplate.Mailer, adapter: Swoosh.Adapters.Test

# Print only warnings and errors during test
config :logger, level: :warn

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime
