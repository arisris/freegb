import { handleApiError } from "@/libs/api/handlers";
import NextApiRoute from "@arisris/next-api-router";

export default NextApiRoute({
  onError: handleApiError
})
  .get("/list", async (req, res) => {
    res.end();
  })
  .get("/show/:id", async (req, res) => {
    res.end();
  })
  .post("/create", async (req, res) => {
    res.end();
  })
  .post("/update/:id", async (req, res) => {
    res.end();
  })
  .post("/delete/:id", async (req, res) => {
    res.end();
  }).handle;
