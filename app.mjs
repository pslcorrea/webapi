import http from "node:http";
import { stock } from "./stock.mjs";
import { URL } from "node:url";

const server = http.createServer();

server.addListener("request", (request, response) => {
  const urlObject = new URL(`http://${request.headers.host}${request.url}`);
  if (urlObject.pathname === "/") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(JSON.stringify(stock));
    response.end();
  }
  if (urlObject.pathname === "/get-missing-products") {
    const missingProducts = stock.filter((product) => product.amountLeft === 0);
    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(JSON.stringify(missingProducts));
    response.end();
  }
  if (urlObject.pathname === "/get-by-id") {
    const selectedObject = stock.find(
      (product) => product.id === Number(urlObject.searchParams.get("id"))
    );
    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(JSON.stringify(selectedObject));
    response.end();
  }
});

server.listen(8000);
