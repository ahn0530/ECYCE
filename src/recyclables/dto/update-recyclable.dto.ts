import { PartialType } from '@nestjs/mapped-types';
import { CreateRecyclableDto } from './create-recyclable.dto';

export class UpdateRecyclableDto extends PartialType(CreateRecyclableDto) {}