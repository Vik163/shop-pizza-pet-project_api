### Пагинация, фильтры, сортировка

[ссылка](https://dev.to/bhkfazano/how-to-create-paginated-sortable-and-filterable-endpoints-with-nestjs-4bom)

- создается декоратор @PaginationParams()
  - данные получает из query, обрабатывает и возвращает

```javascript
import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface Pagination {
    page: number;
    limit: number;
    size: number;
    offset: number;
}

export const PaginationParams = createParamDecorator((data, ctx: ExecutionContext): Pagination => {
    const req: Request = ctx.switchToHttp().getRequest();
    const page = parseInt(req.query.page as string);
    const size = parseInt(req.query.size as string);

    // check if page and size are valid
    if (isNaN(page) || page < 0 || isNaN(size) || size < 0) {
        throw new BadRequestException('Invalid pagination params');
    }
    // do not allow to fetch large slices of the dataset
    if (size > 100) {
        throw new BadRequestException('Invalid pagination params: Max size is 100');
    }

    // calculate pagination parameters
    const limit = size;
    const offset = page * limit;
    return { page, limit, size, offset };
});
```

- создается @SortingParams(validParams)
  Этот декоратор отвечает за синтаксический анализ параметра запроса, который поступает в формате paramName:direction в объект, проверяя, являются ли направление и параметр допустимыми. Допустимыми значениями для direction являются asc и desc , а допустимыми параметрами является массив строк, отправляемых контроллером.

```javascript
import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface Sorting {
    property: string;
    direction: string;
}

export const SortingParams = createParamDecorator((validParams, ctx: ExecutionContext): Sorting => {
    const req: Request = ctx.switchToHttp().getRequest();
    const sort = req.query.sort as string;
    if (!sort) return null;

    // check if the valid params sent is an array
    if (typeof validParams != 'object') throw new BadRequestException('Invalid sort parameter');

    // check the format of the sort query param
    const sortPattern = /^([a-zA-Z0-9]+):(asc|desc)$/;
    if (!sort.match(sortPattern)) throw new BadRequestException('Invalid sort parameter');

    // extract the property name and direction and check if they are valid
    const [property, direction] = sort.split(':');
    if (!validParams.includes(property)) throw new BadRequestException(`Invalid sort property: ${property}`);

    return { property, direction };
});
```

- @FilteringParms(validParams)
  Этот декоратор отвечает за анализ параметров фильтрации (в этом примере мы можем фильтровать только один столбец за раз), которые представлены в формате paramName:rule:value, и проверяет их аналогично последнему.

```javascript
import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface Filtering {
    property: string;
    rule: string;
    value: string;
}

// valid filter rules
export enum FilterRule {
    EQUALS = 'eq',
    NOT_EQUALS = 'neq',
    GREATER_THAN = 'gt',
    GREATER_THAN_OR_EQUALS = 'gte',
    LESS_THAN = 'lt',
    LESS_THAN_OR_EQUALS = 'lte',
    LIKE = 'like',
    NOT_LIKE = 'nlike',
    IN = 'in',
    NOT_IN = 'nin',
    IS_NULL = 'isnull',
    IS_NOT_NULL = 'isnotnull',
}

export const FilteringParams = createParamDecorator((data, ctx: ExecutionContext): Filtering => {
    const req: Request = ctx.switchToHttp().getRequest();
    const filter = req.query.filter as string;
    if (!filter) return null;

    // check if the valid params sent is an array
    if (typeof data != 'object') throw new BadRequestException('Invalid filter parameter');

    // validate the format of the filter, if the rule is 'isnull' or 'isnotnull' it don't need to have a value
    if (!filter.match(/^[a-zA-Z0-9_]+:(eq|neq|gt|gte|lt|lte|like|nlike|in|nin):[a-zA-Z0-9_,]+$/) && !filter.match(/^[a-zA-Z0-9_]+:(isnull|isnotnull)$/)) {
        throw new BadRequestException('Invalid filter parameter');
    }

    // extract the parameters and validate if the rule and the property are valid
    const [property, rule, value] = filter.split(':');
    if (!data.includes(property)) throw new BadRequestException(`Invalid filter property: ${property}`);
    if (!Object.values(FilterRule).includes(rule as FilterRule)) throw new BadRequestException(`Invalid filter rule: ${rule}`);

    return { property, rule, value };
});
```

- TypeOrm helpers
  мы напишем несколько вспомогательных функций для генерации нашего объекта where и нашего объекта order для использования с методами репозитория TypeORM.

```javascript
import { IsNull, Not, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, ILike, In } from "typeorm";

import { Filtering } from "src/helpers/decorators/filtering-params.decorator"
import { Sorting } from "src/helpers/decorators/sorting-params.decorator";
import { FilterRule } from "src/helpers/decorators/filtering-params.decorator";

export const getOrder = (sort: Sorting) => sort ? { [sort.property]: sort.direction } : {};

export const getWhere = (filter: Filtering) => {
    if (!filter) return {};

    if (filter.rule == FilterRule.IS_NULL) return { [filter.property]: IsNull() };
    if (filter.rule == FilterRule.IS_NOT_NULL) return { [filter.property]: Not(IsNull()) };
    if (filter.rule == FilterRule.EQUALS) return { [filter.property]: filter.value };
    if (filter.rule == FilterRule.NOT_EQUALS) return { [filter.property]: Not(filter.value) };
    if (filter.rule == FilterRule.GREATER_THAN) return { [filter.property]: MoreThan(filter.value) };
    if (filter.rule == FilterRule.GREATER_THAN_OR_EQUALS) return { [filter.property]: MoreThanOrEqual(filter.value) };
    if (filter.rule == FilterRule.LESS_THAN) return { [filter.property]: LessThan(filter.value) };
    if (filter.rule == FilterRule.LESS_THAN_OR_EQUALS) return { [filter.property]: LessThanOrEqual(filter.value) };
    if (filter.rule == FilterRule.LIKE) return { [filter.property]: ILike(`%${filter.value}%`) };
    if (filter.rule == FilterRule.NOT_LIKE) return { [filter.property]: Not(ILike(`%${filter.value}%`)) };
    if (filter.rule == FilterRule.IN) return { [filter.property]: In(filter.value.split(',')) };
    if (filter.rule == FilterRule.NOT_IN) return { [filter.property]: Not(In(filter.value.split(','))) };
}
```

Эти функции в основном создают объекты на основе свойств, возвращаемых декораторами. Например, если фильтр имеет значение city:like:Campinas, мы получим:

```javascript
{
  city: ILike(`%Campinas%`);
}
```

- dto

```javascript
export type PaginatedResource<T> = {
    totalItems: number;
    items: T[];
    page: number;
    size: number;
};
```

- Controller

```javascript
@Controller('cities')
export class CitiesController {
    private readonly logger = new Logger(CitiesController.name);

    constructor(
        private readonly cityService: CityService,
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    public async getCities(
        @PaginationParams() paginationParams: Pagination,
        @SortingParams(['name', 'id', 'stateId']) sort?: Sorting,
        @FilteringParams(['name', 'id', 'stateId']) filter?: Filtering
    ): Promise<PaginatedResource<Partial<City>>> {
        this.logger.log(`REST request to get cities: ${JSON.stringify(paginationParams)}, ${sort}, ${filter}`);
        return await this.cityService.getCities(paginationParams, sort, filter);
    }
}
```

- Service

```javascript
@Injectable()
export class CityService {
    constructor(
        @InjectRepository(City)
        private readonly cityRepository: Repository<City>,
    ) { }

    public async getCities(
        { page, limit, size, offset }: Pagination,
        sort?: Sorting,
        filter?: Filtering,
    ): Promise<PaginatedResource<Partial<Language>>> {
        const where = getWhere(filter);
        const order = getOrder(sort);

        const [languages, total] = await this.cityRepository.findAndCount({
            where,
            order,
            take: limit,
            skip: offset,
        });

        return {
            totalItems: total,
            items: languages,
            page,
            size
        };
    }
}
```
