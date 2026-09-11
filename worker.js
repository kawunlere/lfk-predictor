import { renderMines } from "./ui/mines.js";
import { analyzeMines } from "./engines/mines.js";

export default {
  async fetch(request, env) {
    var url = new URL(request.url);
    var path = url.pathname;
    if (path === "/" || path === "/mines") return new Response(renderMines(), { headers: { "Content-Type": "text/html" } });
    if (path === "/api/mines" && request.method === "POST") {
      try {
        var form = await request.formData();
        var data = {
          server_seed: form.get("server_seed") || "",
          client_seed: form.get("client_seed") || "",
          num_mines: form.get("num_mines") || "3"
        };
        var result = await analyzeMines(env, data);
        return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: e.message }), { headers: { "Content-Type": "application/json" } });
      }
    }
    return new Response("404", { status: 404 });
  }
};
