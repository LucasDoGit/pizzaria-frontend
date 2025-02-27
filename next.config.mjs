/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                // protocol: 'https', // desabilita para rodar em dev
                hostname: 'res.cloudinary.com'
            }
        ]
    }
};

export default nextConfig;
