defmodule PhxAppTemplateWeb.PageController do
  use PhxAppTemplateWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
