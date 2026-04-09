import { createAuthContext } from "../_shared/auth.ts";
import { createAuthRouter } from "../_shared/http.ts";
import { createGreeting } from "./handlers/create-greeting.ts";
import { getHello } from "./handlers/get-hello.ts";

const router = createAuthRouter("hello", createAuthContext);

router.get("/", getHello);
router.post("/", createGreeting);

export default router;
