/**
 * Run build or dev with SKIP_ENV_VALIDATION to skip env validation. This is especially useful
 * for Docker builds.
 */
    await import("./src/env.js");
  
  /** @type {import("next").NextConfig} */
const nextConfig = {
    // Enable React Strict Mode for highlighting potential issues in your application
    reactStrictMode: true,
  
    webpack(config) {
      // Add SVG handling as React components
      config.module.rules.push({
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      });
  
      return config;
    }
  };
  
  export default nextConfig;

