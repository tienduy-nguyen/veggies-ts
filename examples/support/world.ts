
import { setWorldConstructor } from "@cucumber/cucumber"
import {
    state,
    fixtures,
    httpApi,
    cli,
    fileSystem,
    snapshot, VeggiesWorld,
} from "../../lib"

setWorldConstructor(function (_this: VeggiesWorld) {
    state.extendWorld(_this)
    fixtures.extendWorld(_this)
    httpApi.extendWorld(_this)
    cli.extendWorld(_this)
    fileSystem.extendWorld(_this)
    snapshot.extendWorld(_this)
})

state.install()
fixtures.install()
httpApi.install()
cli.install()
fileSystem.install()
snapshot.install()
