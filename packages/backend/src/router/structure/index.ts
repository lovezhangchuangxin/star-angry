import StructureController from '../../controller/structure'
import KoaRouter from 'koa-router'

const structureRouter = new KoaRouter()

structureRouter.get('/structure', StructureController.getStructures)

export default structureRouter
