/**
 * 获取友链
 */

const { get_query } = require("../utils/Rssleancloud");
const Router = require("koa-router");
const friendRouter = new Router();

friendRouter.get("/friend", async (ctx) => {
    return await get_query();
});

module.exports = friendRouter;
