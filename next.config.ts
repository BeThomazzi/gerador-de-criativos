import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@resvg/resvg-js"],
  devIndicators: false,

  // 1. Configuração para o Turbopack (Novo padrão do Next.js)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: { icon: true },
          },
        ],
        as: '*.js',
      },
    },
  },

  // 2. Configuração de fallback para o Webpack (Produção/Antigos)
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [{ loader: '@svgr/webpack', options: { icon: true } }],
    });

    return config;
  },
};

export default nextConfig;
