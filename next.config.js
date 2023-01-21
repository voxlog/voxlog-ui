module.exports = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "coverartarchive.org",
        port: "",
        pathname: "/**",
      },
    ],
  },
};
