const path = require("path");
const Autoload = require("@fastify/autoload");
const fastify = require("fastify")({ logger: true });


// Load environment first!
fastify.register(require("./environment.js"));

// autoloads plugins and routes
// plugins
fastify.register(Autoload, {
  dir: path.join(__dirname, "plugins"),
  options: Object.assign({}),
});
//routes
fastify.register(Autoload, {
  dir: path.join(__dirname, "routes"),
  options: Object.assign({}),
});
// end of auto loads

const start = async () => {
  try {
    await fastify.listen({ port: 6969 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
