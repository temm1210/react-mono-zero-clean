const hasDocument = typeof document === "object" && document !== null;
const hasWindow = typeof window === "object" && window !== null;

const isBrowser = hasDocument && hasWindow;

export default isBrowser;
