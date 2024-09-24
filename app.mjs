import http from "node:http";
import { stock } from "./stock.mjs";

const server = http.createServer();

server.addListener("request", (request, response) => {
  if (request.url === "/") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(JSON.stringify(stock));
    response.end();
  }
  if (request.url === "/get-missing-products") {
    const missingProducts = stock.filter((product) => product.amountLeft === 0);
    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(JSON.stringify(missingProducts));
    response.end();
  }
});

server.listen(8000);
