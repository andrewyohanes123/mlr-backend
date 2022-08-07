import Sequelize from 'sequelize';
import { SequelizeAttributes } from './typings/SequelizeAttributes';
import { Factory } from './typings/ModelInterface';
import ModelFactoryInterface from './typings/ModelFactoryInterface';

export type TFirstStep = {
	x1y: number;
	x2y: number;
	x3y: number;
	x4y: number;
	x1x2: number;
	x1x3: number;
	x1x4: number;
	x2x3: number;
	x2x4: number;
	x3x4: number;
	x12: number;
	x22: number;
	x32: number;
	x42: number;
};

export interface VariableAttributes {
	id?: number;
	gender: string;
	occupation: string;
	age: number;
	x1: number;
	x2: number;
	x3: number;
	x4: number;
	created_at?: Date;
	updated_at?: Date;
	first_step?: TFirstStep;
}

export interface VariableInstance
	extends Sequelize.Instance<VariableAttributes>,
		VariableAttributes {}

export interface Associate {
	(models: ModelFactoryInterface): void;
}

export const VariableFactory: Factory<VariableInstance, VariableAttributes> = (
	sequelize: Sequelize.Sequelize,
	DataTypes: Sequelize.DataTypes,
): Sequelize.Model<VariableInstance, VariableAttributes> => {
	const attributes: SequelizeAttributes<VariableAttributes> = {
		gender: {
			type: DataTypes.ENUM(['Laki - Laki', 'Perempuan']),
			allowNull: false,
		},
		occupation: {
			type: DataTypes.STRING(191),
			allowNull: false,
		},
		age: {
			type: DataTypes.INTEGER(4),
			allowNull: false,
		},
		x1: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		x2: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		x3: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		x4: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
	};
	const Variable: Sequelize.Model<VariableInstance, VariableAttributes> = sequelize.define<
		VariableInstance,
		VariableAttributes
	>('variable', attributes, {
		underscored: true,
		hooks: {
			afterFind(instances, fn?) {
				if (Array.isArray(instances)) {
					instances.forEach(instance => {
						const { x1, x2, x3, x4 } = instance;
						const y = Math.fround((x1 + x2 + x3 + x4) / 4);
						instance.setDataValue('first_step', {
							x1y: x1 * y,
							x2y: x2 * y,
							x3y: x3 * y,
							x4y: x4 * y,
							x1x2: x1 * x2,
							x1x3: x1 * x3,
							x1x4: x1 * x4,
							x2x3: x2 * x3,
							x2x4: x2 * x4,
							x3x4: x3 * x4,
							x12: Math.pow(x1, 2),
							x22: Math.pow(x2, 2),
							x32: Math.pow(x3, 2),
							x42: Math.pow(x4, 2),
						});
					});
				}
			},
		},
	});

	Variable.associate = (models: ModelFactoryInterface): void => {};

	return Variable;
};
