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
import {
	getTotalXnPowScore,
	getTotalXnxnScore,
	getTotalXnYScore,
	getTotalXScore,
} from '../helpers/getTotalScore';
import { generateMatrixAn } from '../helpers/generateMatrix';

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
				const totalYScore = data.rows
					.map(({ x1, x2, x3, x4 }) => Math.fround((x1 + x2 + x3 + x4) / 4))
					.reduce((a, b) => a + b);
				const totalX1yScore = getTotalXnYScore(data.rows, 'x1');
				const totalX2yScore = getTotalXnYScore(data.rows, 'x2');
				const totalX3yScore = getTotalXnYScore(data.rows, 'x3');
				const totalX4yScore = getTotalXnYScore(data.rows, 'x4');
				const matrixH = [
					totalYScore,
					totalX1yScore,
					totalX2yScore,
					totalX3yScore,
					totalX4yScore,
				];
				const totalX1Score = getTotalXScore(data.rows, 'x1');
				const totalX2Score = getTotalXScore(data.rows, 'x2');
				const totalX3Score = getTotalXScore(data.rows, 'x3');
				const totalX4Score = getTotalXScore(data.rows, 'x4');
				const totalX1X2Score = getTotalXnxnScore(data.rows, 'x1', 'x2');
				const totalX1X4Score = getTotalXnxnScore(data.rows, 'x1', 'x3');
				const totalX1X3Score = getTotalXnxnScore(data.rows, 'x1', 'x4');
				const totalX2X3Score = getTotalXnxnScore(data.rows, 'x2', 'x3');
				const totalX2X4Score = getTotalXnxnScore(data.rows, 'x2', 'x4');
				const totalX3X4Score = getTotalXnxnScore(data.rows, 'x3', 'x4');
				const totalX1PowScore = getTotalXnPowScore(data.rows, 'x1');
				const totalX2PowScore = getTotalXnPowScore(data.rows, 'x2');
				const totalX3PowScore = getTotalXnPowScore(data.rows, 'x3');
				const totalX4PowScore = getTotalXnPowScore(data.rows, 'x4');
				const matrixA = [
					[data.count, totalX1Score, totalX2Score, totalX3Score, totalX4Score],
					[totalX1Score, totalX1PowScore, totalX1X2Score, totalX1X3Score, totalX1X4Score],
					[totalX2Score, totalX1X2Score, totalX2PowScore, totalX2X3Score, totalX2X4Score],
					[totalX3Score, totalX1X3Score, totalX2X3Score, totalX3PowScore, totalX3X4Score],
					[totalX4Score, totalX1X4Score, totalX2X4Score, totalX2X4Score, totalX4PowScore],
				];

				const matrixA1 = generateMatrixAn(matrixA, matrixH, 0);
				const matrixA2 = generateMatrixAn(matrixA, matrixH, 1);
				const matrixA3 = generateMatrixAn(matrixA, matrixH, 2);
				const matrixA4 = generateMatrixAn(matrixA, matrixH, 3);
				const matrixA5 = generateMatrixAn(matrixA, matrixH, 4);

				res.json({ matrixH, matrixA, matrixA1, matrixA2, matrixA3, matrixA4, matrixA5 });
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
