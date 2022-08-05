import Sequelize from 'sequelize';
import { SequelizeAttributes } from './typings/SequelizeAttributes';
import { Factory } from './typings/ModelInterface';
import ModelFactoryInterface from './typings/ModelFactoryInterface';

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
}

export interface VariableInstance extends Sequelize.Instance<VariableAttributes>, VariableAttributes {
}

export interface Associate {
	(models: ModelFactoryInterface): void;
}

export const VariableFactory: Factory<VariableInstance, VariableAttributes> = (
	sequelize: Sequelize.Sequelize,
	DataTypes: Sequelize.DataTypes,
): Sequelize.Model<VariableInstance, VariableAttributes> => {
	const attributes: SequelizeAttributes<VariableAttributes> = {
		gender: {
			type: DataTypes.ENUM(["Laki - Laki", "Perempuan"]),
			allowNull: false,
		},
		occupation: {
			type: DataTypes.STRING(191),
			allowNull: false
		},
		age: {
			type: DataTypes.INTEGER(4),
			allowNull: false,
		},
		x1: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		x2: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		x3: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		x4: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
	};
	const Variable: Sequelize.Model<VariableInstance, VariableAttributes> = sequelize.define<
		VariableInstance,
		VariableAttributes
	>('variable', attributes, { underscored: true });

	Variable.associate = (models: ModelFactoryInterface): void => {
	};

	return Variable;
};
