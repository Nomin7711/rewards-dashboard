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
    return { pointsBalance: resident.pointsBalance, name: resident.name };
  }

  getProfile(residentId: number) {
    const resident = this.data.getResidentById(residentId);
    if (!resident) throw new NotFoundException('Resident not found');
    return {
      id: resident.id,
      name: resident.name,
      pointsBalance: resident.pointsBalance,
    };
  }

  getTransactions(
    residentId: number,
    page = 1,
    limit = 10,
  ): {
    data: ReturnType<DataService['getTransactionsByResidentId']>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    const resident = this.data.getResidentById(residentId);
    if (!resident) throw new NotFoundException('Resident not found');
    const list = this.data.getTransactionsByResidentId(residentId);
    const total = list.length;
    const limitClamped = Math.max(1, Math.min(limit, 100));
    const totalPages = Math.ceil(total / limitClamped) || 1;
    const pageSafe = Math.max(1, Math.min(page, totalPages));
    const start = (pageSafe - 1) * limitClamped;
    const data = list.slice(start, start + limitClamped);
    return { data, total, page: pageSafe, limit: limitClamped, totalPages };
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
