const errorHandler = (error, request, response, _next) => {
  console.warn(`Error occurred for ${request.path}: ${error.stack}`);
  response.status(500).send(`An error occurred for ${request.path}`);
};

export {
  errorHandler
};
