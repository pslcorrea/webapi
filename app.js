import http from "node:http";
import { stock } from "./stock.js";
import { URL } from "node:url";
import jsonBody from "body/json.js";

const server = http.createServer();
let productStock = [...stock];

server.addListener("request", (request, response) => {
  const urlObject = new URL(`http://${request.headers.host}${request.url}`);
  if (urlObject.pathname === "/") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(JSON.stringify(productStock));
    response.end();
  }
  if (
    urlObject.pathname === "/get-missing-products" &&
    request.method === "GET"
  ) {
    const missingProducts = productStock.filter(
      (product) => product.amountLeft === 0
    );
    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(JSON.stringify(missingProducts));
    response.end();
  }
  if (
    urlObject.pathname === "/get-missing-products" &&
    request.method === "POST"
  ) {
    response.writeHead(405, { "Content-Type": "text/plain" });
    response.write(
      "Esse endpoint não permite o acesso por meio de uma requisição do tipo Post!"
    );
    response.end();
    return;
  }
  if (urlObject.pathname === "/get-by-id") {
    const idParam = urlObject.searchParams.get("id");
    if (!idParam || isNaN(idParam)) {
      response.writeHead(400, { "Content-Type": "text/plain" });
      response.write("Informe um ID númerico!");
      response.end();
      return;
    }
    const selectedObject = productStock.find(
      (product) => product.id === Number(idParam)
    );
    if (!selectedObject) {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.write("Não existe um produto com esse ID!");
      response.end();
      return;
    }
    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(JSON.stringify(selectedObject));
    response.end();
    return;
  }
  if (urlObject.pathname === "/delete-by-id" && request.method === "DELETE") {
    const idParam = urlObject.searchParams.get("id");
    if (!idParam || isNaN(idParam)) {
      response.writeHead(400, { "Content-Type": "text/plain" });
      response.write("Informe um ID númerico!");
      response.end();
      return;
    }
    const selectedObject = productStock.find(
      (product) => product.id === Number(idParam)
    );

    productStock = productStock.filter(
      (product) => product.id !== Number(idParam)
    );
    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(JSON.stringify(selectedObject ?? {}));
    response.end();
    return;
  }
  if (urlObject.pathname === "/create" && request.method === "POST") {
    jsonBody(request, response, (error, body) => {
      // Verificar se está tudo ok com a requisição
      if (error) {
        response.writeHead(400, { "Content-type": "text/plain" });
        response.write("Erro ao processar a requisição. ");
        response.write(error.message);
        response.end();
        return;
      }
      // Implementar lógica de adição do novo produto ao estoque
      const { productName, amountLeft } = body;
      const newProduct = {
        id: productStock.length,
        productName,
        amountLeft,
      };
      productStock.push(newProduct);
      // Retornar novo produto
      response.writeHead(200, { "Content-type": "application/json" });
      response.write(JSON.stringify(newProduct));
      response.end();
      return;
    });
  }
});

server.listen(8000);
