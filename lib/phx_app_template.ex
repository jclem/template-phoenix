defmodule PhxAppTemplate do
  @moduledoc """
  PhxAppTemplate keeps the contexts that define your domain
  and business logic.

  Contexts are also responsible for managing your data, regardless
  if it comes from the database, an external API or others.
  """

  def context do
    quote do
      import Ecto.Changeset
      import Ecto.Query, warn: false
      import Ecto
      alias PhxAppTemplate.Repo
    end
  end

  def schema do
    quote do
      use Ecto.Schema
      import Ecto.Changeset
      import Ecto.Query
      @timestamps_opts [type: :utc_datetime]
      @type t :: %__MODULE__{}
      @type changeset :: Ecto.Changeset.t(t)
    end
  end

  defmacro __using__(which) when is_atom(which) do
    apply(__MODULE__, which, [])
  end
end
