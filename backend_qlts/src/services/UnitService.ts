import { AppDataSource } from "../data-source";
import { Unit } from "../entity/Unit";
import { BaseService } from "./BaseService";
import ExistedException from "../exceptions/ExistedException";

export class UnitService extends BaseService<Unit> {
  constructor() {
    super(AppDataSource.getRepository(Unit));
  }

  // CREATE
  public async createUnit(params: string): Promise<Unit> {
    // Kiểm tra trùng tên
    const existed = await this.repository.findOne({ where: { name: params } });
    if (existed) throw new ExistedException("unit");

    const unit = this.repository.create({name: params});
    const saved = await this.repository.save(unit);
    return saved;
  }

  // READ (get all)
  public async getAllUnits(): Promise<Unit[]> {
    const units = await this.repository.find();
    console.log(units)
    return units;
  }



}