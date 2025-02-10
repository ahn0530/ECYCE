import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateRecyclableDto } from './create-recyclable.dto';

export class UpdateRecyclableDto extends PartialType(
  OmitType(CreateRecyclableDto, ['barcode'] as const),
) {}
