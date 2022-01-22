export function isServerless() {
  return !!(process.env.VERCEL || false) || !!(process.env.SERVERLESS || false);
}