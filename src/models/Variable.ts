import Sequelize from 'sequelize';
import { SequelizeAttributes } from './typings/SequelizeAttributes';
import { Factory } from './typings/ModelInterface';
import ModelFactoryInterface from './typings/ModelFactoryInterface';

export interface VariableAttributes {
	id?: number;
	name: string;
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
		name: {
			type: DataTypes.STRING(191),
			allowNull: false,
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
