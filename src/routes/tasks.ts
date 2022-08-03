import express from 'express';
// @ts-ignore
import randomize from 'randomize';
import ModelFactoryInterface from '../models/typings/ModelFactoryInterface';
import { Routes } from './typings/RouteInterface';
import a from '../middlewares/wrapper/a';
import { OkResponse } from './typings/BodyBuilderInterface';
import { TaskAttributes, TaskInstance } from '../models/Task';
import NotFoundError from '../classes/NotFoundError';
import { PaginatedResult } from './typings/QueryInterface';
import sequelize from 'sequelize';
import { Parser } from '../helpers/Parser';
import onlyAuth from '../middlewares/protector/auth';

const tasksRoute: Routes = (
	app: express.Application,
	models: ModelFactoryInterface,
): express.Router => {
	const router: express.Router = express.Router();

	router.use(onlyAuth());

	router.get(
		'/',
		Parser.validateQ(),
		a(
			async (req: express.Request, res: express.Response): Promise<void> => {
				const parsed: sequelize.FindOptions<TaskInstance> = Parser.parseQuery<TaskInstance>(
					req.query.q,
					models,
				);
				parsed.distinct = true;
				parsed.attributes = ['id', 'name', 'description', 'due_date'];
				if (req.user.type === 'student') {
					parsed.include = [...parsed.include!, {
						attributes: ['id'],
						model: models.Document,
						include: [{
							attributes: ['id'],
							model: models.Participant,
							include: [{
								attributes: ['id'],
								model: models.User,
								as: 'student',
								where: { id: req.user.id! },
								required: true
							}],
							required: true
						}]
					}]
				}
				const data: PaginatedResult<TaskInstance> = await models.Task.findAndCountAll(parsed);
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
				const task: TaskInstance | null = await models.Task.findOne({ where: { id } });
				if (!task) throw new NotFoundError('Task tidak ditemukan');
				const body: OkResponse = { data: task };

				res.json(body);
			},
		),
	);

	router.post(
		'/',
		a(
			async (req: express.Request, res: express.Response): Promise<void> => {
				const data: TaskAttributes = req.body;
				const task: TaskInstance = await models.Task.create(data);
				const body: OkResponse = { data: task };

				res.json(body);
			},
		),
	);

	router.put(
		'/:id',
		a(
			async (req: express.Request, res: express.Response): Promise<void> => {
				const { id }: any = req.params;
				const data: TaskAttributes = req.body;
				const task: TaskInstance | null = await models.Task.findOne({ where: { id } });
				if (!task) throw new NotFoundError('Task tidak ditemukan');
				await task.update(data);
				const body: OkResponse = { data: task };

				res.json(body);
			},
		),
	);

	router.delete(
		'/:id',
		a(
			async (req: express.Request, res: express.Response): Promise<void> => {
				const { id }: any = req.params;
				const task: TaskInstance | null = await models.Task.findOne({ where: { id } });
				if (!task) throw new NotFoundError('Task tidak ditemukan');
				await task.destroy();
				const body: OkResponse = { data: task };

				res.json(body);
			},
		),
	);

	return router;
};

export default tasksRoute;
