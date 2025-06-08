import { Repository, FindOptionsWhere, FindOptionsOrder } from "typeorm";
import { PaginateInfo, PaginateRequest } from "../types/PageinateInfo";

export class BaseService<T> {
  constructor(public repository: Repository<T>) {}

  async paginate({
    page = 1,
    pageSize = 10,
    where = {},
    order = {},
  }: PaginateRequest & { where?: FindOptionsWhere<T>; order?: FindOptionsOrder<T> }
  ): Promise<PaginateInfo<T>> {
    const [data, total] = await this.repository.findAndCount({
      where,
      order,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { data, total, page, pageSize };
  }
}
