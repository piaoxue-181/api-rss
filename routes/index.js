import { readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import Router from "koa-router";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = new Router();

// 遍历所有路由模块
for (const filename of readdirSync(__dirname).filter(f => f.endsWith(".js") && f !== "index.js")) {
  const routerPath = join(__dirname, filename);
  const routerUrl = pathToFileURL(routerPath).href; // 转为 file:// URL
  const routerModule = (await import(routerUrl)).default;
  if (routerModule instanceof Router) {
    router.use(routerModule.routes());
  }
}

export default router;
