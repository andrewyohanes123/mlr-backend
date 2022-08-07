import express from 'express';
import ModelFactoryInterface from '../models/typings/ModelFactoryInterface';
import { Routes } from './typings/RouteInterface';
import a from '../middlewares/wrapper/a';
import { OkResponse } from './typings/BodyBuilderInterface';
import { PaginatedResult } from './typings/QueryInterface';
import sequelize from 'sequelize';
import { Parser } from '../helpers/Parser';
import NotFoundError from '../classes/NotFoundError';
import { VariableInstance, VariableAttributes } from '../models/Variable';

const variablesRoutes: Routes = (
	app: express.Application,
	models: ModelFactoryInterface,
): express.Router => {
	const router: express.Router = express.Router();

	router.get(
		'/',
		Parser.validateQ(),
		a(
			async (req: express.Request, res: express.Response): Promise<void> => {
				const parsed: sequelize.FindOptions<VariableInstance> = Parser.parseQuery<
					VariableInstance
				>(req.query.q, models);
				const data: PaginatedResult<VariableInstance> = await models.Variable.findAndCountAll(
					parsed,
				);
				const body: OkResponse = { data };

				res.json(body);
			},
		),
	);

	router.get(
		'/calculated-variables',
		a(
			async (req: express.Request, res: express.Response): Promise<void> => {
				const data: PaginatedResult<VariableInstance> = await models.Variable.findAndCountAll({
					attributes: ['x1', 'x2', 'x3', 'x4'],
				});
				const body: OkResponse = { data };

				res.json(body);
			},
		),
	);

	router.get(
		'/:id',
		a(
			async (req: express.Request, res: express.Response): Promise<void> => {
				const { id }: any = req.params;
				const variable: VariableInstance | null = await models.Variable.findByPk(id);
				if (!variable) throw new NotFoundError('Variable tidak ditemukan');
				const body: OkResponse = { data: variable };

				res.json(body);
			},
		),
	);

	router.post(
		'/',
		// validation,
		a(
			async (req: express.Request, res: express.Response): Promise<void> => {
				const attributes: VariableAttributes = req.body;
				const variable: VariableInstance = await models.Variable.create(attributes);
				const body: OkResponse = { data: variable };

				res.json(body);
			},
		),
	);

	router.put(
		'/:id',
		// validation,
		a(
			async (req: express.Request, res: express.Response): Promise<void> => {
				const { id }: any = req.params;
				const attributes: VariableAttributes = req.body;
				const variable: VariableInstance | null = await models.Variable.findByPk(id);
				if (!variable) throw new NotFoundError('Variable tidak ditemukan');
				const updatedVariable: VariableInstance = await variable.update(attributes);
				const body: OkResponse = { data: updatedVariable };

				res.json(body);
			},
		),
	);

	router.delete(
		'/:id',
		a(
			async (req: express.Request, res: express.Response): Promise<void> => {
				const { id }: any = req.params;
				const variable: VariableInstance | null = await models.Variable.findByPk(id);
				if (!variable) throw new NotFoundError('Variable tidak ditemukan');
				await variable.destroy();
				const body: OkResponse = { data: variable };

				res.json(body);
			},
		),
	);

	return router;
};

export default variablesRoutes;
