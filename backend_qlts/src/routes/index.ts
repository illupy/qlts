import userRouter from "./UserRoute"
import authRouter from "./AuthRoute"
import assetGroupRouter from "./AssetGroupRoute"
import assetTypeRouter from "./AssetTypeRoute"
import assetFlowRouter from "./AssetFlowRoute"
import partnerRouter from "./PartnerRoute"
import productRouter from "./ProductRoute"
import unitRouter from "./UnitRoute"
import dashboardRouter from "./DashboardRoute"
import { Express } from "express";
const route = (app: Express) => {
  app.use("/auth", authRouter);
  app.use("/users", userRouter);
  app.use("/asset-group", assetGroupRouter);
  app.use("/asset-type", assetTypeRouter);
  app.use("/asset-flow", assetFlowRouter);
  app.use("/partner", partnerRouter)
  app.use("/product", productRouter)
  app.use("/unit", unitRouter)
  app.use("/dashboard", dashboardRouter)
};
export default route;
