/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: 'build_node',
    env: {
        URL_API: "http://localhost:5000/"
    }
};

export default nextConfig;
