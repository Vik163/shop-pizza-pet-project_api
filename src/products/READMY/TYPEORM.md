### TypeORM

- Использовал библиотеку [TypeORM](https://docs.nestjs.com/techniques/database)

  - конфиг в app.module
  - привязка к БД в файлах module: import `TypeOrmModule.forFeature([Drinks])` где Drinks - entity
  - простые операции с nest [здесь](https://gist.github.com/davisperezg/f4f7ef013e4e29ac6746cf6cf2dccc30)

```javascript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDTO } from '../dto/product.dto';

@Injectable()
export class ProductsService {
    constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    ) {}

    //Get all products
    async findAllProducts(): Promise<Product[]> {
        return await this.productRepository.find();
    }

    //Get a single product
    async findOneProduct(id: string): Promise<Product> {
        return await this.productRepository.findOne(id);
    }

    //Post a single product
    async createProduct(createProductDTO: CreateProductDTO): Promise<Product> {
        const newProduct = this.productRepository.create(createProductDTO);
        return await this.productRepository.save(newProduct);
    }

    //Put a single product
    async updateProduct(
        id: string,
        createProductDTO: CreateProductDTO,
    ): Promise<Product> {
        const product = await this.productRepository.findOne(id);
        this.productRepository.merge(product, createProductDTO);
        return this.productRepository.save(product);
    }

    //Delete a single product
    async deleteProduct(id: string): Promise<Boolean> {
        await this.productRepository.delete(id);
        return true;
    }
}

```
