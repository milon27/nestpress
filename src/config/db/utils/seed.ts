import { CommonUtil } from "../../../utils/common.util"
import { myLogger } from "../../logger"

export const runSeed = async () => {
    myLogger().info("seeding...")
    await CommonUtil.fakeAwait()
    myLogger().info("Seed Done")
    process.exit(0)
}
// eslint-disable-next-line no-void
void runSeed()
