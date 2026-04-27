import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Inject,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { Roles, Session } from "@thallesp/nestjs-better-auth";
import { CustomersService } from "./customers.service";
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  SearchCustomerDto,
  CustomerFiltersDto,
} from "../../dtos/customers.dto";
import { PaginationDto } from "../../dtos/common.dto";
import type { UserSession } from "../../common/types/session";

@ApiTags("Customers")
@ApiBearerAuth()
@Controller("customers")
export class CustomersController {
  constructor(@Inject(CustomersService) private customersService: CustomersService) {}

  @Get()
  @Roles(["ba", "manager", "supervisor", "admin"])
  findAll(
    @Query() pagination: PaginationDto,
    @Query() filters: CustomerFiltersDto,
    @Session() session: UserSession,
  ) {
    return this.customersService.findAll(session.user, pagination, filters);
  }

  @Get("search")
  @Roles(["ba", "manager", "supervisor", "admin"])
  search(
    @Query() query: SearchCustomerDto,
    @Session() session: UserSession,
  ) {
    return this.customersService.search(
      query.query,
      query.type,
      session.user,
    );
  }

  @Get(":id")
  @Roles(["ba", "manager", "supervisor", "admin"])
  findOne(@Param("id") id: string, @Session() session: UserSession) {
    return this.customersService.findOne(id, session.user);
  }

  @Post()
  @Roles(["ba", "manager"])
  create(
    @Body() body: CreateCustomerDto,
    @Session() session: UserSession,
  ) {
    return this.customersService.create(body, session.user);
  }

  @Patch(":id")
  @Roles(["ba", "manager"])
  update(
    @Param("id") id: string,
    @Body() body: UpdateCustomerDto,
    @Session() session: UserSession,
  ) {
    return this.customersService.update(id, body, session.user);
  }

  @Delete(":id/arco")
  @Roles(["admin"])
  executeRightToBeForgotten(
    @Param("id") id: string,
    @Body("requestFolio") requestFolio: string,
    @Session() session: UserSession,
  ) {
    return this.customersService.executeRightToBeForgotten(
      id,
      requestFolio,
      session.user,
    );
  }
}
