import { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/ProductService";
import HttpException from "../exceptions/HttpException";
import { HttpStatus, Status } from "../constant/HttpStatus";
import { ProductDto, CreateProductDto, UpdateProductDto } from "../types/ProductDto";
import { ProductPaginateRequest, PaginateInfo } from "../types/PageinateInfo";

class ProductController {
  public productService = new ProductService();

  // GET "/product/:id"
  public getProductById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      const data: ProductDto = await this.productService.getProductById(id);
      return res.status(HttpStatus.OK).json({
        status: Status.SUCCESS,
        product: data,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json({
          status: error.status,
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: Status.ERROR,
          message: error.message || "Internal Server Error",
        });
      }
    }
  };

  // POST "/product/paginate"
  public getProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const params: ProductPaginateRequest = req.body;
      const data = await this.productService.getPaginatedProducts(params);
      return res.status(HttpStatus.OK).json({
        status: Status.SUCCESS,
        products: data,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json({
          status: error.status,
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: Status.ERROR,
          message: error.message || "Internal Server Error",
        });
      }
    }
  };

  // POST "/product"
  public createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const productData: CreateProductDto = req.body;
      const newProduct = await this.productService.createProduct(productData);
      return res.status(HttpStatus.CREATED).json({
        status: Status.SUCCESS,
        data: newProduct,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json({
          status: error.status,
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: Status.ERROR,
          message: error.message || "Internal Server Error",
        });
      }
    }
  };

  // PUT "/product/:id"
  public updateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const productId = Number(req.params.id);
      const productData: UpdateProductDto = req.body;
      const updatedProduct = await this.productService.updateProduct(productId, productData);
      return res.status(HttpStatus.OK).json({
        status: Status.SUCCESS,
        data: updatedProduct,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json({
          status: error.status,
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: Status.ERROR,
          message: error.message || "Internal Server Error",
        });
      }
    }
  };

  // DELETE "/product/:id"
  public deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      await this.productService.deleteProduct(id);
      return res.status(HttpStatus.OK).json({
        status: Status.SUCCESS,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json({
          status: error.status,
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: Status.ERROR,
          message: error.message || "Internal Server Error",
        });
      }
    }
  };
  public genNextProductCode = async (req: Request, res: Response) => {
    try {
      const nextProdCode = await this.productService.generateNextProductCode();
      return res.status(HttpStatus.OK).json({
        message: Status.SUCCESS,
        data: nextProdCode
      })
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json({
          status: error.status,
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: Status.ERROR,
          message: error.message || "Internal Server Error",
        });
      }
    }
  }
}

export default new ProductController();