import { createReactOidc } from "oidc-spa/react";
import { z } from "zod";

export const {
    OidcProvider,
    /**
     * Note: If you have multiple OidcProvider in your app
     * you do not need to use the useClient hook that that corresponds
     * to the above OidcProvider.
     */
    useOidc,
    prOidc
} = createReactOidc({
    issuerUri: import.meta.env.VITE_OIDC_ISSUER,
    clientId: import.meta.env.VITE_OIDC_CLIENT_ID,
    publicUrl: import.meta.env.BASE_URL,
    /**
     * This parameter is optional.
     *
     * It allows you to validate the shape of the idToken so that you
     * can trust that oidcTokens.decodedIdToken is of the expected shape
     * when the user is logged in.
     * What is actually inside the idToken is defined by the OIDC server
     * you are using.
     * The usage of zod here is just an example, you can use any other schema
     * validation library or write your own validation function.
     *
     * Note that zod will strip out all the fields that are not defined in the
     * schema, so to know exactly what is inside the idToken you can do:
     * decodedIdTokenSchema: {
     *   parse: (decodedIdToken)=> {
     *     console.log(decodedIdToken);
     *     return z.object({
     *       sub: z.string(),
     *       preferred_username: z.string()
     *     }).parse(decodedIdToken);
     *   }
     * }
     *
     * If you want to specify the type of the decodedIdToken but do not care
     * about validating the shape of the decoded idToken at runtime you can
     * call `createUseOidc<DecodedIdToken>()` without passing any parameter.
     *
     * Note however that in most webapp you do not need to look into the JWT
     * of the idToken on the frontend side, you usually obtain the user info
     * by querying a GET /user endpoint with a authorization header
     * like `Bearer <accessToken>`.
     */
    decodedIdTokenSchema: z.object({
        sub: z.string(),
        preferred_username: z.string()
    })
    //autoLogoutParams: { redirectTo: "current page" } // Default
    //autoLogoutParams: { redirectTo: "home" }
    //autoLogoutParams: { redirectTo: "specific url", url: "/a-page" }
});

// Using the mock adapter:
// To use this, just remove the code above and uncomment the code below.
// The mock oidc adapter will be enabled if the OIDC_ISSUER environment variable is not set.
/*
import { createReactOidc } from "oidc-spa/react";
import { createMockReactOidc } from "oidc-spa/mock/react";
import { z } from "zod";

const decodedIdTokenSchema = z.object({
    sub: z.string(),
    preferred_username: z.string()
});

const publicUrl = import.meta.env.BASE_URL;

export const { OidcProvider, useOidc, prOidc } =
    !import.meta.env.VITE_OIDC_ISSUER ?
        createMockReactOidc({
            isUserInitiallyLoggedIn: false,
            publicUrl,
            mockedTokens: {
                decodedIdToken: {
                    sub: "123",
                    preferred_username: "john doe"
                } satisfies z.infer<typeof decodedIdTokenSchema>
            }
        }) :
        createReactOidc({
            issuerUri: import.meta.env.VITE_OIDC_ISSUER,
            clientId: import.meta.env.VITE_OIDC_CLIENT_ID,
            publicUrl,
            decodedIdTokenSchema
        });
*/
