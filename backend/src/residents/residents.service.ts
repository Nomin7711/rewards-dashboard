import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataService } from '../data/data.service';
import { RedeemDto } from './dto/redeem.dto';

@Injectable()
export class ResidentsService {
  constructor(private readonly data: DataService) {}

  getBalance(residentId: number) {
    const resident = this.data.getResidentById(residentId);
    if (!resident) throw new NotFoundException('Resident not found');
    return { pointsBalance: resident.pointsBalance };
  }

  getTransactions(residentId: number, limit?: number) {
    const resident = this.data.getResidentById(residentId);
    if (!resident) throw new NotFoundException('Resident not found');
    let list = this.data.getTransactionsByResidentId(residentId);
    if (limit) list = list.slice(0, limit);
    return list;
  }

  redeem(residentId: number, dto: RedeemDto) {
    const resident = this.data.getResidentById(residentId);
    if (!resident) throw new NotFoundException('Resident not found');

    const giftCard = this.data.getGiftCardById(dto.giftCardId);
    if (!giftCard) throw new BadRequestException('Gift card not found');

    const quantity = dto.quantity ?? 1;
    const totalCost = giftCard.pointCost * quantity;
    if (resident.pointsBalance < totalCost) {
      throw new BadRequestException('Insufficient points');
    }

    const tx = this.data.deductPointsAndRecordTransaction(
      residentId,
      totalCost,
      `Redeemed: ${giftCard.name}${quantity > 1 ? ` x${quantity}` : ''}`,
      { giftCardId: giftCard.id, giftCardName: giftCard.name },
    );
    if (!tx) throw new BadRequestException('Redemption failed');

    const updated = this.data.getResidentById(residentId)!;
    return { pointsBalance: updated.pointsBalance, transaction: tx };
  }
}
