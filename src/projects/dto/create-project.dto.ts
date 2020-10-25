import { IsUUID } from 'class-validator';
import { CreateProjectInput } from '../../graphql.schema';

export class CreateProjectDto extends CreateProjectInput {
    @IsUUID("4")
    id: string;
}
