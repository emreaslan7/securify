// import { authOptions } from "@/lib/AuthOptions";

// import NextAuth from "next-auth/next";

// const handler = NextAuth;

// export { handler as GET, handler as POST };

import { authOptions } from "@/lib/AuthOptions";
import NextAuth from "next-auth/next";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
