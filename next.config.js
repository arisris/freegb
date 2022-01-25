
/**
 * @type {import("next/types").NextConfig}
 */
module.exports = {
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  env: {
    HELLO: "World"
  },
  images: {
    domains: ["i.pravatar.cc"]
  }
};
