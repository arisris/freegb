import { handleApiError, tokenGuard } from "@/libs/api/handlers";
import NextApiRoute from "@arisris/next-api-router";

export default NextApiRoute({
  onError: handleApiError
})
  .get("/list", tokenGuard({ required: false }), async (req, res) => {
    res.end();
  })
  .get("/show/:id", tokenGuard({ required: false }), async (req, res) => {
    res.end();
  })
  .post("/create", tokenGuard(), async (req, res) => {
    res.end();
  })
  .post("/update/:id", tokenGuard(), async (req, res) => {
    res.end();
  })
  .post("/delete/:id", tokenGuard(), async (req, res) => {
    res.end();
  }).handle;
