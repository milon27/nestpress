import { CommonUtil } from "../../../utils/common.util"
import { myLogger } from "../../logger"

export const runSeed = async () => {
    // all plans (free,single-basic,all-basic,pro-1,pro-2,pro-3)
    myLogger().info("seeding for plans")
    await CommonUtil.fakeAwait()
    myLogger().info("Seed Done")
    process.exit(0)
}
// eslint-disable-next-line no-void
void runSeed()
